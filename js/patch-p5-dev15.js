'use strict';

// P5-INC-003 — cierre de exposición UI de administración de perfiles piloto.
// Incremento aditivo posterior a dev.14.
// Objetivos:
// 1) mantener la autorización funcional de dev.11 intacta;
// 2) no renderizar controles de alta de perfiles para roles no administradores;
// 3) conservar la lista/selector de perfiles locales para pruebas del piloto;
// 4) preservar Admin/Coordinador como únicos gestores del ciclo de vida de perfiles.
const P5_DEV15_VERSION = '0.1.4-dev.15';

function p5Dev15Role(){
  return currentUser()?.role || '';
}

function p5Dev15CanManageProfiles(){
  if(typeof p5Dev11CanManageProfiles === 'function') {
    return p5Dev11CanManageProfiles();
  }
  return ['admin','coordinator'].includes(p5Dev15Role());
}

function p5Dev15ProfileUiSnapshot(){
  const heading = [...document.querySelectorAll('h3')]
    .find(el => (el.textContent || '').trim() === 'Agregar perfil piloto') || null;

  return {
    version: P5_DEV15_VERSION,
    role: p5Dev15Role(),
    canManage: p5Dev15CanManageProfiles(),
    addProfileHeadingVisible: Boolean(heading && heading.offsetParent !== null),
    newUserNamePresent: Boolean(document.getElementById('newUserName')),
    newUserRolePresent: Boolean(document.getElementById('newUserRole')),
    newUserAreaPresent: Boolean(document.getElementById('newUserArea')),
    addUserBtnPresent: Boolean(document.getElementById('addUserBtn')),
    deleteButtonsVisible: [...document.querySelectorAll('[data-delete-user]')]
      .filter(el => el.offsetParent !== null).length
  };
}

function p5Dev15ApplyProfileUiGate(){
  if(p5Dev15CanManageProfiles()) {
    return p5Dev15ProfileUiSnapshot();
  }

  const heading = [...document.querySelectorAll('h3')]
    .find(el => (el.textContent || '').trim() === 'Agregar perfil piloto') || null;
  const name = document.getElementById('newUserName');
  const role = document.getElementById('newUserRole');
  const area = document.getElementById('newUserArea');
  const addBtn = document.getElementById('addUserBtn');
  const hint = document.getElementById('p5Dev11ProfileHint');

  const hr = heading?.previousElementSibling?.tagName === 'HR'
    ? heading.previousElementSibling
    : null;
  const nameLabel = name?.closest('label.field') || null;
  const fieldGrid = role?.closest('.field-grid') || area?.closest('.field-grid') || null;

  // Se eliminan los nodos de administración del DOM; no se limitan a disabled/hidden.
  // La barrera funcional de dev.11 permanece como defensa independiente.
  [hr, heading, nameLabel, fieldGrid, addBtn, hint]
    .filter(Boolean)
    .forEach(el => el.remove());

  return p5Dev15ProfileUiSnapshot();
}

function p5Dev15Stamp(){
  if(!state) return;
  state.version = P5_DEV15_VERSION;
  state.workspace ||= {};
  state.workspace.runtimeVersion = P5_DEV15_VERSION;
  state.workspace.storageNamespace = 'p5-preview::';
  state.workspace.releaseTrack = 'P5';
  state.workspace.authorizationModel =
    'role+macroModule+protected-profile-management+profile-ui-gate';
}

const p5Dev15BaseRenderMore = renderMore;
renderMore = function(){
  p5Dev15BaseRenderMore();
  const snapshot = p5Dev15ApplyProfileUiGate();
  p5Dev15Stamp();
  return snapshot;
};

const p5Dev15BaseLoadData = loadData;
loadData = async function(){
  await p5Dev15BaseLoadData();
  p5Dev15Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev15BaseSaveState = saveState;
saveState = async function(logEntry){
  await p5Dev15BaseSaveState(logEntry);
  p5Dev15Stamp();
  await idbSet(STATE_KEY,state);
};

window.CATU_P5_DEV15 = Object.freeze({
  version: P5_DEV15_VERSION,
  canManageProfiles: p5Dev15CanManageProfiles,
  inspect: p5Dev15ProfileUiSnapshot,
  applyProfileUiGate: p5Dev15ApplyProfileUiGate
});

console.info('[CATU E-R] P5 dev.15 Profile Management UI RBAC Gate cargado.');
