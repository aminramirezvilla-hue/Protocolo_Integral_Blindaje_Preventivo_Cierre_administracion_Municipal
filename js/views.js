function statusClass(status){
  if(status==='Conforme') return 'ok';
  if(status==='Subsanable') return 'warn';
  if(status==='Crítico') return 'critical';
  if(status==='No subsanable / posible responsabilidad') return 'danger';
  if(status==='No aplica') return 'info';
  return '';
}
function evidenceClass(status){
  if(status==='Completa verificada') return 'ok';
  if(status==='Completa no verificada' || status==='Parcial') return 'warn';
  if(status==='Insuficiente' || status==='Sin evidencia') return 'danger';
  return '';
}
function riskLabel(r){ return ({1:'Bajo',2:'Medio',3:'Alto',4:'Muy alto'})[r] || r; }
function controlCard(c){
  const a=assessmentFor(c.id);
  return `<article class="control-card" data-control="${c.id}" tabindex="0">
    <div class="control-top"><div><span class="control-id">${c.id}</span><h3>${esc(c.requirement)}</h3></div><span class="status-pill ${statusClass(a.status)}">${esc(a.status)}</span></div>
    <div class="meta">${esc(c.macroModule)} · ${esc(c.milestone)} · Riesgo ${esc(riskLabel(a.residualRisk||c.baseRisk))}</div>
    <div class="control-footer"><span class="status-pill ${evidenceClass(a.evidenceStatus)}">Evidencia: ${esc(a.evidenceStatus)}</span>${a.dueDate?`<span class="status-pill">Compromiso ${fmtDate(a.dueDate)}</span>`:''}</div>
  </article>`;
}

function renderHeader(){
  $('#workspaceName').textContent=state.workspace.municipality || 'Municipio piloto';
  $('#roleBadge').textContent=roleLabel(currentUser().role);
  const b=$('#baselineBadge');
  if(r086Validated()){
    b.textContent=`Baseline validada · ${state.workspace.baselineDate||baseline.verifiedAt}`;
    b.classList.remove('warning');
  } else {
    b.textContent=`R086 pendiente · baseline ${state.workspace.baselineDate||baseline.verifiedAt}`;
    b.classList.add('warning');
  }
}
function pageHead(title,desc,actions=''){
  return `<div class="page-head"><div><h1>${title}</h1><p>${desc}</p></div><div class="page-actions">${actions}</div></div>`;
}

