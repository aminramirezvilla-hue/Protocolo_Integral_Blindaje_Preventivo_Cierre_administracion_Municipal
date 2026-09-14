'use strict';

// P5.2 materiality model for dev/v0.1.4.
// Refines dev.6 so only substantive changes invalidate a prior OIC decision.
// Operational follow-up notes, due-date changes and progress updates remain auditable
// but do not reset OIC validation by themselves.
const P5_DEV7_VERSION = '0.1.4-dev.7';
const P5_DEV7_RESETTABLE_OIC = new Set(['Validado','Rechazado','No aplica']);

const P5_DEV7_MATERIAL_FIELDS = [
  ['status','estatus diagnóstico'],
  ['evidenceStatus','estatus evidencia'],
  ['scenario','escenario'],
  ['route','ruta'],
  ['responsible','responsable'],
  ['residualRisk','riesgo residual'],
  ['evidenceLink','enlace de evidencia'],
  ['notes','observaciones sustantivas']
];

const P5_DEV7_NON_MATERIAL_FIELDS = [
  ['dueDate','fecha compromiso'],
  ['progress','avance de acción']
];

function p5Dev7Stamp(){
  if(!state) return;
  state.version = P5_DEV7_VERSION;
  state.workspace ||= {};
  state.workspace.runtimeVersion = P5_DEV7_VERSION;
  state.workspace.storageNamespace = 'p5-preview::';
  state.workspace.releaseTrack = 'P5';
  state.workspace.consistencyModel = 'diagnostic+evidence+inline-validation+action-plan+materiality+oic-invalidation';
}

function p5Dev7Norm(key,value){
  if(key === 'progress' || key === 'residualRisk') return Number(value ?? 0);
  return String(value ?? '').trim();
}

function p5Dev7Changes(before,candidate,definition){
  if(!before || !candidate) return [];
  return definition
    .filter(([key])=>p5Dev7Norm(key,before[key]) !== p5Dev7Norm(key,candidate[key]))
    .map(([key,label])=>({key,label,before:before[key],after:candidate[key]}));
}

function p5Dev7FollowUpHistory(a){
  const rows = Array.isArray(a?.followUpLog) ? a.followUpLog.slice(-5).reverse() : [];
  if(!rows.length) return '<p class="hint" style="margin:6px 0 0">Sin notas de seguimiento registradas.</p>';
  return `<div class="detail-block" style="margin-top:8px"><strong>Últimas notas de seguimiento</strong>${rows.map(x=>`<p style="margin:6px 0"><span class="hint">${esc(fmtDate(String(x.at||'').slice(0,10)))} · ${esc(x.user||'Sistema')}</span><br>${esc(x.text||'')}</p>`).join('')}</div>`;
}

const p5Dev7BaseOpenControl = openControl;
openControl = function(id){
  p5Dev7BaseOpenControl(id);
  const notes = document.getElementById('dlgNotes');
  if(!notes || document.getElementById('dlgFollowUpNote')) return;

  const a = assessmentFor(id);
  const label = notes.closest('label');
  if(!label) return;

  const block = document.createElement('div');
  block.id = 'p5Dev7FollowUpBlock';
  block.innerHTML = `
    <label class="field">Nueva nota de seguimiento / bitácora
      <textarea id="dlgFollowUpNote" ${canEditGeneral()?'':'disabled'} placeholder="Comentario operativo o cronológico que no modifica por sí mismo la decisión OIC"></textarea>
      <span class="hint">No invalida por sí sola la Validación OIC. Para hechos, discrepancias o justificaciones que afecten el diagnóstico use “Observaciones”.</span>
    </label>
    ${p5Dev7FollowUpHistory(a)}`;
  label.insertAdjacentElement('afterend',block);
};

function p5Dev7AppendFollowUp(id,text){
  const a = assessmentFor(id);
  const entry = {
    id:uid('fu'),
    at:nowIso(),
    user:currentUser()?.name || 'Sistema',
    text:String(text||'').trim()
  };
  a.followUpLog = Array.isArray(a.followUpLog) ? [...a.followUpLog,entry] : [entry];
  a.updatedAt = nowIso();
  state.assessments[id] = a;
  return entry;
}

