'use strict';

// P5-XD-008 — governed conflict resolution for granular JSON merge.
// Adds explicit, auditable resolution while preserving both original values.
const P5_DEV12_VERSION = '0.1.4-dev.12';
const P5_DEV12_PENDING = new Set(['local-preserved','pending','']);
const P5_DEV12_DERIVED_FIELDS = new Set(['closedAt']);
const P5_DEV12_FIELD_LABELS = {
  status:'Estatus diagnóstico', evidenceStatus:'Estatus evidencia', scenario:'Escenario', route:'Ruta de tratamiento',
  responsible:'Responsable', dueDate:'Fecha compromiso', progress:'Avance de acción', residualRisk:'Riesgo residual',
  evidenceLink:'Enlace principal al expediente', notes:'Observaciones sustantivas', oicValidation:'Validación OIC',
  evaluator:'Evaluador', closedAt:'Cierre operativo'
};

function p5Dev12Stamp(){
  if(!state) return;
  state.version = P5_DEV12_VERSION;
  state.workspace ||= {};
  state.workspace.runtimeVersion = P5_DEV12_VERSION;
  state.workspace.storageNamespace = 'p5-preview::';
  state.workspace.releaseTrack = 'P5';
  state.workspace.authorizationModel = 'role+macroModule+protected-profile-management+governed-conflict-resolution';
  state.workspace.consistencyModel = 'diagnostic+evidence+inline-validation+action-plan+materiality+oic-invalidation+granular-json-merge+rbac-hardening+profile-lifecycle+governed-conflict-resolution';
  state.importConflicts ||= [];
  state.importConflicts.forEach(c=>{
    if(!c.status) c.status = p5Dev12IsResolved(c) ? 'resolved' : 'pending';
  });
}

function p5Dev12IsResolved(c){
  return Boolean(c && (c.status === 'resolved' || (c.resolution && !P5_DEV12_PENDING.has(c.resolution))));
}

function p5Dev12ConflictFingerprint(c){
  return [c?.controlId||'',c?.field||'',JSON.stringify(c?.localValue??null),JSON.stringify(c?.incomingValue??null),c?.source||''].join('|');
}

function p5Dev12ConflictKey(c){ return String(c?.id || p5Dev12ConflictFingerprint(c)); }

function p5Dev12PreferConflict(a,b){
  if(!a) return structuredClone(b);
  if(!b) return structuredClone(a);
  const ar=p5Dev12IsResolved(a), br=p5Dev12IsResolved(b);
  if(ar !== br) return structuredClone(br ? b : a);
  if(ar && br){
    const at=String(a.resolvedAt||''), bt=String(b.resolvedAt||'');
    return structuredClone(bt > at ? b : a);
  }
  const ad=String(a.detectedAt||''), bd=String(b.detectedAt||'');
  return structuredClone(bd > ad ? b : a);
}

function p5Dev12MergeConflictRecords(localRows,incomingRows){
  const map=new Map();
  for(const row of [...(Array.isArray(localRows)?localRows:[]),...(Array.isArray(incomingRows)?incomingRows:[])]){
    const key=p5Dev12ConflictKey(row);
    map.set(key,p5Dev12PreferConflict(map.get(key),row));
  }
  return [...map.values()].sort((a,b)=>String(a.detectedAt||'').localeCompare(String(b.detectedAt||''))).slice(-300);
}

// Upgrade dev.9 merge so a resolved conflict can travel to another device without
// being downgraded by an older pending copy with the same conflict id.
const p5Dev12BaseMergeState = p5Dev9MergeState;
p5Dev9MergeState = function(localState,incoming,source){
  const priorResolved = new Map(
    [...(Array.isArray(localState?.importConflicts)?localState.importConflicts:[]),...(Array.isArray(incoming?.importConflicts)?incoming.importConflicts:[])]
      .filter(p5Dev12IsResolved)
      .map(c=>[p5Dev12ConflictFingerprint(c),c])
  );

  const result = p5Dev12BaseMergeState(localState,incoming,source);
  const inherited = p5Dev12MergeConflictRecords(localState?.importConflicts,incoming?.importConflicts);
  const filteredNew = (result.conflicts||[]).filter(c=>!priorResolved.has(p5Dev12ConflictFingerprint(c)));
  state.importConflicts = p5Dev12MergeConflictRecords(inherited,filteredNew);
  result.state.importConflicts = state.importConflicts;
  result.conflicts = filteredNew;
  p5Dev12Stamp();
  return result;
};