function renderHome(){
  const m=metrics();
  const alertCards=m.alerts.slice(0,7).map(a=>`<div class="alert-item"><div class="control-top"><div><span class="control-id">${a.id}</span><strong>${esc(a.title)}</strong></div><button class="secondary-btn tiny" data-open-control="${a.id}">Abrir</button></div><div class="meta">${esc(a.text)}</div></div>`).join('') || `<div class="empty-card">No hay alertas adicionales. El diagnóstico todavía puede estar pendiente.</div>`;
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
    <section class="card"><div class="control-top"><div><h2>Alertas y prioridades</h2><p class="meta">Orden: no subsanables → críticos → vencimientos → evidencia incompleta.</p></div><span class="status-pill danger">${m.alerts.length}</span></div><div class="alert-list">${alertCards}</div></section>`;
}

function renderControls(){
  const modules=[...new Set(controls.map(c=>c.macroModule))].sort();
  $('#app').innerHTML = `${pageHead('Controles','84 controles activos derivados de la baseline C2. Toca un control para evaluarlo.')}
    <div class="filters no-print"><input id="qControl" type="search" placeholder="Buscar ID, requisito o responsable…"><select id="fModule"><option value="">Todos los módulos</option>${modules.map(m=>`<option>${esc(m)}</option>`).join('')}</select><select id="fStatus"><option value="">Todos los estatus</option>${STATUS_OPTIONS.map(s=>`<option>${esc(s)}</option>`).join('')}</select><select id="fRisk"><option value="">Todo riesgo</option><option value="4">Muy alto</option><option value="3">Alto</option><option value="2">Medio</option><option value="1">Bajo</option></select></div>
    <div id="controlResults" class="control-list"></div>`;
  ['qControl','fModule','fStatus','fRisk'].forEach(id=>$('#'+id).addEventListener('input',filterControls));
  filterControls();
}
function filterControls(){
  const q=($('#qControl')?.value||'').toLowerCase();
  const mod=$('#fModule')?.value||'';
  const st=$('#fStatus')?.value||'';
  const risk=$('#fRisk')?.value||'';
  const list=controls.filter(c=>{
    const a=assessmentFor(c.id);
    const hay=[c.id,c.requirement,c.responsibleBase,c.module,c.macroModule].join(' ').toLowerCase();
    return (!q||hay.includes(q)) && (!mod||c.macroModule===mod) && (!st||a.status===st) && (!risk||String(a.residualRisk||c.baseRisk)===risk);
  });
  $('#controlResults').innerHTML=list.map(controlCard).join('') || `<div class="empty-card">No hay controles con estos filtros.</div>`;
  bindControlCards();
}

function renderActions(){
  const list=controls.map(c=>({c,a:assessmentFor(c.id)})).filter(x=>['Subsanable','Crítico','No subsanable / posible responsabilidad'].includes(x.a.status));
  list.sort((x,y)=>(y.a.residualRisk||y.c.baseRisk)-(x.a.residualRisk||x.c.baseRisk));
  $('#app').innerHTML=`${pageHead('Plan de acción','Sólo aparecen controles que requieren intervención.')}
    <div class="action-list">${list.length?list.map(({c,a})=>`<article class="action-card">
      <div class="action-top"><div><span class="control-id">${c.id}</span><h3>${esc(c.requirement)}</h3><div class="meta">${esc(a.scenario)} · ${esc(a.route)}</div></div><span class="status-pill ${statusClass(a.status)}">${esc(a.status)}</span></div>
      <div class="meta" style="margin:9px 0">Responsable: ${esc(a.responsible||c.responsibleBase)} · Compromiso: ${fmtDate(a.dueDate)} · Riesgo residual: ${riskLabel(a.residualRisk)}</div>
      <div class="progress-track"><i style="width:${Math.max(0,Math.min(100,Number(a.progress)||0))}%"></i></div><div class="control-footer"><strong>${Number(a.progress)||0}%</strong><button class="secondary-btn" data-open-control="${c.id}">Actualizar</button></div>
    </article>`).join(''):`<div class="empty-card">No hay acciones abiertas. Al clasificar un control como Subsanable, Crítico o No subsanable aparecerá aquí.</div>`}</div>`;
  bindOpenButtons();
}

function renderEvidence(){
  const ev=[...state.evidence].sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
  $('#app').innerHTML=`${pageHead('Evidencia','La PWA conserva metadatos, vínculos y fotografías locales puntuales. El expediente oficial permanece en Drive/OneDrive.')}
    <div class="evidence-list">${ev.length?ev.map(e=>`<article class="evidence-card"><div class="evidence-top"><div><span class="control-id">${esc(e.controlId)}</span><h3>${esc(e.description)}</h3><div class="meta">${fmtDate((e.createdAt||'').slice(0,10))} · ${esc(e.userName||'')}</div></div>${e.photoData?`<img class="photo-thumb" src="${e.photoData}" alt="Fotografía de evidencia">`:''}</div><div class="control-footer">${e.link?`<a class="secondary-btn" href="${esc(e.link)}" target="_blank" rel="noopener">Abrir expediente</a>`:''}<button class="secondary-btn" data-open-control="${esc(e.controlId)}">Ver control</button></div></article>`).join(''):`<div class="empty-card">Aún no se han registrado evidencias de campo.</div>`}</div>`;
  bindOpenButtons();
}

function renderMore(){
  const user=currentUser();
  const users=state.users.map(u=>`<div class="user-row"><div><strong>${esc(u.name)}</strong><small>${esc(roleLabel(u.role))}${u.area&&u.area!=='Todas'?` · ${esc(u.area)}`:''}</small></div>${u.id===state.currentUserId?'<span class="status-pill ok">Activo</span>':`<button class="secondary-btn" data-switch-user="${u.id}">Usar</button>`}</div>`).join('');
  const roleOpts=ROLES.map(r=>`<option value="${r.id}">${esc(r.label)}</option>`).join('');
  const modules=[...new Set(controls.map(c=>c.macroModule))].sort();
  $('#app').innerHTML=`${pageHead('Más','Configuración del espacio de trabajo, usuarios locales y exportaciones.',`<button class="secondary-btn" data-view-link="report">Reporte</button>`)}
    <div class="settings-grid">
      <section class="card"><h2>Espacio de trabajo</h2><label class="field">Municipio<input id="setMunicipality" value="${esc(state.workspace.municipality||'')}"></label><div class="field-grid"><label class="field">Periodo saliente<input id="setOutgoing" value="${esc(state.workspace.outgoingPeriod||'')}"></label><label class="field">Periodo entrante<input id="setIncoming" value="${esc(state.workspace.incomingPeriod||'')}"></label></div><label class="field">Notas<textarea id="setNotes">${esc(state.workspace.notes||'')}</textarea></label><button id="saveWorkspace" class="primary-btn" ${canEditWorkspace()?'':'disabled'}>Guardar</button><div class="disclaimer">Modo piloto local: los datos quedan en este navegador/dispositivo. Los perfiles son funcionales para probar permisos de interfaz, pero no constituyen autenticación multiusuario real.</div></section>
      <section class="card"><h2>Perfiles locales <span class="status-pill">${state.users.length}/${MAX_LOCAL_USERS}</span></h2>${users}<hr style="border:0;border-top:1px solid var(--line);margin:14px 0"><h3>Agregar perfil piloto</h3><label class="field">Nombre<input id="newUserName" placeholder="Nombre o función"></label><div class="field-grid"><label class="field">Rol<select id="newUserRole">${roleOpts}</select></label><label class="field">Área<select id="newUserArea"><option>Todas</option>${modules.map(m=>`<option>${esc(m)}</option>`).join('')}</select></label></div><button id="addUserBtn" class="secondary-btn" ${state.users.length>=MAX_LOCAL_USERS?'disabled':''}>Agregar perfil</button></section>
      <section class="card"><h2>Exportar / respaldar</h2><p class="hint">El Excel compatible y CSV contienen metadatos del diagnóstico; las fotografías locales no se incluyen en Excel/CSV.</p><div class="page-actions"><button id="csvBtn" class="secondary-btn">CSV</button><button id="xlsBtn" class="secondary-btn">Excel compatible</button><button id="jsonBtn" class="secondary-btn">Respaldo JSON</button><label class="secondary-btn" style="display:inline-flex;align-items:center">Importar JSON<input id="importJson" type="file" accept="application/json" hidden></label></div></section>
      <section class="card"><h2>PWA y seguridad</h2><p class="hint">Frontend estático para GitHub Pages. La aplicación puede trabajar sin internet después de la primera carga. Para producción multiusuario se recomienda activar un backend con autenticación y RLS sin mover el frontend de GitHub Pages.</p><button id="installHelp" class="secondary-btn">Cómo instalar</button>${canReset()?'<button id="resetBtn" class="secondary-btn" style="margin-left:8px">Reiniciar piloto</button>':''}</section>
    </div>`;
  bindMore();
}

function renderReport(){
  const m=metrics();
  const rows=m.moduleRows.map(x=>`<tr><td>${esc(x.name)}</td><td>${x.applicable}</td><td>${x.evaluated}</td><td>${Math.round(x.iper)}%</td><td>${Math.round(x.evidence)}%</td><td>${x.critical}</td></tr>`).join('');
  const critical=controls.map(c=>({c,a:assessmentFor(c.id)})).filter(x=>['Crítico','No subsanable / posible responsabilidad'].includes(x.a.status)).slice(0,20);
  $('#app').innerHTML=`${pageHead('Reporte ejecutivo','Vista imprimible. En móvil use “Imprimir / Guardar PDF”.',`<button id="printReport" class="primary-btn">Imprimir / Guardar PDF</button><button id="csvReport" class="secondary-btn">CSV</button>`)}
    <section class="card report-only"><div class="report-title"><span class="eyebrow">CATU · Centro de Auditoría Técnica y Urbana</span><h1>Preparación para Entrega–Recepción</h1><p>${esc(state.workspace.municipality||'Municipio piloto')} · Corte ${new Intl.DateTimeFormat('es-MX',{dateStyle:'long'}).format(new Date())}</p></div>
    <section class="grid-kpi"><div class="kpi-card"><div class="label">IPER-CATU</div><div class="value">${Math.round(m.iper)}</div><div class="sub">${esc(m.classification)}</div></div><div class="kpi-card"><div class="label">Evaluado</div><div class="value">${Math.round(m.evaluatedPct)}%</div><div class="sub">${m.evaluated}/${m.applicable} aplicables</div></div><div class="kpi-card"><div class="label">Evidencia</div><div class="value">${Math.round(m.evidenceCoverage)}%</div><div class="sub">Cobertura ponderada</div></div><div class="kpi-card"><div class="label">Prioridad</div><div class="value">${m.critical+m.nonSub}</div><div class="sub">críticos + no subsanables</div></div></section>
    <h2>Resumen por macro módulo</h2><table class="report-table"><thead><tr><th>Macro módulo</th><th>Aplicables</th><th>Evaluados</th><th>IPER</th><th>Evidencia</th><th>Críticos</th></tr></thead><tbody>${rows}</tbody></table>
    <h2 style="margin-top:18px">Controles críticos / no subsanables</h2>${critical.length?`<table class="report-table"><thead><tr><th>ID</th><th>Requisito</th><th>Estatus</th><th>Responsable</th><th>Compromiso</th></tr></thead><tbody>${critical.map(({c,a})=>`<tr><td>${c.id}</td><td>${esc(c.requirement)}</td><td>${esc(a.status)}</td><td>${esc(a.responsible||c.responsibleBase)}</td><td>${fmtDate(a.dueDate)}</td></tr>`).join('')}</tbody></table>`:'<p>No se han clasificado controles críticos.</p>'}
    <div class="disclaimer">El IPER-CATU es un indicador interno configurable de preparación. No constituye certificación de cumplimiento, dictamen jurídico, auditoría ni resolución de autoridad. La validez temporal del calendario 2027 permanece condicionada al control R086.</div></section>`;
  $('#printReport').addEventListener('click',()=>window.print());
  $('#csvReport').addEventListener('click',exportCSV);
}

function render(){
  renderHeader();
  $$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===currentView));
  if(currentView==='home') renderHome();
  else if(currentView==='controls') renderControls();
  else if(currentView==='actions') renderActions();
  else if(currentView==='evidence') renderEvidence();
  else if(currentView==='more') renderMore();
  else if(currentView==='report') renderReport();
  bindGlobalViewLinks();
}

function bindControlCards(){
  $$('[data-control]').forEach(el=>{
    const open=()=>openControl(el.dataset.control);
    el.addEventListener('click',open);
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  });
}
function bindOpenButtons(){ $$('[data-open-control]').forEach(b=>b.addEventListener('click',()=>openControl(b.dataset.openControl))); }
function bindGlobalViewLinks(){ $$('[data-view-link]').forEach(b=>b.addEventListener('click',()=>{currentView=b.dataset.viewLink;render();})); bindOpenButtons(); }
