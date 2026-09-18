'use strict';

// P5-PWA-009 — Safari/PWA cache hardening.
// Stamps the runtime after dev.12 and exposes the cache-recovery control state.
const P5_DEV13_VERSION = '0.1.4-dev.13';

function p5Dev13Stamp(){
  if(!state) return;
  state.version=P5_DEV13_VERSION;
  state.workspace ||= {};
  state.workspace.runtimeVersion=P5_DEV13_VERSION;
  state.workspace.storageNamespace='p5-preview::';
  state.workspace.releaseTrack='P5';
  state.workspace.cachePolicy='network-first-navigation';
}

const p5Dev13BaseLoadData=loadData;
loadData=async function(){
  await p5Dev13BaseLoadData();
  p5Dev13Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev13BaseSaveState=saveState;
saveState=async function(logEntry){
  await p5Dev13BaseSaveState(logEntry);
  p5Dev13Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev13BaseRenderMore=renderMore;
renderMore=function(){
  p5Dev13BaseRenderMore();
  const badge=document.getElementById('p4VersionBadge');
  if(badge) badge.textContent=P5_DEV13_VERSION;
  const continuity=document.getElementById('p4ContinuityPanel');
  if(continuity){
    continuity.insertAdjacentHTML('beforeend','<p style="margin:6px 0"><strong>P5-PWA-009:</strong> navegación HTML en modo network-first para evitar que Safari conserve una versión anterior del preview después de un despliegue.</p>');
  }
};
