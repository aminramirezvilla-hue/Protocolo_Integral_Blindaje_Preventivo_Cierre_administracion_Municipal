// CATU E-R P5 dev.3 — coherencia de estados
// Bloquea combinaciones semánticamente incompatibles antes de persistir.
(function(){
  const INVALID_EVIDENCE_FOR_CONFORME = new Set(['Insuficiente','Parcial','No evaluada']);

  function validateAssessmentConsistency(a){
    if(!a) return {ok:true};
    if(a.status === 'Conforme' && INVALID_EVIDENCE_FOR_CONFORME.has(a.evidenceStatus)){
      return {
        ok:false,
        message:'Un control no puede declararse Conforme mientras la evidencia sea insuficiente, parcial o no evaluada. Complete/verifique la evidencia o cambie el estatus diagnóstico.'
      };
    }
    return {ok:true};
  }

  window.p5ValidateAssessmentConsistency = validateAssessmentConsistency;

  const originalSaveActiveControl = window.saveActiveControl;
  if(typeof originalSaveActiveControl !== 'function') return;

  window.saveActiveControl = async function(){
    const id = window.activeControlId || (typeof activeControlId !== 'undefined' ? activeControlId : null);
    const c = Array.isArray(window.controls) ? window.controls.find(x=>x.id===id) : (typeof controls !== 'undefined' ? controls.find(x=>x.id===id) : null);
    if(!id || !c) return originalSaveActiveControl.apply(this, arguments);

    const canGeneral = typeof window.canEditGeneral === 'function' ? window.canEditGeneral() : (typeof canEditGeneral === 'function' ? canEditGeneral() : false);
    const canOic = typeof window.canEditOic === 'function' ? window.canEditOic() : (typeof canEditOic === 'function' ? canEditOic() : false);

    const current = typeof window.assessmentFor === 'function' ? window.assessmentFor(id) : (typeof assessmentFor === 'function' ? assessmentFor(id) : {});
    const candidate = {...current};

    if(canGeneral){
      const $q = typeof window.$ === 'function' ? window.$ : (typeof $ === 'function' ? $ : s=>document.querySelector(s));
      candidate.status = $q('#dlgStatus')?.value ?? candidate.status;
      candidate.evidenceStatus = $q('#dlgEvidenceStatus')?.value ?? candidate.evidenceStatus;
      candidate.scenario = $q('#dlgScenario')?.value ?? candidate.scenario;
      candidate.route = $q('#dlgRoute')?.value ?? candidate.route;
      candidate.responsible = ($q('#dlgResponsible')?.value || '').trim();
      candidate.dueDate = $q('#dlgDue')?.value || '';
      candidate.progress = Math.max(0,Math.min(100,Number($q('#dlgProgress')?.value)||0));
      candidate.residualRisk = Number($q('#dlgResidualRisk')?.value)||c.baseRisk;
      candidate.evidenceLink = ($q('#dlgEvidenceLink')?.value || '').trim();
      candidate.notes = ($q('#dlgNotes')?.value || '').trim();
    }
    if(canOic){
      const el = document.querySelector('#dlgOic');
      if(el) candidate.oicValidation = el.value;
    }

    const check = validateAssessmentConsistency(candidate);
    if(!check.ok){
      if(typeof window.toast === 'function') window.toast(check.message);
      else if(typeof toast === 'function') toast(check.message);
      else alert(check.message);
      return;
    }

    return originalSaveActiveControl.apply(this, arguments);
  };
})();
