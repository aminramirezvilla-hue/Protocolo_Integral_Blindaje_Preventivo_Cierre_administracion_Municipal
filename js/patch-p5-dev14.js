'use strict';

// P5-BL-003 / MCR-001 — Motor de Coherencia de Estados.
// Incremento aditivo para dev/v0.1.4, cargado después de patch-p5-dev13.js.
// Objetivos:
// 1) validar Diagnóstico × Evidencia × Escenario × Ruta con un único oráculo;
// 2) impedir OIC=Validado sobre estados no evaluados o incoherentes;
// 3) conservar el bloqueo heredado P5-0301 dentro de P5-0320;
// 4) alinear materialidad con el archivo de continuidad: fecha compromiso y avance son materiales;
// 5) mantener nota de seguimiento aislada como NO material.
const P5_DEV14_VERSION = '0.1.4-dev.14';
const P5_MCR_VERSION = 'MCR-001-v1.0';

const P5_MCR_ACTIVE_ROUTES = new Set([
  'A — Subsanación',
  'B — Regularización documental',
  'C — No subsanable / canalización'
]);

const P5_MCR_SUBSANABLE_ROUTES = new Set([
  'A — Subsanación',
  'B — Regularización documental'
]);

const P5_MCR_EVALUABLE_EVIDENCE = new Set([
  'Sin evidencia',
  'Insuficiente',
  'Parcial',
  'Completa no verificada',
  'Completa verificada'
]);

function p5McrOk(extra={}) {
  return {ok:true, code:'', message:'', field:'', ...extra};
}

function p5McrFail(code, message, field='', extra={}) {
  return {ok:false, code, message, field, ...extra};
}

/**
 * Función de dominio pura: no modifica state, IndexedDB ni UI.
 * intent='save' | 'oic-validate'
 */
function p5McrValidate(a, {intent='save'}={}) {
  if(!a) return p5McrOk();

  const status = String(a.status || '');
  const evidence = String(a.evidenceStatus || '');
  const scenario = String(a.scenario || '');
  const route = String(a.route || '');

  // NO APLICA — regla integral primero, para un único código funcional.
  if(status === 'No aplica') {
    if(evidence !== 'No aplica') {
      return p5McrFail(
        'P5-0323',
        'No se puede guardar: “No aplica” exige Evidencia=No aplica, Escenario=Sin incidencia y Ruta=No aplica.',
        'evidenceStatus'
      );
    }
    if(scenario !== 'Sin incidencia') {
      return p5McrFail(
        'P5-0323',
        'No se puede guardar: “No aplica” exige Evidencia=No aplica, Escenario=Sin incidencia y Ruta=No aplica.',
        'scenario'
      );
    }
    if(route !== 'No aplica') {
      return p5McrFail(
        'P5-0323',
        'No se puede guardar: “No aplica” exige Evidencia=No aplica, Escenario=Sin incidencia y Ruta=No aplica.',
        'route'
      );
    }
  }

  // NO EVALUADO — puede servir para preparación/acopio, pero no usa Evidencia=No aplica.
  if(status === 'No evaluado' && evidence === 'No aplica') {
    return p5McrFail(
      'P5-0320',
      'No se puede guardar: mientras el diagnóstico sea “No evaluado”, la evidencia no puede marcarse “No aplica”.',
      'evidenceStatus'
    );
  }

  // CONFORME — conjunto canónico.
  if(status === 'Conforme') {
    if(evidence !== 'Completa verificada') {
      return p5McrFail(
        'P5-0320',
        'Compatibilidad P5-0301: un control Conforme requiere Evidencia=Completa verificada.',
        'evidenceStatus',
        {legacyCode:'P5-0301'}
      );
    }
    if(scenario !== 'Sin incidencia') {
      return p5McrFail(
        'P5-0321',
        'No se puede guardar: un control Conforme exige Escenario=Sin incidencia.',
        'scenario'
      );
    }
    if(route !== 'No aplica') {
      return p5McrFail(
        'P5-0322',
        'No se puede guardar: un control Conforme exige Ruta=No aplica.',
        'route'
      );
    }
  }

  // SUBSANABLE — incidencia + ruta A/B; Evidencia sólo se prohíbe como No aplica.
  if(status === 'Subsanable') {
    if(evidence === 'No aplica') {
      return p5McrFail(
        'P5-0320',
        'No se puede guardar: un control Subsanable no puede tener Evidencia=No aplica.',
        'evidenceStatus'
      );
    }
    if(scenario === 'Sin incidencia') {
      return p5McrFail(
        'P5-0321',
        'No se puede guardar: un control Subsanable requiere una incidencia identificada.',
        'scenario'
      );
    }
    if(!P5_MCR_SUBSANABLE_ROUTES.has(route)) {
      return p5McrFail(
        'P5-0322',
        'No se puede guardar: un control Subsanable requiere Ruta A — Subsanación o Ruta B — Regularización documental.',
        'route'
      );
    }
  }

  // CRÍTICO — evidencia evaluable + incidencia + cualquier ruta activa A/B/C.
  if(status === 'Crítico') {
    if(!P5_MCR_EVALUABLE_EVIDENCE.has(evidence)) {
      return p5McrFail(
        'P5-0320',
        'No se puede guardar: un control Crítico requiere evidencia evaluable; no admite “No evaluada” ni “No aplica”.',
        'evidenceStatus'
      );
    }
    if(scenario === 'Sin incidencia') {
      return p5McrFail(
        'P5-0321',
        'No se puede guardar: un control Crítico requiere una incidencia identificada.',
        'scenario'
      );
    }
    if(!P5_MCR_ACTIVE_ROUTES.has(route)) {
      return p5McrFail(
        'P5-0322',
        'No se puede guardar: un control Crítico requiere una ruta activa A, B o C.',
        'route'
      );
    }
  }

  // NO SUBSANABLE — evidencia evaluable + incidencia + Ruta C.
  if(status === 'No subsanable / posible responsabilidad') {
    if(!P5_MCR_EVALUABLE_EVIDENCE.has(evidence)) {
      return p5McrFail(
        'P5-0320',
        'No se puede guardar: un control No subsanable requiere evidencia evaluable; no admite “No evaluada” ni “No aplica”.',
        'evidenceStatus'
      );
    }
    if(scenario === 'Sin incidencia') {
      return p5McrFail(
        'P5-0321',
        'No se puede guardar: un control No subsanable requiere una incidencia identificada.',
        'scenario'
      );
    }
    if(route !== 'C — No subsanable / canalización') {
      return p5McrFail(
        'P5-0322',
        'No se puede guardar: un control No subsanable debe preservar evidencia y canalizarse mediante Ruta C.',
        'route'
      );
    }
  }

  // OIC=Validado: además de coherencia, el control debe estar evaluado.
  if(intent === 'oic-validate' && status === 'No evaluado') {
    return p5McrFail(
      'P5-0324',
      'No se puede validar por OIC: el control continúa como “No evaluado”.',
      'status'
    );
  }

  return p5McrOk();
}

