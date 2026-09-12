'use strict';

// P4 corrective increment. Loaded only from dev/v0.1.3.
// Baseline v0.1.2-pilot-stable remains immutable.
const P4_DEV_VERSION = '0.1.3-dev.1';
const P4_ACTIONABLE = new Set(['Subsanable','Crítico','No subsanable / posible responsabilidad']);

function p4RouteHelpText(){
  const status = $('#dlgStatus')?.value || 'No evaluado';
  const scenario = $('#dlgScenario')?.value || 'Sin incidencia';
  const route = $('#dlgRoute')?.value || 'No aplica';

  if(P4_ACTIONABLE.has(status) && route === 'No aplica'){
    return '⚠ Este estatus requiere una ruta A, B o C. “No aplica” no es válido para controles accionables.';
  }
  if(status === 'No subsanable / posible responsabilidad' && route !== 'C — No subsanable / canalización'){
    return '⚠ Un control clasificado como no subsanable debe preservar evidencia y canalizarse mediante Ruta C.';
  }
  if(route === 'A — Subsanación'){
    return 'Ruta A: corrección lícita antes de la entrega. No altera hechos históricos ni sustituye autorizaciones que jurídicamente ya no puedan emitirse.';
  }
  if(route === 'B — Regularización documental'){
    if(scenario === 'Documento inexistente'){
      return 'Ruta B con documento inexistente sólo procede si el hecho o acto realmente existió y puede reconstruirse su soporte con fuentes verificables. Si el acto nunca existió, no debe fabricarse ni retrofecharse: considere Ruta C.';
    }
    return 'Ruta B: completar o reconstruir soporte de un hecho existente con fecha real y trazabilidad. No fabricar, simular ni retrofechar evidencia.';
  }
  if(route === 'C — No subsanable / canalización'){
    return 'Ruta C: preservar evidencia, documentar hechos y efectos, cuantificar cuando proceda y canalizar al OIC/autoridad competente sin prejuzgar responsabilidades.';
  }
  return 'Seleccione escenario y ruta conforme a los hechos documentados. La ruta no sustituye el fundamento jurídico del control.';
}

function p4RefreshRouteHelp(){
  const host = $('#p4RouteHelp');
  if(!host) return;
  host.textContent = p4RouteHelpText();
  const actionable = P4_ACTIONABLE.has($('#dlgStatus')?.value || '');
  const missingDue = actionable && !($('#dlgDue')?.value || '');
  const dueHint = $('#p4DueHint');
  if(dueHint){
    dueHint.textContent = missingDue
      ? '⚠ Los controles accionables requieren fecha compromiso antes de guardar.'
      : 'La fecha compromiso permite gestionar vencimientos y alertas del plan de acción.';
  }
}

// Stamp a traceable runtime version without altering the frozen baseline tag.
const p4BaseLoadData = loadData;
loadData = async function(){
  await p4BaseLoadData();
  if(state){
    state.version = P4_DEV_VERSION;
    state.workspace ||= {};
    state.workspace.runtimeVersion = P4_DEV_VERSION;
    await idbSet(STATE_KEY,state);
  }
};

const p4BaseSaveState = saveState;
saveState = async function(logEntry){
  if(state){
    state.version = P4_DEV_VERSION;
    state.workspace ||= {};
    state.workspace.runtimeVersion = P4_DEV_VERSION;
  }
  return p4BaseSaveState(logEntry);
};

// Add contextual guidance to the existing control dialog.
const p4BaseOpenControl = openControl;
openControl = function(id){
  p4BaseOpenControl(id);
  const route = $('#dlgRoute');
  const due = $('#dlgDue');
  if(route && !$('#p4RouteHelp')){
    route.closest('label')?.insertAdjacentHTML('afterend', '<div id="p4RouteHelp" class="disclaimer" style="margin-top:8px"></div>');
  }
  if(due && !$('#p4DueHint')){
    due.closest('label')?.insertAdjacentHTML('beforeend', '<span id="p4DueHint" class="hint"></span>');
  }
  ['dlgStatus','dlgScenario','dlgRoute','dlgDue'].forEach(fid=>{
    $('#'+fid)?.addEventListener('change',p4RefreshRouteHelp);
  });
  p4RefreshRouteHelp();
};

// Prevent incoherent action plans before they are persisted.
const p4BaseSaveActiveControl = saveActiveControl;
saveActiveControl = async function(){
  if(canEditGeneral()){
    const status = $('#dlgStatus')?.value || 'No evaluado';
    const route = $('#dlgRoute')?.value || 'No aplica';
    const dueDate = $('#dlgDue')?.value || '';

    if(P4_ACTIONABLE.has(status) && route === 'No aplica'){
      toast('Selecciona Ruta A, B o C antes de guardar este control.');
      $('#dlgRoute')?.focus();
      p4RefreshRouteHelp();
      return;
    }
    if(P4_ACTIONABLE.has(status) && !dueDate){
      toast('Captura una fecha compromiso para el plan de acción.');
      $('#dlgDue')?.focus();
      p4RefreshRouteHelp();
      return;
    }
    if(status === 'No subsanable / posible responsabilidad' && route !== 'C — No subsanable / canalización'){
      toast('Los controles no subsanables deben utilizar Ruta C.');
      $('#dlgRoute')?.focus();
      p4RefreshRouteHelp();
      return;
    }
  }
  return p4BaseSaveActiveControl();
};

// Make the runtime version visible to pilot users.
const p4BaseRenderMore = renderMore;
renderMore = function(){
  p4BaseRenderMore();
  const headings = [...document.querySelectorAll('.settings-grid .card h2')];
  const securityHeading = headings.find(h=>h.textContent.includes('PWA y seguridad'));
  if(securityHeading && !$('#p4VersionBadge')){
    securityHeading.insertAdjacentHTML('beforeend', ` <span id="p4VersionBadge" class="status-pill info">${P4_DEV_VERSION}</span>`);
  }
};
