'use strict';

const APP_VERSION = '0.1.0-pilot';
const DB_NAME = 'catu-er-db';
const DB_VERSION = 1;
const STATE_KEY = 'workspace-state';
const MAX_LOCAL_USERS = 25;

const STATUS_SCORES = {
  'No evaluado': 0,
  'Conforme': 100,
  'Subsanable': 70,
  'Crítico': 30,
  'No subsanable / posible responsabilidad': 0,
  'No aplica': null,
};
const EVIDENCE_SCORES = {
  'No evaluada': 0,
  'Sin evidencia': 0,
  'Insuficiente': 25,
  'Parcial': 50,
  'Completa no verificada': 75,
  'Completa verificada': 100,
  'No aplica': null,
};
const RISK_WEIGHTS = {1:1,2:1.5,3:2,4:3};
const DEFAULT_WEIGHTS = { compliance: 0.65, evidence: 0.35 };
const THRESHOLDS = { high: 90, controlled: 75, vulnerable: 60 };
const STATUS_OPTIONS = Object.keys(STATUS_SCORES);
const EVIDENCE_OPTIONS = Object.keys(EVIDENCE_SCORES);
const SCENARIOS = [
  'Sin incidencia','Documento inexistente','Documento incompleto','Información desactualizada',
  'Inconsistencia con contabilidad u otras bases','Falta de firmas o autorizaciones',
  'Bien físicamente no localizado','Expediente perdido o no localizado','Saldo no conciliado',
  'Irregularidad aparentemente no subsanable','Obligación dependiente de tercero'
];
const ROUTES = ['No aplica','A — Subsanación','B — Regularización documental','C — No subsanable / canalización'];
const OIC_OPTIONS = ['Pendiente','Validado','Rechazado','No aplica'];
const ROLES = [
  {id:'admin', label:'Administrador municipal'},
  {id:'coordinator', label:'Coordinador E-R'},
  {id:'area', label:'Responsable de área'},
  {id:'oic', label:'Revisor/OIC'},
  {id:'catu', label:'Consultor CATU'},
];

let controls = [];
let baseline = {verifiedAt:'2026-09-10', activeControls:84};
let state = null;
let currentView = 'home';
let activeControlId = null;
let deferredInstallPrompt = null;

const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];
const esc = (s='') => String(s ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const isoDate = d => d ? new Date(d).toISOString().slice(0,10) : '';
const fmtDate = v => {
  if (!v) return '—';
  const d = new Date(v + (String(v).length===10 ? 'T12:00:00' : ''));
  return Number.isNaN(d.getTime()) ? esc(v) : new Intl.DateTimeFormat('es-MX',{day:'2-digit',month:'short',year:'numeric'}).format(d);
};
const pct = v => `${Math.round((Number(v)||0)*10)/10}%`;
const nowIso = () => new Date().toISOString();
const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;

function openDB(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
async function idbGet(key){
  const db=await openDB();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('kv','readonly');
    const req=tx.objectStore('kv').get(key);
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
async function idbSet(key,value){
  const db=await openDB();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('kv','readwrite');
    tx.objectStore('kv').put(value,key);
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error);
  });
}

function newState(){
  const users = [
    {id:'u-admin',name:'Administrador Municipal',role:'admin',area:'Todas'},
    {id:'u-coord',name:'Coordinador E-R',role:'coordinator',area:'Todas'},
    {id:'u-area',name:'Responsable de Área',role:'area',area:'Hacienda municipal'},
    {id:'u-oic',name:'Revisor OIC',role:'oic',area:'Todas'},
    {id:'u-catu',name:'Consultor CATU',role:'catu',area:'Todas'},
  ];
  return {
    version: APP_VERSION,
    mode: 'local-pilot',
    workspace: {
      id:'workspace-demo',
      municipality:'Municipio piloto',
      state:'Guerrero',
      outgoingPeriod:'',
      incomingPeriod:'',
      baselineDate: baseline.verifiedAt,
      maxUsers: MAX_LOCAL_USERS,
      notes:'',
    },
    users,
    currentUserId:'u-catu',
    assessments:{},
    evidence:[],
    config:{weights:{...DEFAULT_WEIGHTS},riskWeights:{...RISK_WEIGHTS},thresholds:{...THRESHOLDS}},
    auditLog:[],
    updatedAt: nowIso(),
  };
}