function p5McrValidateForOic(a) {
  const base = p5McrValidate(a, {intent:'save'});
  if(!base.ok) {
    return p5McrFail(
      'P5-0324',
      `No se puede validar por OIC: el estado no cumple MCR-001 (${base.code}). ${base.message}`,
      base.field || 'oicValidation',
      {causeCode:base.code, legacyCode:base.legacyCode || ''}
    );
  }
  return p5McrValidate(a, {intent:'oic-validate'});
}

// Sustituye el oráculo parcial de dev.3 sin duplicar lógica.
// p5Dev5ValidateCandidate(), dev.12 y los validadores heredados consumirán este MCR.
p5ValidateAssessmentConsistency = function(a) {
  return p5McrValidate(a, {intent:'save'});
};

// Alinea la clasificación de materialidad con el archivo de continuidad vigente.
// Los arrays son const, pero sus contenidos son mutables y dev.7/dev.12 los consultan en runtime.
function p5Dev14PromoteMaterialField(key, label) {
  if(typeof P5_DEV7_NON_MATERIAL_FIELDS !== 'undefined') {
    for(let i=P5_DEV7_NON_MATERIAL_FIELDS.length-1; i>=0; i--) {
      if(P5_DEV7_NON_MATERIAL_FIELDS[i]?.[0] === key) P5_DEV7_NON_MATERIAL_FIELDS.splice(i,1);
    }
  }
  if(typeof P5_DEV7_MATERIAL_FIELDS !== 'undefined' &&
     !P5_DEV7_MATERIAL_FIELDS.some(x=>x?.[0]===key)) {
    P5_DEV7_MATERIAL_FIELDS.push([key,label]);
  }
}

p5Dev14PromoteMaterialField('dueDate','fecha compromiso');
p5Dev14PromoteMaterialField('progress','avance de acción');

