'use strict';

// P5 UX hardening increment for dev/v0.1.4.
// Fixes P5-UI-0304: validation feedback hidden behind the native <dialog> top layer.
const P5_DEV4_VERSION = '0.1.4-dev.4';

function p5Dev4Stamp(){
  if(!state) return;
  state.version = P5_DEV4_VERSION;
  state.workspace ||= {};
  state.workspace.runtimeVersion = P5_DEV4_VERSION;
  state.workspace.storageNamespace = 'p5-preview::';
  state.workspace.releaseTrack = 'P5';
  state.workspace.consistencyModel = 'diagnostic+evidence+inline-validation';
}

function p5Dev4EnsureStyles(){
  if(document.getElementById('p5Dev4Styles')) return;
  const style = document.createElement('style');
  style.id = 'p5Dev4Styles';
  style.textContent = `
    .dialog-validation{
      margin:0 18px 10px;
      padding:10px 12px;
      border:1px solid #e3c36d;
      border-left:4px solid var(--gold);
      border-radius:12px;
      background:var(--warn-bg);
      color:#5f4710;
      font-size:12px;
      font-weight:700;
      line-height:1.45;
      box-shadow:0 2px 8px rgba(15,39,68,.06);
    }
    .dialog-validation.hidden{display:none!important;}
  `;
  document.head.appendChild(style);
}

function p5Dev4EnsureValidationRegion(){
  p5Dev4EnsureStyles();
  const dialog = document.getElementById('controlDialog');
  if(!dialog) return null;

  let region = document.getElementById('dialogValidation');
  if(region) return region;

  const actions = dialog.querySelector('.dialog-actions');
  if(!actions) return null;

  region = document.createElement('div');
  region.id = 'dialogValidation';
  region.className = 'dialog-validation hidden';
  region.setAttribute('role','alert');
  region.setAttribute('aria-live','assertive');
  region.setAttribute('aria-atomic','true');
  actions.parentNode.insertBefore(region,actions);
  return region;
}

function p5Dev4ShowValidation(check){
  const region = p5Dev4EnsureValidationRegion();
  if(!region) return;
  const code = check?.code ? `${check.code}: ` : '';
  region.textContent = `${code}${check?.message || 'Revise la consistencia de los datos antes de guardar.'}`;
  region.classList.remove('hidden');
}

function p5Dev4ClearValidation(){
  const region = document.getElementById('dialogValidation');
  if(!region) return;
  region.textContent = '';
  region.classList.add('hidden');
}

function p5Dev4RefreshConsistencyMessage(){
  if(!canEditGeneral()){
    p5Dev4ClearValidation();
    return {ok:true};
  }
  const candidate = p5ReadCandidateFromDialog(activeControlId);
  const check = p5ValidateAssessmentConsistency(candidate);
  if(!check.ok) p5Dev4ShowValidation(check);
  else p5Dev4ClearValidation();
  return check;
}

const p5Dev4BaseOpenControl = openControl;
openControl = function(id){
  p5Dev4BaseOpenControl(id);
  p5Dev4EnsureValidationRegion();

  const status = document.getElementById('dlgStatus');
  const evidence = document.getElementById('dlgEvidenceStatus');
  status?.addEventListener('change',p5Dev4RefreshConsistencyMessage);
  evidence?.addEventListener('change',p5Dev4RefreshConsistencyMessage);

  // Legacy records saved before dev.3 may already contain an invalid combination.
  // Surface the inconsistency immediately without altering historical data automatically.
  p5Dev4RefreshConsistencyMessage();
};

const p5Dev4BaseSaveActiveControl = saveActiveControl;
saveActiveControl = async function(){
  if(canEditGeneral()){
    const candidate = p5ReadCandidateFromDialog(activeControlId);
    const check = p5ValidateAssessmentConsistency(candidate);
    if(!check.ok){
      p5Dev4ShowValidation(check);
      return;
    }
  }

  p5Dev4ClearValidation();
  return p5Dev4BaseSaveActiveControl();
};

const p5Dev4BaseLoadData = loadData;
loadData = async function(){
  await p5Dev4BaseLoadData();
  p5Dev4Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev4BaseSaveState = saveState;
saveState = async function(logEntry){
  await p5Dev4BaseSaveState(logEntry);
  p5Dev4Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev4BaseRenderMore = renderMore;
renderMore = function(){
  p5Dev4BaseRenderMore();

  const badge = document.getElementById('p4VersionBadge');
  if(badge) badge.textContent = P5_DEV4_VERSION;

  const continuity = document.getElementById('p4ContinuityPanel');
  if(continuity){
    continuity.innerHTML = '<strong>Hardening P5 · validación visible en modal</strong><p style="margin:6px 0">Versión 0.1.4-dev.4. Las inconsistencias de negocio que bloquean el guardado se muestran dentro del modal, inmediatamente sobre las acciones, evitando que Safari o la capa superior de &lt;dialog&gt; oculten el motivo del rechazo.</p>';
  }
};
