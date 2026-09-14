'use strict';

// P5 integrity hardening increment for dev/v0.1.4.
// P5-0310: any material change after an OIC decision invalidates that decision.
const P5_DEV6_VERSION = '0.1.4-dev.6';
const P5_DEV6_RESETTABLE_OIC = new Set(['Validado','Rechazado','No aplica']);
const P5_DEV6_MATERIAL_FIELDS = [
  ['status','estatus diagnóstico'],
  ['evidenceStatus','estatus evidencia'],
  ['scenario','escenario'],
  ['route','ruta'],
  ['responsible','responsable'],
  ['dueDate','fecha compromiso'],
  ['progress','avance'],
  ['residualRisk','riesgo residual'],
  ['evidenceLink','enlace de evidencia'],
  ['notes','observaciones']
];

function p5Dev6Stamp(){
  if(!state) return;
  state.version = P5_DEV6_VERSION;
  state.workspace ||= {};
  state.workspace.runtimeVersion = P5_DEV6_VERSION;
  state.workspace.storageNamespace = 'p5-preview::';
  state.workspace.releaseTrack = 'P5';
  state.workspace.consistencyModel = 'diagnostic+evidence+inline-validation+action-plan+oic-invalidation';
}

function p5Dev6Norm(key,value){
  if(key === 'progress' || key === 'residualRisk') return Number(value ?? 0);
  return String(value ?? '').trim();
}

function p5Dev6MaterialChanges(before,candidate){
  if(!before || !candidate) return [];
  return P5_DEV6_MATERIAL_FIELDS
    .filter(([key])=>p5Dev6Norm(key,before[key]) !== p5Dev6Norm(key,candidate[key]))
    .map(([,label])=>label);
}

function p5Dev6ResetOicDecision(id,before,reason,changedFields=[]){
  const current = assessmentFor(id);
  const previousValidation = before?.oicValidation || current.oicValidation || 'Pendiente';
  if(!P5_DEV6_RESETTABLE_OIC.has(previousValidation)) return null;

  state.assessments[id] = {
    ...current,
    oicValidation:'Pendiente',
    closedAt:'',
    oicInvalidatedAt:nowIso(),
    oicInvalidatedBy:currentUser()?.name || 'Sistema',
    oicInvalidationReason:reason,
    updatedAt:current.updatedAt || ''
  };

  return {
    previousValidation,
    changedFields:[...changedFields]
  };
}

const p5Dev6BaseSaveActiveControl = saveActiveControl;
saveActiveControl = async function(){
  const id = activeControlId;
  let invalidation = null;

  if(canEditGeneral() && id){
    const before = assessmentFor(id);
    const candidate = p5ReadCandidateFromDialog(id);

    // Do not alter the persisted OIC decision when the candidate itself is invalid.
    // Let dev.5 render the blocking validation inside the modal.
    const check = p5Dev5ValidateCandidate(candidate);
    if(!check.ok) return p5Dev6BaseSaveActiveControl();

    const changedFields = p5Dev6MaterialChanges(before,candidate);
    if(changedFields.length && P5_DEV6_RESETTABLE_OIC.has(before.oicValidation)){
      invalidation = p5Dev6ResetOicDecision(
        id,
        before,
        `Modificación material posterior a decisión OIC: ${changedFields.join(', ')}`,
        changedFields
      );
    }
  }

  const result = await p5Dev6BaseSaveActiveControl();

  if(invalidation){
    await saveState({
      action:'invalidate-oic-validation',
      controlId:id,
      summary:`${invalidation.previousValidation} → Pendiente por cambio material: ${invalidation.changedFields.join(', ')}`
    });
    toast(`${id}: Validación OIC reiniciada a Pendiente`);
    render();
  }

  return result;
};

// Adding evidence changes the evidentiary record reviewed by OIC. If a prior OIC
// decision exists, invalidate it only after confirming that the evidence save succeeded.
const p5Dev6BaseSaveEvidence = saveEvidence;
saveEvidence = async function(){
  const controlId = document.getElementById('evControlId')?.value || '';
  const before = controlId ? assessmentFor(controlId) : null;
  const beforeCount = controlId ? state.evidence.filter(e=>e.controlId===controlId).length : 0;

  const result = await p5Dev6BaseSaveEvidence();

  if(controlId && before && P5_DEV6_RESETTABLE_OIC.has(before.oicValidation)){
    const afterCount = state.evidence.filter(e=>e.controlId===controlId).length;
    if(afterCount > beforeCount){
      const invalidation = p5Dev6ResetOicDecision(
        controlId,
        before,
        'Alta de evidencia posterior a decisión OIC',
        ['evidencia asociada']
      );
      if(invalidation){
        await saveState({
          action:'invalidate-oic-validation',
          controlId,
          summary:`${invalidation.previousValidation} → Pendiente por alta de evidencia`
        });
        toast(`${controlId}: evidencia agregada; Validación OIC reiniciada`);
        render();
      }
    }
  }

  return result;
};

const p5Dev6BaseLoadData = loadData;
loadData = async function(){
  await p5Dev6BaseLoadData();
  p5Dev6Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev6BaseSaveState = saveState;
saveState = async function(logEntry){
  await p5Dev6BaseSaveState(logEntry);
  p5Dev6Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev6BaseRenderMore = renderMore;
renderMore = function(){
  p5Dev6BaseRenderMore();

  const badge = document.getElementById('p4VersionBadge');
  if(badge) badge.textContent = P5_DEV6_VERSION;

  const continuity = document.getElementById('p4ContinuityPanel');
  if(continuity){
    continuity.innerHTML = '<strong>Hardening P5 · invalidación automática de decisión OIC</strong><p style="margin:6px 0">Versión 0.1.4-dev.6. Toda modificación material posterior a Validado, Rechazado o No aplica reinicia la Validación OIC a Pendiente, elimina el cierre operativo del control y registra el evento en la bitácora. La adición de nueva evidencia aplica la misma regla.</p>';
  }
};
