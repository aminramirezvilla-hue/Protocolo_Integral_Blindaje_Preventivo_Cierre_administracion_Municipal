'use strict';

// P5 hardening increment for dev/v0.1.4.
// Fixes P5-INC-002: inconsistent combinations between diagnostic status and evidence status.
const P5_DEV3_VERSION = '0.1.4-dev.3';
const P5_DEV3_INVALID_EVIDENCE_FOR_CONFORME = new Set([
  'No evaluada',
  'Sin evidencia',
  'Insuficiente',
  'Parcial',
]);

function p5Dev3Stamp(){
  if(!state) return;
  state.version = P5_DEV3_VERSION;
  state.workspace ||= {};
  state.workspace.runtimeVersion = P5_DEV3_VERSION;
  state.workspace.storageNamespace = 'p5-preview::';
  state.workspace.releaseTrack = 'P5';
  state.workspace.consistencyModel = 'diagnostic+evidence';
}

function p5ValidateAssessmentConsistency(a){
  if(!a) return {ok:true};

  if(a.status === 'Conforme' && P5_DEV3_INVALID_EVIDENCE_FOR_CONFORME.has(a.evidenceStatus)){
    return {
      ok:false,
      code:'P5-0301',
      message:'No se puede guardar: un control Conforme requiere evidencia completa. Complete/verifique la evidencia o cambie el estatus diagnóstico.'
    };
  }

  return {ok:true};
}

function p5ReadCandidateFromDialog(id){
  const c = controls.find(x=>x.id===id);
  if(!c) return null;

  const current = assessmentFor(id);
  const candidate = {...current};

  if(canEditGeneral()){
    candidate.status = $('#dlgStatus')?.value ?? candidate.status;
    candidate.evidenceStatus = $('#dlgEvidenceStatus')?.value ?? candidate.evidenceStatus;
    candidate.scenario = $('#dlgScenario')?.value ?? candidate.scenario;
    candidate.route = $('#dlgRoute')?.value ?? candidate.route;
    candidate.responsible = ($('#dlgResponsible')?.value || '').trim();
    candidate.dueDate = $('#dlgDue')?.value || '';
    candidate.progress = Math.max(0,Math.min(100,Number($('#dlgProgress')?.value)||0));
    candidate.residualRisk = Number($('#dlgResidualRisk')?.value)||c.baseRisk;
    candidate.evidenceLink = ($('#dlgEvidenceLink')?.value || '').trim();
    candidate.notes = ($('#dlgNotes')?.value || '').trim();
  }

  if(canEditOic()) candidate.oicValidation = $('#dlgOic')?.value ?? candidate.oicValidation;
  return candidate;
}

const p5Dev3BaseSaveActiveControl = saveActiveControl;
saveActiveControl = async function(){
  const id = activeControlId;

  // Only general editors can create the inconsistent diagnostic/evidence combination.
  // OIC must remain able to validate/reject legacy records without being blocked here.
  if(canEditGeneral()){
    const candidate = p5ReadCandidateFromDialog(id);
    const check = p5ValidateAssessmentConsistency(candidate);
    if(!check.ok){
      toast(check.message);
      return;
    }
  }

  return p5Dev3BaseSaveActiveControl();
};

// Apply dev.3 identity after inherited wrappers complete.
const p5Dev3BaseLoadData = loadData;
loadData = async function(){
  await p5Dev3BaseLoadData();
  p5Dev3Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev3BaseSaveState = saveState;
saveState = async function(logEntry){
  await p5Dev3BaseSaveState(logEntry);
  p5Dev3Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev3BaseRenderMore = renderMore;
renderMore = function(){
  p5Dev3BaseRenderMore();

  const badge = $('#p4VersionBadge');
  if(badge) badge.textContent = P5_DEV3_VERSION;

  const continuity = $('#p4ContinuityPanel');
  if(continuity){
    continuity.innerHTML = '<strong>Hardening P5 · coherencia de estados</strong><p style="margin:6px 0">Versión 0.1.4-dev.3. Un control no puede guardarse como Conforme con evidencia no evaluada, inexistente, insuficiente o parcial. La Validación OIC puede permanecer Pendiente; el cierre definitivo conserva la regla Conforme + Completa verificada + Validado.</p>';
  }
};