// IMPORTANT: dev.6 wrapped saveActiveControl with a broader definition of materiality.
// Calling p5Dev6BaseSaveActiveControl bypasses only that dev.6 invalidation wrapper while
// retaining all validation and persistence hardening inherited through dev.5 and earlier.
const p5Dev7BaseSaveActiveControl = p5Dev6BaseSaveActiveControl;
saveActiveControl = async function(){
  const id = activeControlId;
  let before = null;
  let candidate = null;
  let material = [];
  let nonMaterial = [];
  let invalidation = null;
  let followUpNote = '';

  if(canEditGeneral() && id){
    before = assessmentFor(id);
    candidate = p5ReadCandidateFromDialog(id);
    followUpNote = document.getElementById('dlgFollowUpNote')?.value?.trim() || '';

    // Preserve dev.5 blocking validation behaviour inside the modal.
    const check = p5Dev5ValidateCandidate(candidate);
    if(!check.ok) return p5Dev7BaseSaveActiveControl();

    material = p5Dev7Changes(before,candidate,P5_DEV7_MATERIAL_FIELDS);
    nonMaterial = p5Dev7Changes(before,candidate,P5_DEV7_NON_MATERIAL_FIELDS);

    // Note-only update: do not touch evaluatedAt/evaluator or the OIC decision.
    if(!material.length && !nonMaterial.length && followUpNote){
      const entry = p5Dev7AppendFollowUp(id,followUpNote);
      await saveState({
        action:'add-followup-note',
        controlId:id,
        summary:`Nota de seguimiento no material: ${entry.text.slice(0,120)}`
      });
      document.getElementById('controlDialog')?.close();
      toast(`${id}: nota de seguimiento registrada`);
      render();
      return;
    }

    if(material.length && P5_DEV7_RESETTABLE_OIC.has(before.oicValidation)){
      invalidation = p5Dev6ResetOicDecision(
        id,
        before,
        `Modificación material posterior a decisión OIC: ${material.map(x=>x.label).join(', ')}`,
        material.map(x=>x.label)
      );
    }
  }

  const result = await p5Dev7BaseSaveActiveControl();

  if(id && followUpNote){
    const entry = p5Dev7AppendFollowUp(id,followUpNote);
    await saveState({
      action:'add-followup-note',
      controlId:id,
      summary:`Nota de seguimiento no material: ${entry.text.slice(0,120)}`
    });
  }

  if(id && invalidation){
    await saveState({
      action:'invalidate-oic-validation',
      controlId:id,
      summary:`${invalidation.previousValidation} → Pendiente por cambio material: ${material.map(x=>x.label).join(', ')}`,
      changes:material
    });
    toast(`${id}: cambio material; Validación OIC reiniciada a Pendiente`);
    render();
  } else if(id && nonMaterial.length && before && P5_DEV7_RESETTABLE_OIC.has(before.oicValidation)){
    await saveState({
      action:'nonmaterial-change-after-oic',
      controlId:id,
      summary:`Decisión OIC conservada; cambio no material: ${nonMaterial.map(x=>x.label).join(', ')}`,
      changes:nonMaterial,
      oicValidation:before.oicValidation
    });
    toast(`${id}: cambio no material; decisión OIC conservada`);
    render();
  }

  return result;
};

// Evidence additions remain material and continue using the dev.6 evidence invalidation rule.

const p5Dev7BaseLoadData = loadData;
loadData = async function(){
  await p5Dev7BaseLoadData();
  p5Dev7Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev7BaseSaveState = saveState;
saveState = async function(logEntry){
  await p5Dev7BaseSaveState(logEntry);
  p5Dev7Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev7BaseRenderMore = renderMore;
renderMore = function(){
  p5Dev7BaseRenderMore();

  const badge = document.getElementById('p4VersionBadge');
  if(badge) badge.textContent = P5_DEV7_VERSION;

  const continuity = document.getElementById('p4ContinuityPanel');
  if(continuity){
    continuity.innerHTML = '<strong>P5.2 · clasificación de materialidad</strong><p style="margin:6px 0">Versión 0.1.4-dev.7. Los cambios sustantivos de diagnóstico/evidencia invalidan la decisión OIC; fecha compromiso y avance quedan como cambios operativos auditables que no la reinician. Se incorpora “Nota de seguimiento / bitácora” separada de las observaciones sustantivas.</p>';
  }
};
