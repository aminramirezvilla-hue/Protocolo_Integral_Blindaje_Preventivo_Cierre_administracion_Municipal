'use strict';

// P5-INC-002 + gestión de perfiles piloto.
// - Restaura autorización horizontal por macro módulo para Responsable de área.
// - Mantiene Consultor CATU en modo no decisorio con nota/evidencia.
// - Conserva Validación OIC exclusiva de Revisor/OIC.
// - Incorpora eliminación segura de perfiles piloto personalizados.
const P5_DEV11_VERSION = '0.1.4-dev.11';
const P5_DEV11_PROTECTED_PROFILE_IDS = new Set(['u-admin','u-coord','u-area','u-oic','u-catu']);

function p5Dev11Stamp(){
  if(!state) return;
  state.version = P5_DEV11_VERSION;
  state.workspace ||= {};
  state.workspace.runtimeVersion = P5_DEV11_VERSION;
  state.workspace.storageNamespace = 'p5-preview::';
  state.workspace.releaseTrack = 'P5';
  state.workspace.authorizationModel = 'role+macroModule+protected-profile-management';
  state.workspace.consistencyModel = 'diagnostic+evidence+inline-validation+action-plan+materiality+oic-invalidation+granular-json-merge+rbac-hardening+profile-lifecycle';
}

function p5Dev11Role(){ return currentUser()?.role || ''; }

function p5Dev11ResolveControl(controlOrId){
  if(typeof p5ResolveControl === 'function') return p5ResolveControl(controlOrId);
  if(!controlOrId) return controls.find(x=>x.id===activeControlId) || null;
  if(typeof controlOrId === 'string') return controls.find(x=>x.id===controlOrId) || null;
  return controlOrId;
}

function p5Dev11CanEditControl(controlOrId){
  const user = currentUser();
  if(!user) return false;
  if(['admin','coordinator'].includes(user.role)) return true;
  if(user.role !== 'area') return false;

  const control = p5Dev11ResolveControl(controlOrId);
  if(!control) return false;

  // Un Responsable de área debe tener un macro módulo específico. "Todas" no
  // concede privilegio transversal; evita convertir accidentalmente el rol área
  // en un perfil equivalente a coordinador.
  return Boolean(user.area && user.area !== 'Todas' && user.area === control.macroModule);
}

function p5Dev11CanAddFollowUp(controlId){
  const role = p5Dev11Role();
  if(['admin','coordinator','catu'].includes(role)) return true;
  if(role === 'area') return p5Dev11CanEditControl(controlId);
  return false;
}

function p5Dev11CanAddEvidence(controlId){
  const role = p5Dev11Role();
  if(['admin','coordinator','catu'].includes(role)) return true;
  if(role === 'area') return p5Dev11CanEditControl(controlId);
  return false;
}

function p5Dev11CanManageProfiles(){
  return ['admin','coordinator'].includes(p5Dev11Role());
}

// Restore scoped substantive authorization after dev.10 broadened canEditGeneral().
canEditGeneral = function(){
  return p5Dev11CanEditControl(activeControlId);
};

const p5Dev11BaseOpenControl = openControl;
openControl = function(id){
  p5Dev11BaseOpenControl(id);

  const role = p5Dev11Role();
  const inScope = p5Dev11CanEditControl(id);
  const followUp = document.getElementById('dlgFollowUpNote');
  const addEvidence = document.getElementById('addEvidenceFromControl');
  const saveBtn = document.getElementById('saveControlBtn');

  if(followUp){
    followUp.disabled = !p5Dev11CanAddFollowUp(id);
    if(role === 'area' && !inScope) followUp.title = 'Sin permiso: el control pertenece a otra área.';
  }

  if(addEvidence){
    addEvidence.disabled = !p5Dev11CanAddEvidence(id);
    addEvidence.title = addEvidence.disabled ? 'Sin permiso para registrar evidencia en este control.' : '';
  }

  // Defensa visual final para Responsable de área fuera de ámbito.
  if(role === 'area' && !inScope){
    if(saveBtn) saveBtn.disabled = true;
    const body = document.getElementById('dialogBody');
    if(body && !document.getElementById('p5Dev11AreaBanner')){
      const banner = document.createElement('div');
      banner.id = 'p5Dev11AreaBanner';
      banner.className = 'disclaimer';
      banner.style.marginBottom = '10px';
      banner.innerHTML = '<strong>Responsable de área · sólo lectura fuera de ámbito.</strong> Este control pertenece a otro macro módulo. No se permiten cambios sustantivos, notas de seguimiento ni evidencia desde este perfil.';
      body.prepend(banner);
    }
  }
};

// Persistence guard for substantive updates by area users.
const p5Dev11BaseSaveActiveControl = saveActiveControl;
saveActiveControl = async function(){
  if(p5Dev11Role() === 'area' && !p5Dev11CanEditControl(activeControlId)){
    toast('Sin permiso: este control pertenece a otra área.');
    return;
  }
  return p5Dev11BaseSaveActiveControl();
};

// Final evidence guards after the dev.10 wrapper.
const p5Dev11BaseOpenEvidence = openEvidence;
openEvidence = function(controlId){
  if(!p5Dev11CanAddEvidence(controlId)){
    toast('Sin permiso para registrar evidencia en este control.');
    return;
  }
  return p5Dev11BaseOpenEvidence(controlId);
};

