'use strict';

// P5 initialization increment for dev/v0.1.4.
// Keeps main / v0.1.3-pilot-calibrated immutable while isolating P5 test data.
const P5_DEV_VERSION = '0.1.4-dev.1';
const P5_STORAGE_PREFIX = 'p5-preview::';

// Rebind persistence directly to the original IndexedDB accessors captured before P4.
// This avoids nesting prefixes such as p4-preview::p5-preview::STATE_KEY.
idbGet = function(key){ return p4BaseIdbGet(`${P5_STORAGE_PREFIX}${key}`); };
idbSet = function(key,value){ return p4BaseIdbSet(`${P5_STORAGE_PREFIX}${key}`,value); };

function p5Dev1Stamp(){
  if(!state) return;
  state.version = P5_DEV_VERSION;
  state.workspace ||= {};
  state.workspace.runtimeVersion = P5_DEV_VERSION;
  state.workspace.storageNamespace = P5_STORAGE_PREFIX;
  state.workspace.releaseTrack = 'P5';
}

// P4 wrappers remain useful for validation/alerts; P5 applies the final runtime stamp.
const p5BaseLoadData = loadData;
loadData = async function(){
  await p5BaseLoadData();
  p5Dev1Stamp();
  await idbSet(STATE_KEY,state);
};

const p5BaseSaveState = saveState;
saveState = async function(logEntry){
  p5Dev1Stamp();
  return p5BaseSaveState(logEntry);
};

// Make P5 identity explicit in the UI and remove the inherited P4 continuity prompt.
const p5BaseRenderMore = renderMore;
renderMore = function(){
  p5BaseRenderMore();
  const badge=$('#p4VersionBadge');
  if(badge) badge.textContent=P5_DEV_VERSION;

  const storageNote=$('#p4StorageNote');
  if(storageNote) storageNote.textContent='Preview P5 aislado: utiliza el namespace p5-preview:: en IndexedDB y no modifica la baseline publicada en main.';

  const continuity=$('#p4ContinuityPanel');
  if(continuity){
    continuity.innerHTML='<strong>Inicialización P5</strong><p style="margin:6px 0">Entorno dev/v0.1.4 aislado de P4. Namespace activo: p5-preview::. La campaña P5 debe iniciar con datos de prueba propios o una migración controlada explícita.</p>';
  }
};
