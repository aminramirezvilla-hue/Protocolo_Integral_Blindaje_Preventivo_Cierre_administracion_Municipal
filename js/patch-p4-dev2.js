'use strict';

// P4 incremental improvement dev.2. Loaded only from dev/v0.1.3 preview.
// Baseline v0.1.2-pilot-stable remains immutable.
const P4_DEV2_VERSION = '0.1.3-dev.2';
const P4_SAMPLE_IDS = ['R001','R015','R006'];

function p4Dev2Stamp(){
  if(!state) return;
  state.version = P4_DEV2_VERSION;
  state.workspace ||= {};
  state.workspace.runtimeVersion = P4_DEV2_VERSION;
  state.workspace.storageNamespace = typeof P4_STORAGE_PREFIX !== 'undefined' ? P4_STORAGE_PREFIX : 'p4-preview::';
}

const p4Dev2BaseLoadData = loadData;
loadData = async function(){
  await p4Dev2BaseLoadData();
  p4Dev2Stamp();
  await idbSet(STATE_KEY,state);
};

const p4Dev2BaseSaveState = saveState;
saveState = async function(logEntry){
  p4Dev2Stamp();
  return p4Dev2BaseSaveState(logEntry);
};

function p4GroupAlerts(alerts){
  const grouped = new Map();
  for(const a of alerts){
    if(!grouped.has(a.id)) grouped.set(a.id,{id:a.id,text:a.text,level:a.level,causes:[]});
    const g = grouped.get(a.id);
    g.level = Math.max(g.level,a.level);
    g.causes.push(a);
  }
  return [...grouped.values()].sort((a,b)=>b.level-a.level || a.id.localeCompare(b.id));
}

function p4AlertGroupCard(g){
  const top = [...g.causes].sort((a,b)=>b.level-a.level)[0];
  const causes = g.causes.map(a=>`<li><strong>${esc(a.title)}</strong></li>`).join('');
  const countLabel = g.causes.length===1 ? '1 causa' : `${g.causes.length} causas`;
  return `<div class="alert-item">
    <div class="control-top">
      <div><span class="control-id">${esc(g.id)}</span><strong>${esc(top.title)}</strong><div class="meta">${esc(g.text)}</div></div>
      <button class="secondary-btn tiny" data-open-control="${esc(g.id)}">Abrir</button>
    </div>
    <div class="meta" style="margin-top:8px">${countLabel}${g.causes.length>1?' · alertas agrupadas sin pérdida de causas':''}</div>
    ${g.causes.length>1?`<details style="margin-top:6px"><summary>Ver causas (${g.causes.length})</summary><ul style="margin:6px 0 0 18px">${causes}</ul></details>`:''}
  </div>`;
}

// Replace only the Home alert presentation. Metrics, alert generation and IPER remain unchanged.
renderHome = function(){
  const m=metrics();
  const groups=p4GroupAlerts(m.alerts);
  const alertCards=groups.slice(0,7).map(p4AlertGroupCard).join('') || `<div class="empty-card">No hay alertas adicionales. El diagnóstico todavía puede estar pendiente.</div>`;
  const modules=m.moduleRows.map(x=>`<div class="module-row"><span title="${esc(x.name)}">${esc(x.name)}</span><div class="bar"><i style="width:${Math.max(0,Math.min(100,x.iper))}%"></i></div><b>${Math.round(x.iper)}%</b></div>`).join('');
  $('#app').innerHTML = `${pageHead('Panel de preparación','Versión Saliente · seguimiento preventivo antes de la entrega-recepción.',`<button class="secondary-btn" data-view-link="report">Reporte ejecutivo</button>`)}
    <section class="grid-kpi">
      <div class="kpi-card"><div class="label">Evaluación</div><div class="value">${Math.round(m.evaluatedPct)}%</div><div class="sub">${m.evaluated}/${m.applicable} controles aplicables</div></div>
      <div class="kpi-card"><div class="label">Evidencia</div><div class="value">${Math.round(m.evidenceCoverage)}%</div><div class="sub">Cobertura ponderada</div></div>
      <div class="kpi-card"><div class="label">Críticos</div><div class="value">${m.critical}</div><div class="sub">${m.nonSub} no subsanables</div></div>
      <div class="kpi-card"><div class="label">Cerrados</div><div class="value">${m.closed}</div><div class="sub">Conforme + evidencia + OIC</div></div>
    </section>
    <section class="hero-grid">
      <div class="card"><h2>IPER-CATU</h2><div class="iper-wrap"><div class="iper-ring" style="--pct:${m.iper}"><div class="iper-center"><strong>${Math.round(m.iper)}</strong><small>de 100</small></div></div></div><div class="classification">${esc(m.classification)}</div><p class="hint">Indicador interno: cumplimiento 65% + evidencia 35%, ponderado por criticidad.</p></div>
      <div class="card"><h2>Preparación por macro módulo</h2><div class="module-list">${modules}</div></div>
    </section>
    <section class="card"><div class="control-top"><div><h2>Alertas y prioridades</h2><p class="meta">Orden: no subsanables → críticos → vencimientos → evidencia incompleta. Las causas se agrupan por control.</p></div><span class="status-pill danger">${m.alerts.length} causas · ${groups.length} controles</span></div><div class="alert-list">${alertCards}</div></section>`;
  bindOpenButtons();
  $$('[data-view-link]').forEach(b=>b.addEventListener('click',()=>{currentView=b.dataset.viewLink;render();window.scrollTo({top:0,behavior:'smooth'});}));
};

