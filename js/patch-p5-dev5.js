'use strict';

// P5 UX/business-rule hardening increment for dev/v0.1.4.
// Extends dev.4 so legacy P4 validations do not fall back to a toast hidden
// behind the native <dialog> top layer in Safari.
const P5_DEV5_VERSION = '0.1.4-dev.5';
const P5_DEV5_ACTIONABLE = new Set([
  'Subsanable',
  'Crítico',
  'No subsanable / posible responsabilidad'
]);

function p5Dev5Stamp(){
  if(!state) return;
  state.version = P5_DEV5_VERSION;
  state.workspace ||= {};
  state.workspace.runtimeVersion = P5_DEV5_VERSION;
  state.workspace.storageNamespace = 'p5-preview::';
  state.workspace.releaseTrack = 'P5';
  state.workspace.consistencyModel = 'diagnostic+evidence+inline-validation+action-plan';
}

function p5Dev5ValidateCandidate(a){
  if(!a) return {ok:true};

  // Keep the dev.3 diagnostic/evidence consistency rule centralized.
  const consistency = p5ValidateAssessmentConsistency(a);
  if(!consistency.ok) return consistency;

  if(P5_DEV5_ACTIONABLE.has(a.status) && a.route === 'No aplica'){
    return {
      ok:false,
      code:'P5-RUTA-01',
      message:'No se puede guardar: un control accionable requiere Ruta A, B o C.'
    };
  }

  if(P5_DEV5_ACTIONABLE.has(a.status) && !a.dueDate){
    return {
      ok:false,
      code:'P5-0304',
      message:'No se puede guardar: los controles accionables requieren una fecha compromiso para el plan de acción.'
    };
  }

  if(a.status === 'No subsanable / posible responsabilidad' && a.route !== 'C — No subsanable / canalización'){
    return {
      ok:false,
      code:'P5-0302/0303',
      message:'No se puede guardar: un control no subsanable debe preservar evidencia y canalizarse mediante Ruta C.'
    };
  }

  return {ok:true};
}

function p5Dev5FocusInvalid(check){
  let target = null;
  if(check?.code === 'P5-0304') target = document.getElementById('dlgDue');
  else if(check?.code === 'P5-RUTA-01' || check?.code === 'P5-0302/0303') target = document.getElementById('dlgRoute');
  else if(check?.code === 'P5-0301') target = document.getElementById('dlgEvidenceStatus');

  if(target){
    target.focus({preventScroll:true});
    target.scrollIntoView({block:'center',behavior:'smooth'});
  }
}

function p5Dev5RefreshValidation(){
  if(!canEditGeneral()){
    p5Dev4ClearValidation();
    return {ok:true};
  }
  const candidate = p5ReadCandidateFromDialog(activeControlId);
  const check = p5Dev5ValidateCandidate(candidate);
  if(!check.ok) p5Dev4ShowValidation(check);
  else p5Dev4ClearValidation();
  return check;
}

const p5Dev5BaseOpenControl = openControl;
openControl = function(id){
  p5Dev5BaseOpenControl(id);
  ['dlgStatus','dlgEvidenceStatus','dlgScenario','dlgRoute','dlgDue'].forEach(fid=>{
    document.getElementById(fid)?.addEventListener('change',p5Dev5RefreshValidation);
  });
  p5Dev5RefreshValidation();
};

const p5Dev5BaseSaveActiveControl = saveActiveControl;
saveActiveControl = async function(){
  if(canEditGeneral()){
    const candidate = p5ReadCandidateFromDialog(activeControlId);
    const check = p5Dev5ValidateCandidate(candidate);
    if(!check.ok){
      // Important: stop here so inherited P4 wrappers never emit a toast
      // behind the native dialog in Safari.
      p5Dev4ShowValidation(check);
      p5Dev5FocusInvalid(check);
      return;
    }
  }

  p5Dev4ClearValidation();
  return p5Dev5BaseSaveActiveControl();
};

const p5Dev5BaseLoadData = loadData;
loadData = async function(){
  await p5Dev5BaseLoadData();
  p5Dev5Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev5BaseSaveState = saveState;
saveState = async function(logEntry){
  await p5Dev5BaseSaveState(logEntry);
  p5Dev5Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev5BaseRenderMore = renderMore;
renderMore = function(){
  p5Dev5BaseRenderMore();

  const badge = document.getElementById('p4VersionBadge');
  if(badge) badge.textContent = P5_DEV5_VERSION;

  const continuity = document.getElementById('p4ContinuityPanel');
  if(continuity){
    continuity.innerHTML = '<strong>Hardening P5 · validación modal unificada</strong><p style="margin:6px 0">Versión 0.1.4-dev.5. Las reglas bloqueantes de coherencia, ruta y fecha compromiso se interceptan antes de los validadores heredados y se muestran dentro del modal; no deben quedar notificaciones ocultas detrás de &lt;dialog&gt; en Safari.</p>';
  }
};
