'use strict';

// P5-0208-H1 — RBAC hardening for Consultor CATU.
// The consultant remains a read/analysis role with auditable follow-up notes and
// evidence contribution, but cannot alter substantive diagnostic or operational
// decision fields. OIC validation remains exclusive to Revisor/OIC.
const P5_DEV10_VERSION = '0.1.4-dev.10';

function p5Dev10Stamp(){
  if(!state) return;
  state.version = P5_DEV10_VERSION;
  state.workspace ||= {};
  state.workspace.runtimeVersion = P5_DEV10_VERSION;
  state.workspace.storageNamespace = 'p5-preview::';
  state.workspace.releaseTrack = 'P5';
  state.workspace.consistencyModel = 'diagnostic+evidence+inline-validation+action-plan+materiality+oic-invalidation+granular-json-merge+rbac-hardening';
}

function p5Dev10Role(){ return currentUser()?.role || ''; }
function p5Dev10CanAddFollowUp(){ return ['admin','coordinator','area','catu'].includes(p5Dev10Role()); }
function p5Dev10CanAddEvidence(){ return ['admin','coordinator','area','catu'].includes(p5Dev10Role()); }

// Harden inherited broad permissions.
canEditGeneral = function(){ return ['admin','coordinator','area'].includes(p5Dev10Role()); };
canEditWorkspace = function(){ return ['admin','coordinator'].includes(p5Dev10Role()); };
canReset = function(){ return p5Dev10Role() === 'admin'; };

const p5Dev10BaseOpenControl = openControl;
openControl = function(id){
  p5Dev10BaseOpenControl(id);

  const role = p5Dev10Role();
  const followUp = document.getElementById('dlgFollowUpNote');
  const addEvidence = document.getElementById('addEvidenceFromControl');
  const saveBtn = document.getElementById('saveControlBtn');

  if(followUp) followUp.disabled = !p5Dev10CanAddFollowUp();
  if(addEvidence) addEvidence.disabled = !p5Dev10CanAddEvidence();

  if(role === 'catu'){
    // A consultant may save only a follow-up note; all substantive inputs were
    // already disabled by canEditGeneral() before this wrapper runs.
    if(saveBtn) saveBtn.disabled = false;

    const body = document.getElementById('dialogBody');
    if(body && !document.getElementById('p5Dev10CatuBanner')){
      const banner = document.createElement('div');
      banner.id = 'p5Dev10CatuBanner';
      banner.className = 'disclaimer';
      banner.style.marginBottom = '10px';
      banner.innerHTML = '<strong>Consultor CATU · modo no decisorio.</strong> Puede consultar el control, registrar nota de seguimiento y aportar evidencia. No puede modificar diagnóstico, evidencia evaluada, escenario, ruta, responsable, fecha compromiso, avance, riesgo residual, observaciones sustantivas ni Validación OIC.';
      body.prepend(banner);
    }
  }
};

const p5Dev10BaseSaveActiveControl = saveActiveControl;
saveActiveControl = async function(){
  const role = p5Dev10Role();
  const id = activeControlId;

  if(role !== 'catu') return p5Dev10BaseSaveActiveControl();
  if(!id) return;

  const note = document.getElementById('dlgFollowUpNote')?.value?.trim() || '';
  if(!note){
    toast(`${id}: Consultor CATU sin cambios permitidos para guardar`);
    return;
  }

  const entry = p5Dev7AppendFollowUp(id,note);
  p5Dev8EnrichRecord?.(entry,'at');
  await saveState({
    action:'consultant-followup-note',
    controlId:id,
    summary:`Consultor CATU · nota no decisoria: ${entry.text.slice(0,120)}`,
    role:'catu'
  });

  document.getElementById('controlDialog')?.close();
  toast(`${id}: nota del Consultor CATU registrada`);
  render();
};

// Defensive guard: evidence may be contributed by consultant, but blocked for any
// role outside the operational/evidence set even if UI state is manipulated.
const p5Dev10BaseSaveEvidence = saveEvidence;
saveEvidence = async function(){
  if(!p5Dev10CanAddEvidence()){
    toast('El perfil activo no tiene permiso para registrar evidencia');
    return;
  }
  return p5Dev10BaseSaveEvidence();
};

const p5Dev10BaseLoadData = loadData;
loadData = async function(){
  await p5Dev10BaseLoadData();
  p5Dev10Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev10BaseSaveState = saveState;
saveState = async function(logEntry){
  await p5Dev10BaseSaveState(logEntry);
  p5Dev10Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev10BaseRenderMore = renderMore;
renderMore = function(){
  p5Dev10BaseRenderMore();
  const badge=document.getElementById('p4VersionBadge');
  if(badge) badge.textContent=P5_DEV10_VERSION;
  const continuity=document.getElementById('p4ContinuityPanel');
  if(continuity){
    continuity.innerHTML='<strong>P5-0208-H1 · hardening RBAC Consultor CATU</strong><p style="margin:6px 0">Versión 0.1.4-dev.10. El Consultor CATU queda en modo no decisorio: consulta, nota de seguimiento y aporte de evidencia. Se bloquean cambios sustantivos del diagnóstico, plan de acción, riesgo, observaciones y espacio de trabajo; Validación OIC continúa exclusiva del Revisor/OIC.</p>';
  }
};