async function loadData(){
  const urls=['./data/runtime/controls-1.json','./data/runtime/controls-2.json','./data/runtime/controls-3.json'];
  const payloads=await Promise.all(urls.map(async url=>{const res=await fetch(url); if(!res.ok) throw new Error('No fue posible cargar la baseline normativa.'); return res.json();}));
  controls=payloads.flatMap(p=>p.controls);
  baseline={...payloads[0],controls:undefined};
  state=await idbGet(STATE_KEY);
  if(!state || !state.workspace){
    state=newState();
    await saveState();
  } else {
    state.workspace.baselineDate ||= baseline.verifiedAt;
    state.config ||= {weights:{...DEFAULT_WEIGHTS},riskWeights:{...RISK_WEIGHTS},thresholds:{...THRESHOLDS}};
    state.config.weights ||= {...DEFAULT_WEIGHTS};
    state.config.riskWeights ||= {...RISK_WEIGHTS};
    state.config.thresholds ||= {...THRESHOLDS};
    state.assessments ||= {};
    state.evidence ||= [];
    state.users ||= newState().users;
    state.auditLog ||= [];
  }
}
async function saveState(logEntry){
  state.updatedAt=nowIso();
  if(logEntry){
    state.auditLog.unshift({id:uid('log'),at:nowIso(),user:currentUser()?.name||'Sistema',...logEntry});
    state.auditLog=state.auditLog.slice(0,300);
  }
  await idbSet(STATE_KEY,state);
}

function currentUser(){ return state.users.find(u=>u.id===state.currentUserId) || state.users[0]; }
function roleLabel(role){ return ROLES.find(r=>r.id===role)?.label || role; }
function canEditGeneral(){ return ['admin','coordinator','area','catu'].includes(currentUser().role); }
function canEditOic(){ return currentUser().role === 'oic'; }
function canEditWorkspace(){ return ['admin','coordinator','catu'].includes(currentUser().role); }
function canReset(){ return ['admin','catu'].includes(currentUser().role); }

function defaultAssessment(control){
  return {
    id:control.id,status:'No evaluado',evidenceStatus:'No evaluada',scenario:'Sin incidencia',route:'No aplica',
    responsible:control.responsibleBase||'',dueDate:'',progress:0,residualRisk:control.baseRisk||2,
    evidenceLink:'',notes:'',oicValidation:'Pendiente',evaluatedAt:'',evaluator:'',closedAt:'',updatedAt:''
  };
}
function assessmentFor(id){
  const c=controls.find(x=>x.id===id);
  return state.assessments[id] ? {...defaultAssessment(c),...state.assessments[id]} : defaultAssessment(c);
}

function r086Validated(){
  const a=assessmentFor('R086');
  return a.status==='Conforme' && a.evidenceStatus==='Completa verificada' && a.oicValidation==='Validado';
}

