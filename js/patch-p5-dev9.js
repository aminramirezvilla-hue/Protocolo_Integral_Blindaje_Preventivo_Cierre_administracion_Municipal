'use strict';

// P5-XD-FIX-001 — non-destructive, granular and idempotent JSON import.
// Fixes P5-XD-004: concurrent changes inside the same control must not be silently
// overwritten when backups are exchanged between devices.
const P5_DEV9_VERSION = '0.1.4-dev.9';

function p5Dev9Stamp(){
  if(!state) return;
  state.version = P5_DEV9_VERSION;
  state.workspace ||= {};
  state.workspace.runtimeVersion = P5_DEV9_VERSION;
  state.workspace.storageNamespace = 'p5-preview::';
  state.workspace.releaseTrack = 'P5';
  state.workspace.consistencyModel = 'diagnostic+evidence+inline-validation+action-plan+materiality+oic-invalidation+granular-json-merge';
  state.importConflicts ||= [];
}

function p5Dev9RecordKey(x,prefix='row'){
  if(x?.id) return String(x.id);
  const stamp = x?.timestampUTC || x?.at || x?.createdAt || '';
  const control = x?.controlId || '';
  const user = x?.user || x?.userName || '';
  const text = x?.text || x?.description || x?.summary || '';
  return `${prefix}|${stamp}|${control}|${user}|${text}`;
}

function p5Dev9MergeAppendOnly(localRows,incomingRows,prefix){
  const out=[];
  const seen=new Set();
  for(const row of [...(Array.isArray(localRows)?localRows:[]),...(Array.isArray(incomingRows)?incomingRows:[])]){
    const key=p5Dev9RecordKey(row,prefix);
    if(seen.has(key)) continue;
    seen.add(key);
    out.push(structuredClone(row));
  }
  return out.sort((a,b)=>String(a.timestampUTC||a.at||a.createdAt||'').localeCompare(String(b.timestampUTC||b.at||b.createdAt||'')));
}

