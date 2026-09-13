'use strict';

// P5 hardening increment for dev/v0.1.4.
// Fixes P5-INC-001: horizontal authorization gap for Responsable de área.
const P5_DEV2_VERSION = '0.1.4-dev.2';

function p5Dev2Stamp(){
  if(!state) return;
  state.version = P5_DEV2_VERSION;
  state.workspace ||= {};
  state.workspace.runtimeVersion = P5_DEV2_VERSION;
  state.workspace.storageNamespace = 'p5-preview::';
  state.workspace.releaseTrack = 'P5';
  state.workspace.authorizationModel = 'role+macroModule';
}

function p5ResolveControl(controlOrId){
  if(!controlOrId) return controls.find(x=>x.id===activeControlId) || null;
  if(typeof controlOrId === 'string') return controls.find(x=>x.id===controlOrId) || null;
  return controlOrId;
}

function p5CanEditControl(controlOrId){
  const user = currentUser();
  if(!user) return false;

  if(['admin','coordinator','catu'].includes(user.role)) return true;
  if(user.role !== 'area') return false;

  const control = p5ResolveControl(controlOrId);
  if(!control) return false;

  return user.area === 'Todas' || user.area === control.macroModule;
}

// Existing actions.js calls canEditGeneral() from openControl() and saveActiveControl().
// Rebind it so authorization is checked against the active control at both UI and persistence layers.
canEditGeneral = function(){
  return p5CanEditControl(activeControlId);
};

// Preserve existing permissions for evidence except that Responsable de área
// may only add evidence to controls in the assigned macro module.
function p5CanAddEvidence(controlId){
  const user = currentUser();
  if(!user) return false;
  if(user.role !== 'area') return true;
  return p5CanEditControl(controlId);
}

const p5Dev2BaseOpenControl = openControl;
openControl = function(id){
  p5Dev2BaseOpenControl(id);
  const control = p5ResolveControl(id);
  const addEvidenceBtn = $('#addEvidenceFromControl');
  if(addEvidenceBtn && currentUser()?.role === 'area' && !p5CanEditControl(control)){
    addEvidenceBtn.disabled = true;
    addEvidenceBtn.title = 'Sin permiso: el control pertenece a otra área.';
  }
};

const p5Dev2BaseOpenEvidence = openEvidence;
openEvidence = function(controlId){
  if(!p5CanAddEvidence(controlId)){
    toast('Sin permiso: este control pertenece a otra área.');
    return;
  }
  return p5Dev2BaseOpenEvidence(controlId);
};

const p5Dev2BaseSaveEvidence = saveEvidence;
saveEvidence = async function(){
  const controlId = $('#evControlId')?.value || '';
  if(!p5CanAddEvidence(controlId)){
    toast('Sin permiso: no puedes registrar evidencia en otra área.');
    return;
  }
  return p5Dev2BaseSaveEvidence();
};

// Apply dev.2 identity after the inherited dev.1 wrappers have completed.
const p5Dev2BaseLoadData = loadData;
loadData = async function(){
  await p5Dev2BaseLoadData();
  p5Dev2Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev2BaseSaveState = saveState;
saveState = async function(logEntry){
  await p5Dev2BaseSaveState(logEntry);
  p5Dev2Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev2BaseRenderMore = renderMore;
renderMore = function(){
  p5Dev2BaseRenderMore();
  const badge = $('#p4VersionBadge');
  if(badge) badge.textContent = P5_DEV2_VERSION;

  const continuity = $('#p4ContinuityPanel');
  if(continuity){
    continuity.innerHTML = '<strong>Hardening P5 · autorización por ámbito</strong><p style="margin:6px 0">Versión 0.1.4-dev.2. El perfil Responsable de área sólo puede modificar controles y registrar evidencia dentro de su macro módulo asignado. La Validación OIC permanece reservada al perfil Revisor/OIC.</p>';
  }
};