const p5Dev11BaseSaveEvidence = saveEvidence;
saveEvidence = async function(){
  const controlId = document.getElementById('evControlId')?.value || '';
  if(!p5Dev11CanAddEvidence(controlId)){
    toast('Sin permiso para registrar evidencia en este control.');
    return;
  }
  return p5Dev11BaseSaveEvidence();
};

async function p5Dev11DeleteProfile(profileId){
  if(!p5Dev11CanManageProfiles()){
    toast('Sólo Administrador municipal o Coordinador E-R pueden gestionar perfiles piloto.');
    return;
  }
  if(P5_DEV11_PROTECTED_PROFILE_IDS.has(profileId)){
    toast('Los perfiles base del sistema no pueden eliminarse.');
    return;
  }
  if(profileId === state.currentUserId){
    toast('No puedes eliminar el perfil actualmente activo. Cambia de perfil primero.');
    return;
  }

  const profile = state.users.find(u=>u.id===profileId);
  if(!profile) return;

  const ok = confirm(`Eliminar el perfil piloto “${profile.name}”?\n\nSe quitará de la lista de perfiles locales. La bitácora, evaluaciones y evidencias históricas asociadas a su nombre se conservarán.`);
  if(!ok) return;

  state.users = state.users.filter(u=>u.id!==profileId);
  await saveState({
    action:'delete-profile',
    summary:`Perfil piloto eliminado: ${profile.name}`,
    deletedProfile:{id:profile.id,name:profile.name,role:profile.role,area:profile.area||''}
  });
  toast(`Perfil “${profile.name}” eliminado`);
  render();
}

// Harden creation of local pilot profiles without rewriting the inherited handler.
const p5Dev11BaseBindMore = bindMore;
bindMore = function(){
  p5Dev11BaseBindMore();

  const addBtn = document.getElementById('addUserBtn');
  const name = document.getElementById('newUserName');
  const role = document.getElementById('newUserRole');
  const area = document.getElementById('newUserArea');
  const canManage = p5Dev11CanManageProfiles();

  [name,role,area].forEach(el=>{ if(el) el.disabled = !canManage; });
  if(addBtn){
    addBtn.disabled = !canManage || state.users.length>=MAX_LOCAL_USERS;
    addBtn.addEventListener('click',ev=>{
      if(!p5Dev11CanManageProfiles()){
        ev.preventDefault();
        ev.stopImmediatePropagation();
        toast('Sólo Administrador municipal o Coordinador E-R pueden agregar perfiles piloto.');
        return;
      }
      if(role?.value === 'area' && (!area?.value || area.value === 'Todas')){
        ev.preventDefault();
        ev.stopImmediatePropagation();
        toast('Para Responsable de área selecciona un macro módulo específico.');
      }
    },true);
  }
};

function p5Dev11DecorateProfileManagement(){
  const rows = [...document.querySelectorAll('.user-row')];
  const canManage = p5Dev11CanManageProfiles();

  rows.slice(0,state.users.length).forEach((row,index)=>{
    const profile = state.users[index];
    if(!profile || P5_DEV11_PROTECTED_PROFILE_IDS.has(profile.id) || !canManage) return;
    if(row.querySelector(`[data-delete-user="${profile.id}"]`)) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'secondary-btn';
    btn.dataset.deleteUser = profile.id;
    btn.textContent = 'Eliminar';
    btn.title = `Eliminar perfil piloto ${profile.name}`;
    btn.addEventListener('click',()=>p5Dev11DeleteProfile(profile.id));
    row.appendChild(btn);
  });

  const addBtn = document.getElementById('addUserBtn');
  if(addBtn && !document.getElementById('p5Dev11ProfileHint')){
    const hint = document.createElement('p');
    hint.id = 'p5Dev11ProfileHint';
    hint.className = 'hint';
    hint.style.marginTop = '8px';
    hint.textContent = canManage
      ? 'Los perfiles base están protegidos. Los perfiles piloto personalizados pueden eliminarse sin borrar su trazabilidad histórica.'
      : 'La administración de perfiles piloto está reservada a Administrador municipal y Coordinador E-R.';
    addBtn.insertAdjacentElement('afterend',hint);
  }
}

const p5Dev11BaseLoadData = loadData;
loadData = async function(){
  await p5Dev11BaseLoadData();
  p5Dev11Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev11BaseSaveState = saveState;
saveState = async function(logEntry){
  await p5Dev11BaseSaveState(logEntry);
  p5Dev11Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev11BaseRenderMore = renderMore;
renderMore = function(){
  p5Dev11BaseRenderMore();
  p5Dev11DecorateProfileManagement();

  const badge = document.getElementById('p4VersionBadge');
  if(badge) badge.textContent = P5_DEV11_VERSION;
  const continuity = document.getElementById('p4ContinuityPanel');
  if(continuity){
    continuity.innerHTML = '<strong>P5-INC-002 · RBAC por ámbito + ciclo de vida de perfiles</strong><p style="margin:6px 0">Versión 0.1.4-dev.11. Responsable de área vuelve a quedar limitado a su macro módulo; “Todas” no concede privilegio transversal. Consultor CATU conserva consulta, nota y evidencia no decisoria. Validación OIC continúa exclusiva del Revisor/OIC. Administrador/Coordinador pueden eliminar perfiles piloto personalizados sin borrar trazabilidad histórica.</p>';
  }
};