function p4MissingSampleIds(){
  return P4_SAMPLE_IDS.filter(id=>assessmentFor(id).status==='No evaluado');
}

async function p4RestoreSampleContinuity(){
  if(!['admin','catu'].includes(currentUser().role)){
    toast('Usa Administrador municipal o Consultor CATU para restaurar la muestra P4.1.');
    return;
  }
  const missing=p4MissingSampleIds();
  if(!missing.length){ toast('La muestra P4.1 ya está incorporada.'); return; }
  if(!confirm(`Se incorporarán ${missing.join(', ')} como datos de prueba controlados para continuidad de P4. ¿Continuar?`)) return;
  const now=nowIso();
  const seed={
    R001:{status:'Conforme',evidenceStatus:'Completa no verificada',scenario:'Sin incidencia',route:'No aplica',responsible:'Secretaría General/Administración',dueDate:'',progress:100,residualRisk:2,evidenceLink:'',notes:'P4 continuidad: estructura orgánica revisada; pendiente validación OIC.',oicValidation:'Pendiente'},
    R015:{status:'Subsanable',evidenceStatus:'Parcial',scenario:'Documento incompleto',route:'A — Subsanación',responsible:'Tesorería',dueDate:'2026-09-18',progress:0,residualRisk:2,evidenceLink:'',notes:'P4 continuidad: conciliación bancaria/documental por completar.',oicValidation:'Pendiente'},
    R006:{status:'Subsanable',evidenceStatus:'Parcial',scenario:'Documento incompleto',route:'B — Regularización documental',responsible:'Recursos Humanos',dueDate:'2026-09-18',progress:0,residualRisk:2,evidenceLink:'',notes:'P4 continuidad: expediente/tabulador/nómina con soporte documental por completar.',oicValidation:'Pendiente'}
  };
  for(const id of missing){
    const c=controls.find(x=>x.id===id);
    state.assessments[id]={...defaultAssessment(c),...seed[id],id,evaluator:'Migración controlada P4.1',evaluatedAt:now,updatedAt:now,closedAt:''};
  }
  state.workspace ||= {};
  state.workspace.p4ContinuityRestoredAt=now;
  state.workspace.p4ContinuityControls=P4_SAMPLE_IDS;
  await saveState({action:'p4-restore-sample',summary:`Continuidad P4.1: ${missing.join(', ')}`});
  toast(`Muestra P4.1 incorporada: ${missing.join(', ')}`);
  render();
}

const p4Dev2BaseRenderMore = renderMore;
renderMore = function(){
  p4Dev2BaseRenderMore();
  const badge=$('#p4VersionBadge');
  if(badge) badge.textContent=P4_DEV2_VERSION;
  const securityHeading=[...document.querySelectorAll('.settings-grid .card h2')].find(h=>h.textContent.includes('PWA y seguridad'));
  const securityCard=securityHeading?.closest('.card');
  if(securityCard && !$('#p4ContinuityPanel')){
    const missing=p4MissingSampleIds();
    securityCard.insertAdjacentHTML('beforeend',`<div id="p4ContinuityPanel" class="disclaimer" style="margin-top:12px"><strong>Continuidad P4.1</strong><p style="margin:6px 0">${missing.length?`Faltan en este almacenamiento aislado: ${missing.join(', ')}.`:'R001, R015 y R006 ya están incorporados a la muestra acumulada.'}</p>${missing.length?'<button id="p4RestoreSampleBtn" class="secondary-btn">Restaurar 3 controles P4.1</button>':''}</div>`);
    $('#p4RestoreSampleBtn')?.addEventListener('click',p4RestoreSampleContinuity);
  }
};