function p5Dev14FocusInvalid(check) {
  const map = {
    status:'dlgStatus',
    evidenceStatus:'dlgEvidenceStatus',
    scenario:'dlgScenario',
    route:'dlgRoute',
    oicValidation:'dlgOic'
  };
  const target = document.getElementById(map[check?.field] || '');
  if(target) {
    target.focus({preventScroll:true});
    target.scrollIntoView({block:'center',behavior:'smooth'});
    return;
  }
  if(typeof p5Dev5FocusInvalid === 'function') p5Dev5FocusInvalid(check);
}

function p5Dev14Show(check) {
  if(typeof p5Dev4ShowValidation === 'function') p5Dev4ShowValidation(check);
  p5Dev14FocusInvalid(check);
}

function p5Dev14Clear() {
  if(typeof p5Dev4ClearValidation === 'function') p5Dev4ClearValidation();
}

// OIC necesita validación explícita porque dev.3/dev.5 omitían deliberadamente al Revisor/OIC.
const p5Dev14BaseOpenControl = openControl;
openControl = function(id) {
  p5Dev14BaseOpenControl(id);

  const oic = document.getElementById('dlgOic');
  if(oic) {
    oic.addEventListener('change', () => {
      if(!canEditOic() || oic.value !== 'Validado') return p5Dev14Clear();
      const candidate = p5ReadCandidateFromDialog(activeControlId);
      const check = p5McrValidateForOic(candidate);
      if(!check.ok) p5Dev14Show(check);
      else p5Dev14Clear();
    });
  }
};

// Última barrera antes de toda persistencia iniciada desde el modal.
// No muta state hasta que el candidato completo resulte válido.
const p5Dev14BaseSaveActiveControl = saveActiveControl;
saveActiveControl = async function() {
  const id = activeControlId;
  if(!id) return p5Dev14BaseSaveActiveControl();

  const candidate = p5ReadCandidateFromDialog(id);

  if(canEditGeneral()) {
    const check = p5McrValidate(candidate, {intent:'save'});
    if(!check.ok) {
      p5Dev14Show(check);
      return;
    }
  }

  if(canEditOic() && candidate?.oicValidation === 'Validado') {
    const check = p5McrValidateForOic(candidate);
    if(!check.ok) {
      p5Dev14Show(check);
      return;
    }
  }

  p5Dev14Clear();
  return p5Dev14BaseSaveActiveControl();
};

function p5Dev14Stamp() {
  if(!state) return;
  state.version = P5_DEV14_VERSION;
  state.workspace ||= {};
  state.workspace.runtimeVersion = P5_DEV14_VERSION;
  state.workspace.storageNamespace = 'p5-preview::';
  state.workspace.releaseTrack = 'P5';
  state.workspace.mcrVersion = P5_MCR_VERSION;
  state.workspace.consistencyModel =
    'diagnostic+evidence+scenario+route+inline-validation+action-plan+materiality+oic-invalidation+oic-mcr-gate+granular-json-merge+rbac-hardening+profile-lifecycle+governed-conflict-resolution';
}

const p5Dev14BaseLoadData = loadData;
loadData = async function() {
  await p5Dev14BaseLoadData();
  p5Dev14Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev14BaseSaveState = saveState;
saveState = async function(logEntry) {
  await p5Dev14BaseSaveState(logEntry);
  p5Dev14Stamp();
  await idbSet(STATE_KEY,state);
};

const p5Dev14BaseRenderMore = renderMore;
renderMore = function() {
  p5Dev14BaseRenderMore();

  const badge = document.getElementById('p4VersionBadge');
  if(badge) badge.textContent = P5_DEV14_VERSION;

  const continuity = document.getElementById('p4ContinuityPanel');
  if(continuity && !document.getElementById('p5Mcr001Status')) {
    const block = document.createElement('div');
    block.id = 'p5Mcr001Status';
    block.innerHTML =
      '<p style="margin:6px 0"><strong>P5-BL-003 · MCR-001:</strong> motor integral Diagnóstico × Evidencia × Escenario × Ruta activo; OIC=Validado usa el mismo oráculo; fecha compromiso y avance se consideran cambios materiales.</p>';
    continuity.appendChild(block);
  }
};

// Superficie de QA intencional para Safari Web Inspector; función pura, sin persistencia.
window.CATU_MCR_VERSION = P5_MCR_VERSION;
window.CATU_MCR_VALIDATE = p5McrValidate;
window.CATU_MCR_VALIDATE_OIC = p5McrValidateForOic;