function p5Dev12FieldLabel(field){ return P5_DEV12_FIELD_LABELS[field] || field || 'Campo'; }
function p5Dev12CanResolve(c){
  const role = currentUser()?.role || '';
  if(c?.field === 'oicValidation') return role === 'oic';
  return ['admin','coordinator'].includes(role);
}

function p5Dev12ValueText(v){
  if(v === '' || v == null) return '∅ (vacío)';
  if(typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function p5Dev12ValidateIncoming(c){
  if(!c?.controlId || !c?.field) return {ok:false,message:'Conflicto incompleto.'};
  if(P5_DEV12_DERIVED_FIELDS.has(c.field)) return {ok:false,message:'El cierre operativo es un campo derivado y no puede imponerse desde un respaldo.'};
  if(c.field === 'oicValidation'){
    if(!OIC_OPTIONS.includes(String(c.incomingValue))) return {ok:false,message:'Valor OIC importado no reconocido.'};
    return {ok:true};
  }
  if(!P5_DEV9_SCALAR_FIELDS.includes(c.field)) return {ok:false,message:'Campo no habilitado para resolución automática.'};

  const candidate={...assessmentFor(c.controlId),[c.field]:structuredClone(c.incomingValue)};
  if(typeof p5Dev5ValidateCandidate === 'function'){
    const check=p5Dev5ValidateCandidate(candidate);
    if(!check.ok) return {ok:false,message:`El valor importado produciría un estado inconsistente: ${check.message || 'corrija primero los campos relacionados.'}`};
  }
  return {ok:true};
}

function p5Dev12EnsureDialog(){
  let dlg=document.getElementById('p5Dev12ConflictDialog');
  if(dlg) return dlg;
  dlg=document.createElement('dialog');
  dlg.id='p5Dev12ConflictDialog';
  dlg.className='control-dialog';
  dlg.innerHTML=`<form method="dialog" class="dialog-shell">
    <div class="dialog-head"><div><span class="eyebrow">P5-XD-008</span><h2>Resolver conflicto de importación</h2></div><button class="icon-btn" value="cancel" aria-label="Cerrar">×</button></div>
    <div id="p5Dev12ConflictBody" class="dialog-body"></div>
    <div class="dialog-actions"><button type="button" id="p5Dev12ResolveBtn" class="primary-btn">Registrar resolución</button><button value="cancel" class="secondary-btn">Cerrar</button></div>
  </form>`;
  document.body.appendChild(dlg);
  return dlg;
}

function p5Dev12OpenConflict(conflictId){
  const c=(state.importConflicts||[]).find(x=>x.id===conflictId);
  if(!c) return;
  const dlg=p5Dev12EnsureDialog();
  const canResolve=p5Dev12CanResolve(c);
  const incomingCheck=p5Dev12ValidateIncoming(c);
  const resolved=p5Dev12IsResolved(c);
  const body=document.getElementById('p5Dev12ConflictBody');
  body.innerHTML=`
    <div class="detail-block"><strong>Control / campo</strong><p>${esc(c.controlId||'—')} · ${esc(p5Dev12FieldLabel(c.field))}</p></div>
    <div class="field-grid">
      <div class="detail-block"><strong>Valor local preservado</strong><p style="white-space:pre-wrap">${esc(p5Dev12ValueText(c.localValue))}</p></div>
      <div class="detail-block"><strong>Valor importado</strong><p style="white-space:pre-wrap">${esc(p5Dev12ValueText(c.incomingValue))}</p></div>
    </div>
    <div class="detail-block"><strong>Origen</strong><p>${esc(c.source||'JSON import')} · detectado ${esc(c.detectedAt||'—')}</p></div>
    ${resolved?`<div class="disclaimer"><strong>Conflicto resuelto.</strong><p style="margin:6px 0">Decisión: ${esc(c.resolution)} · ${esc(c.resolvedBy||'Sistema')} · ${esc(c.resolvedAt||'—')}</p><p style="margin:6px 0">Justificación: ${esc(c.resolutionReason||'—')}</p></div>`:''}
    ${!resolved && !canResolve?`<div class="disclaimer"><strong>Modo consulta.</strong><p style="margin:6px 0">${c.field==='oicValidation'?'Sólo Revisor/OIC puede resolver una divergencia de Validación OIC.':'Sólo Administrador municipal o Coordinador E-R puede resolver esta divergencia.'}</p></div>`:''}
    ${!resolved && canResolve?`<label class="field">Decisión<select id="p5Dev12Decision"><option value="keep-local">Conservar valor local</option><option value="accept-incoming" ${incomingCheck.ok?'':'disabled'}>Aceptar valor importado</option></select>${incomingCheck.ok?'':`<span class="hint">${esc(incomingCheck.message)}</span>`}</label>
    <label class="field">Justificación de la resolución<textarea id="p5Dev12Reason" placeholder="Motivo verificable de la decisión; obligatorio"></textarea></label>
    <div class="disclaimer">La resolución no elimina el conflicto ni sus valores originales. Se conserva la trazabilidad completa en el respaldo JSON y en la bitácora.</div>`:''}`;

  const btn=document.getElementById('p5Dev12ResolveBtn');
  btn.disabled=resolved || !canResolve;
  btn.onclick=()=>p5Dev12ResolveConflict(conflictId);
  dlg.showModal();
}

async function p5Dev12ResolveConflict(conflictId){
  const c=(state.importConflicts||[]).find(x=>x.id===conflictId);
  if(!c || p5Dev12IsResolved(c)) return;
  if(!p5Dev12CanResolve(c)){ toast('El perfil activo no tiene facultad para resolver este conflicto.'); return; }

  const decision=document.getElementById('p5Dev12Decision')?.value || 'keep-local';
  const reason=document.getElementById('p5Dev12Reason')?.value?.trim() || '';
  if(reason.length < 8){ toast('Registra una justificación verificable de al menos 8 caracteres.'); return; }

  const assessment=assessmentFor(c.controlId);
  const before=structuredClone(assessment);
  let resolvedValue=structuredClone(c.localValue);
  let invalidation=null;

  if(decision==='accept-incoming'){
    const check=p5Dev12ValidateIncoming(c);
    if(!check.ok){ toast(check.message); return; }
    assessment[c.field]=structuredClone(c.incomingValue);
    resolvedValue=structuredClone(c.incomingValue);
    assessment.updatedAt=nowIso();
    state.assessments[c.controlId]=assessment;

    const materialKeys=new Set((typeof P5_DEV7_MATERIAL_FIELDS!=='undefined'?P5_DEV7_MATERIAL_FIELDS:[]).map(([key])=>key));
    if(c.field!=='oicValidation' && materialKeys.has(c.field) && P5_DEV7_RESETTABLE_OIC?.has(before.oicValidation)){
      invalidation=p5Dev6ResetOicDecision(
        c.controlId,
        before,
        `Resolución de conflicto de importación modificó ${p5Dev12FieldLabel(c.field)}`,
        [p5Dev12FieldLabel(c.field)]
      );
    }
  }

  c.status='resolved';
  c.resolution=decision==='accept-incoming'?'incoming-accepted':'local-confirmed';
  c.resolutionReason=reason;
  c.resolvedAt=nowIso();
  c.resolvedBy=currentUser()?.name || 'Sistema';
  c.resolvedByRole=currentUser()?.role || '';
  c.resolvedValue=structuredClone(resolvedValue);
  c.resolutionId=uid('resolution');

  await saveState({
    action:'resolve-import-conflict',
    controlId:c.controlId,
    conflictId:c.id,
    field:c.field,
    decision:c.resolution,
    summary:`${c.controlId} · ${p5Dev12FieldLabel(c.field)} · ${c.resolution}`,
    reason,
    originalLocalValue:structuredClone(c.localValue),
    originalIncomingValue:structuredClone(c.incomingValue),
    resolvedValue:structuredClone(resolvedValue)
  });

  if(invalidation){
    await saveState({
      action:'invalidate-oic-validation',
      controlId:c.controlId,
      summary:`${invalidation.previousValidation} → Pendiente por resolución material de conflicto (${p5Dev12FieldLabel(c.field)})`
    });
  }

  document.getElementById('p5Dev12ConflictDialog')?.close();
  toast(`${c.controlId}: conflicto resuelto y trazabilidad preservada`);
  render();
}

function p5Dev12ConflictPanel(){
  const all=[...(state.importConflicts||[])].sort((a,b)=>String(b.detectedAt||'').localeCompare(String(a.detectedAt||'')));
  const pending=all.filter(c=>!p5Dev12IsResolved(c));
  const resolved=all.filter(p5Dev12IsResolved);
  const visible=[...pending,...resolved.slice(0,5)];
  const rows=visible.length?visible.map(c=>{
    const resolvedFlag=p5Dev12IsResolved(c);
    const auth=p5Dev12CanResolve(c);
    return `<div class="user-row" style="align-items:flex-start;gap:10px"><div style="min-width:0;flex:1"><strong>${esc(c.controlId||'—')} · ${esc(p5Dev12FieldLabel(c.field))}</strong><small>${resolvedFlag?'Resuelto':'Pendiente'} · ${esc(c.source||'JSON import')}</small><small>Local: ${esc(p5Dev12ValueText(c.localValue))} · Importado: ${esc(p5Dev12ValueText(c.incomingValue))}</small></div><button type="button" class="secondary-btn" data-p5-conflict="${esc(c.id)}">${resolvedFlag?'Ver':'Revisar'}</button>${!resolvedFlag&&!auth?'<span class="status-pill">Sólo lectura</span>':''}</div>`;
  }).join(''):'<p class="hint">No hay conflictos de importación registrados.</p>';
  return `<section class="card" id="p5Dev12ConflictPanel"><h2>Conflictos de importación <span class="status-pill ${pending.length?'warning':'ok'}">${pending.length} pendiente(s)</span></h2><p class="hint">P5-XD-008 · resolución explícita, justificada y auditable. Los valores originales nunca se eliminan.</p>${rows}${resolved.length>5?`<p class="hint">Además, ${resolved.length-5} conflicto(s) resuelto(s) permanecen en el respaldo JSON y bitácora.</p>`:''}</section>`;
}

const p5Dev12BaseLoadData=loadData;
loadData=async function(){
  await p5Dev12BaseLoadData();
  p5Dev12Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev12BaseSaveState=saveState;
saveState=async function(logEntry){
  await p5Dev12BaseSaveState(logEntry);
  p5Dev12Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev12BaseRenderMore=renderMore;
renderMore=function(){
  p5Dev12BaseRenderMore();
  const grid=document.querySelector('.settings-grid');
  if(grid && !document.getElementById('p5Dev12ConflictPanel')) grid.insertAdjacentHTML('beforeend',p5Dev12ConflictPanel());
  document.querySelectorAll('[data-p5-conflict]').forEach(btn=>btn.addEventListener('click',()=>p5Dev12OpenConflict(btn.dataset.p5Conflict)));

  const badge=document.getElementById('p4VersionBadge');
  if(badge) badge.textContent=P5_DEV12_VERSION;
  const continuity=document.getElementById('p4ContinuityPanel');
  if(continuity){
    const pending=(state.importConflicts||[]).filter(c=>!p5Dev12IsResolved(c)).length;
    const resolved=(state.importConflicts||[]).filter(p5Dev12IsResolved).length;
    continuity.innerHTML=`<strong>P5-XD-008 · resolución gobernada de conflictos</strong><p style="margin:6px 0">Versión ${P5_DEV12_VERSION}. Los conflictos detectados por el merge granular pueden revisarse y resolverse mediante decisión explícita, justificación obligatoria, identidad/rol, fecha-hora y conservación de ambos valores originales. Pendientes: <strong>${pending}</strong> · resueltos: <strong>${resolved}</strong>.</p>`;
  }
};