function p5Dev9Same(a,b){
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

function p5Dev9IsDefaultValue(key,value,controlId){
  const c=controls.find(x=>x.id===controlId);
  const d=c ? defaultAssessment(c) : {};
  if(key in d) return p5Dev9Same(value,d[key]);
  return value === '' || value == null;
}

const P5_DEV9_SCALAR_FIELDS = [
  'status','evidenceStatus','scenario','route','responsible','dueDate','progress','residualRisk',
  'evidenceLink','notes','oicValidation','evaluator','closedAt'
];

function p5Dev9Conflict(controlId,field,localValue,incomingValue,source){
  return {
    id:uid('conflict'),
    controlId,
    field,
    localValue:structuredClone(localValue),
    incomingValue:structuredClone(incomingValue),
    source:source || 'JSON import',
    detectedAt:nowIso(),
    resolution:'local-preserved'
  };
}

function p5Dev9MergeAssessment(controlId,localA,incomingA,source,conflicts){
  if(!localA) return structuredClone(incomingA);
  if(!incomingA) return structuredClone(localA);

  const out=structuredClone(localA);
  out.followUpLog=p5Dev9MergeAppendOnly(localA.followUpLog,incomingA.followUpLog,'followup');

  for(const field of P5_DEV9_SCALAR_FIELDS){
    const lv=localA[field];
    const iv=incomingA[field];
    if(p5Dev9Same(lv,iv)) continue;
    if(p5Dev9IsDefaultValue(field,lv,controlId) && !p5Dev9IsDefaultValue(field,iv,controlId)){
      out[field]=structuredClone(iv);
      continue;
    }
    if(p5Dev9IsDefaultValue(field,iv,controlId)) continue;
    conflicts.push(p5Dev9Conflict(controlId,field,lv,iv,source));
  }

  // Temporal metadata is safe to reconcile deterministically without changing the
  // substantive decision: retain the newest known machine timestamp.
  for(const field of ['evaluatedAt','updatedAt','oicInvalidatedAt']){
    const vals=[localA[field],incomingA[field]].filter(Boolean).sort();
    if(vals.length) out[field]=vals[vals.length-1];
  }

  // Preserve enriched temporal companions when available.
  for(const field of [
    'evaluatedTimeZone','evaluatedLocalDateTime','updatedTimeZone','updatedLocalDateTime',
    'oicInvalidatedTimeZone','oicInvalidatedLocalDateTime','oicInvalidationReason','oicPreviousValidation'
  ]){
    if(out[field] == null && incomingA[field] != null) out[field]=structuredClone(incomingA[field]);
  }
  return out;
}

function p5Dev9MergeUsers(localUsers,incomingUsers){
  const out=[]; const seen=new Set();
  for(const u of [...(Array.isArray(localUsers)?localUsers:[]),...(Array.isArray(incomingUsers)?incomingUsers:[])]){
    const key=String(u?.id || `${u?.name||''}|${u?.role||''}|${u?.area||''}`);
    if(seen.has(key)) continue;
    seen.add(key); out.push(structuredClone(u));
  }
  return out;
}

function p5Dev9MergeState(localState,incoming,source){
  const local=structuredClone(localState || {});
  const inc=structuredClone(incoming || {});
  const conflicts=[];
  const merged={...local};

  merged.workspace={...(inc.workspace||{}),...(local.workspace||{})};
  if(!local.workspace || local.workspace.municipality==='Municipio piloto') merged.workspace.municipality=inc.workspace?.municipality || local.workspace?.municipality || 'Municipio piloto';
  merged.users=p5Dev9MergeUsers(local.users,inc.users);
  merged.currentUserId=local.currentUserId || inc.currentUserId;
  merged.config={...(inc.config||{}),...(local.config||{})};
  merged.config.weights={...(inc.config?.weights||{}),...(local.config?.weights||{})};
  merged.config.riskWeights={...(inc.config?.riskWeights||{}),...(local.config?.riskWeights||{})};
  merged.config.thresholds={...(inc.config?.thresholds||{}),...(local.config?.thresholds||{})};

  merged.assessments={};
  const ids=new Set([...Object.keys(local.assessments||{}),...Object.keys(inc.assessments||{})]);
  for(const id of ids) merged.assessments[id]=p5Dev9MergeAssessment(id,local.assessments?.[id],inc.assessments?.[id],source,conflicts);

  merged.evidence=p5Dev9MergeAppendOnly(local.evidence,inc.evidence,'evidence');
  merged.auditLog=p5Dev9MergeAppendOnly(local.auditLog,inc.auditLog,'audit').slice(-500).reverse();

  const priorConflicts=p5Dev9MergeAppendOnly(local.importConflicts,inc.importConflicts,'conflict');
  merged.importConflicts=[...priorConflicts,...conflicts].slice(-300);
  merged.updatedAt=nowIso();
  state=merged;
  p5Dev9Stamp();
  p5Dev8MigrateState?.();
  return {state:merged,conflicts};
}

// Replace destructive import inherited from actions.js. Import is now a merge operation.
importJSON = async function(e){
  const file=e.target.files[0]; if(!file) return;
  try{
    const incoming=JSON.parse(await file.text());
    if(!incoming.workspace || !incoming.assessments) throw new Error('Formato no reconocido');
    if(!confirm('Se fusionará el respaldo con el estado local. Las notas, evidencias y bitácoras se conservarán de forma no destructiva. Los conflictos sustantivos no se sobrescribirán silenciosamente. ¿Continuar?')) return;

    const result=p5Dev9MergeState(state,incoming,file.name);
    await idbSet(STATE_KEY,state);
    await saveState({
      action:'import-backup-merged',
      summary:`${file.name}: merge no destructivo; ${result.conflicts.length} conflicto(s) sustantivo(s) detectado(s)`,
      conflictCount:result.conflicts.length
    });
    toast(result.conflicts.length ? `Respaldo fusionado; ${result.conflicts.length} conflicto(s) preservado(s)` : 'Respaldo fusionado sin pérdida de datos');
    render();
  }catch(err){
    console.error(err);
    toast(`Error al importar: ${err.message}`);
  }finally{
    e.target.value='';
  }
};

const p5Dev9BaseLoadData=loadData;
loadData=async function(){
  await p5Dev9BaseLoadData();
  p5Dev9Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev9BaseSaveState=saveState;
saveState=async function(logEntry){
  await p5Dev9BaseSaveState(logEntry);
  p5Dev9Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev9BaseRenderMore=renderMore;
renderMore=function(){
  p5Dev9BaseRenderMore();
  const badge=document.getElementById('p4VersionBadge');
  if(badge) badge.textContent=P5_DEV9_VERSION;
  const continuity=document.getElementById('p4ContinuityPanel');
  if(continuity){
    const pending=(state.importConflicts||[]).filter(x=>x.resolution==='local-preserved').length;
    continuity.innerHTML=`<strong>P5-XD-FIX-001 · merge granular JSON</strong><p style="margin:6px 0">Versión ${P5_DEV9_VERSION}. La importación JSON ya no sustituye el estado completo: fusiona bitácoras y evidencias por identificador, evita duplicados y conserva el valor local cuando detecta una divergencia sustantiva. Conflictos registrados: <strong>${pending}</strong>.</p>`;
  }
};