function scoreControl(control,a){
  if(a.status==='No aplica') return {applicable:false,compliance:null,evidence:null,score:null,weight:0,weighted:0};
  const compliance=STATUS_SCORES[a.status] ?? 0;
  const evidence=EVIDENCE_SCORES[a.evidenceStatus] ?? 0;
  const w1=Number(state.config.weights.compliance ?? DEFAULT_WEIGHTS.compliance);
  const w2=Number(state.config.weights.evidence ?? DEFAULT_WEIGHTS.evidence);
  const score=compliance*w1 + evidence*w2;
  const weight=Number(state.config.riskWeights[a.residualRisk || control.baseRisk] || 1);
  return {applicable:true,compliance,evidence,score,weight,weighted:score*weight};
}
function metrics(){
  let weight=0, weighted=0, evidenceWeighted=0, complianceWeighted=0;
  let applicable=0,evaluated=0,conforme=0,subsanable=0,critical=0,nonSub=0,noApply=0,closed=0;
  const byModule={};
  const alerts=[];
  const today=new Date(); today.setHours(0,0,0,0);
  for(const c of controls){
    const a=assessmentFor(c.id);
    const sc=scoreControl(c,a);
    const mm=c.macroModule;
    byModule[mm] ||= {name:mm,weight:0,weighted:0,evidenceWeighted:0,complianceWeighted:0,applicable:0,evaluated:0,critical:0};
    if(!sc.applicable){ noApply++; continue; }
    applicable++; byModule[mm].applicable++;
    weight+=sc.weight; weighted+=sc.weighted; evidenceWeighted+=sc.evidence*sc.weight; complianceWeighted+=sc.compliance*sc.weight;
    byModule[mm].weight+=sc.weight; byModule[mm].weighted+=sc.weighted; byModule[mm].evidenceWeighted+=sc.evidence*sc.weight; byModule[mm].complianceWeighted+=sc.compliance*sc.weight;
    if(a.status!=='No evaluado'){ evaluated++; byModule[mm].evaluated++; }
    if(a.status==='Conforme') conforme++;
    if(a.status==='Subsanable') subsanable++;
    if(a.status==='Crítico'){ critical++; byModule[mm].critical++; }
    if(a.status==='No subsanable / posible responsabilidad'){ nonSub++; byModule[mm].critical++; }
    if(a.status==='Conforme' && a.evidenceStatus==='Completa verificada' && a.oicValidation==='Validado') closed++;

    if(a.status==='No subsanable / posible responsabilidad') alerts.push({level:4,id:c.id,title:'Escalar / preservar evidencia',text:c.requirement});
    else if(a.status==='Crítico') alerts.push({level:3,id:c.id,title:'Control crítico',text:c.requirement});
    if(a.dueDate && a.status!=='Conforme'){
      const due=new Date(a.dueDate+'T00:00:00');
      const days=Math.ceil((due-today)/86400000);
      if(days<0) alerts.push({level:3,id:c.id,title:`Acción vencida ${Math.abs(days)} d`,text:c.requirement});
      else if(days<=7) alerts.push({level:2,id:c.id,title:`Vence en ${days} d`,text:c.requirement});
    }
    if(a.status!=='No evaluado' && a.status!=='No aplica' && !['Completa verificada'].includes(a.evidenceStatus)) alerts.push({level:1,id:c.id,title:'Evidencia por completar',text:c.requirement});
  }
  const iper=weight ? weighted/weight : 0;
  const evidenceCoverage=weight ? evidenceWeighted/weight : 0;
  const complianceCoverage=weight ? complianceWeighted/weight : 0;
  const evaluatedPct=applicable ? evaluated/applicable*100 : 0;
  const thresholds=state.config.thresholds;
  let classification='PREPARACIÓN CRÍTICA';
  if(!r086Validated()) classification='ALERTA NORMATIVA / R086';
  else if(iper>=thresholds.high) classification='PREPARACIÓN ALTA';
  else if(iper>=thresholds.controlled) classification='PREPARACIÓN CONTROLADA';
  else if(iper>=thresholds.vulnerable) classification='PREPARACIÓN VULNERABLE';
  const moduleRows=Object.values(byModule).map(m=>({
    ...m,
    iper:m.weight?m.weighted/m.weight:0,
    evidence:m.weight?m.evidenceWeighted/m.weight:0,
    compliance:m.weight?m.complianceWeighted/m.weight:0,
  })).sort((a,b)=>a.iper-b.iper);
  alerts.sort((a,b)=>b.level-a.level);
  return {weight,iper,evidenceCoverage,complianceCoverage,evaluatedPct,applicable,evaluated,conforme,subsanable,critical,nonSub,noApply,closed,moduleRows,alerts};
}
