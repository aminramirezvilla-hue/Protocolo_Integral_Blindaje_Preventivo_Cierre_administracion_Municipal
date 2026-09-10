function selectOptions(options,current){ return options.map(x=>`<option ${x===current?'selected':''}>${esc(x)}</option>`).join(''); }
function openControl(id){
  const c=controls.find(x=>x.id===id); if(!c) return;
  activeControlId=id;
  const a=assessmentFor(id);
  $('#dlgId').textContent=id;
  $('#dlgTitle').textContent=c.requirement;
  const generalDisabled=canEditGeneral()?'':'disabled';
  const oicDisabled=canEditOic()?'':'disabled';
  $('#dialogBody').innerHTML=`
    <div class="detail-block"><strong>Fundamento validado</strong><p>${esc(c.foundationValidated)}</p></div>
    <div class="detail-block"><strong>Criterio de validación</strong><p>${esc(c.validationCriteria)}</p></div>
    <div class="detail-block"><strong>Evidencia mínima</strong><p>${esc(c.evidenceMinimum)}</p></div>
    <div class="field-grid"><label class="field">Estatus diagnóstico<select id="dlgStatus" ${generalDisabled}>${selectOptions(STATUS_OPTIONS,a.status)}</select></label><label class="field">Estatus evidencia<select id="dlgEvidenceStatus" ${generalDisabled}>${selectOptions(EVIDENCE_OPTIONS,a.evidenceStatus)}</select></label></div>
    <label class="field">Escenario detectado<select id="dlgScenario" ${generalDisabled}>${selectOptions(SCENARIOS,a.scenario)}</select></label>
    <label class="field">Ruta de tratamiento<select id="dlgRoute" ${generalDisabled}>${selectOptions(ROUTES,a.route)}</select></label>
    <div class="field-grid"><label class="field">Responsable de solventación<input id="dlgResponsible" ${generalDisabled} value="${esc(a.responsible||c.responsibleBase)}"></label><label class="field">Fecha compromiso<input id="dlgDue" ${generalDisabled} type="date" value="${esc(a.dueDate||'')}"></label></div>
    <div class="field-grid"><label class="field">Avance de acción (0–100)<input id="dlgProgress" ${generalDisabled} type="number" min="0" max="100" value="${Number(a.progress)||0}"></label><label class="field">Riesgo residual<select id="dlgResidualRisk" ${generalDisabled}>${[1,2,3,4].map(r=>`<option value="${r}" ${Number(a.residualRisk)===r?'selected':''}>${r} — ${riskLabel(r)}</option>`).join('')}</select></label></div>
    <label class="field">Enlace principal al expediente<input id="dlgEvidenceLink" ${generalDisabled} type="url" value="${esc(a.evidenceLink||'')}" placeholder="Drive / OneDrive"></label>
    <label class="field">Observaciones<textarea id="dlgNotes" ${generalDisabled}>${esc(a.notes||'')}</textarea></label>
    <label class="field">Validación OIC<select id="dlgOic" ${oicDisabled}>${selectOptions(OIC_OPTIONS,a.oicValidation)}</select><span class="hint">Sólo el perfil Revisor/OIC modifica este campo en el piloto.</span></label>
    <div class="control-footer"><button type="button" id="addEvidenceFromControl" class="secondary-btn">+ Evidencia / foto</button>${a.evidenceLink?`<a class="secondary-btn" href="${esc(a.evidenceLink)}" target="_blank" rel="noopener">Abrir expediente</a>`:''}</div>
    <p class="hint">Hito ${esc(c.milestone)} · riesgo base ${c.baseRisk}. ${c.id==='R086'?'Este control mantiene la alerta normativa hasta quedar Conforme + evidencia completa verificada + Validación OIC.':''}</p>`;
  $('#saveControlBtn').disabled=!(canEditGeneral()||canEditOic());
  $('#addEvidenceFromControl').addEventListener('click',()=>openEvidence(id));
  $('#controlDialog').showModal();
}

async function saveActiveControl(){
  const id=activeControlId; const c=controls.find(x=>x.id===id); if(!c) return;
  const prev=assessmentFor(id);
  const a={...prev};
  if(canEditGeneral()){
    a.status=$('#dlgStatus').value;
    a.evidenceStatus=$('#dlgEvidenceStatus').value;
    a.scenario=$('#dlgScenario').value;
    a.route=$('#dlgRoute').value;
    a.responsible=$('#dlgResponsible').value.trim();
    a.dueDate=$('#dlgDue').value;
    a.progress=Math.max(0,Math.min(100,Number($('#dlgProgress').value)||0));
    a.residualRisk=Number($('#dlgResidualRisk').value)||c.baseRisk;
    a.evidenceLink=$('#dlgEvidenceLink').value.trim();
    a.notes=$('#dlgNotes').value.trim();
    a.evaluator=currentUser().name;
    a.evaluatedAt=nowIso();
  }
  if(canEditOic()) a.oicValidation=$('#dlgOic').value;
  a.updatedAt=nowIso();
  if(a.status==='Conforme'&&a.evidenceStatus==='Completa verificada'&&a.oicValidation==='Validado') a.closedAt=a.closedAt||nowIso();
  else a.closedAt='';
  state.assessments[id]=a;
  await saveState({action:'update-control',controlId:id,summary:`${a.status} / ${a.evidenceStatus}`});
  $('#controlDialog').close();
  toast(`${id} actualizado`);
  render();
}

function openEvidence(controlId){
  $('#evControlId').value=controlId;
  $('#evDescription').value=''; $('#evLink').value=''; $('#evPhoto').value='';
  $('#evidenceDialog').showModal();
}
async function compressImage(file){
  if(!file) return null;
  const img=await createImageBitmap(file);
  const max=1024; const ratio=Math.min(1,max/Math.max(img.width,img.height));
  const canvas=document.createElement('canvas'); canvas.width=Math.round(img.width*ratio); canvas.height=Math.round(img.height*ratio);
  canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
  return canvas.toDataURL('image/jpeg',0.68);
}
async function saveEvidence(){
  const controlId=$('#evControlId').value;
  const description=$('#evDescription').value.trim();
  if(!description){toast('Describe la evidencia');return;}
  const file=$('#evPhoto').files[0];
  let photoData=null;
  if(file){
    if(file.size>15*1024*1024){toast('La fotografía excede 15 MB');return;}
    try{photoData=await compressImage(file);}catch(e){console.error(e);toast('No fue posible procesar la fotografía');return;}
  }
  const ev={id:uid('ev'),controlId,description,link:$('#evLink').value.trim(),photoData,createdAt:nowIso(),userName:currentUser().name};
  state.evidence.unshift(ev);
  const a=assessmentFor(controlId);
  if(ev.link && !a.evidenceLink) a.evidenceLink=ev.link;
  state.assessments[controlId]=a;
  await saveState({action:'add-evidence',controlId,summary:description});
  $('#evidenceDialog').close(); $('#controlDialog').close();
  toast('Evidencia registrada'); render();
}

function bindMore(){
  $$('[data-switch-user]').forEach(b=>b.addEventListener('click',async()=>{state.currentUserId=b.dataset.switchUser;await saveState({action:'switch-profile',summary:currentUser().name});toast('Perfil activo cambiado');render();}));
  $('#saveWorkspace').addEventListener('click',async()=>{
    if(!canEditWorkspace()) return;
    state.workspace.municipality=$('#setMunicipality').value.trim()||'Municipio piloto';
    state.workspace.outgoingPeriod=$('#setOutgoing').value.trim(); state.workspace.incomingPeriod=$('#setIncoming').value.trim(); state.workspace.notes=$('#setNotes').value.trim();
    await saveState({action:'update-workspace',summary:state.workspace.municipality}); toast('Espacio actualizado'); render();
  });
  $('#addUserBtn').addEventListener('click',async()=>{
    if(state.users.length>=MAX_LOCAL_USERS){toast('Máximo local de 25 perfiles');return;}
    const name=$('#newUserName').value.trim(); if(!name){toast('Captura nombre o función');return;}
    state.users.push({id:uid('u'),name,role:$('#newUserRole').value,area:$('#newUserArea').value});
    await saveState({action:'add-profile',summary:name}); toast('Perfil agregado'); render();
  });
  $('#csvBtn').addEventListener('click',exportCSV); $('#xlsBtn').addEventListener('click',exportExcel); $('#jsonBtn').addEventListener('click',exportJSON);
  $('#importJson').addEventListener('change',importJSON);
  $('#installHelp').addEventListener('click',showInstallHelp);
  $('#resetBtn')?.addEventListener('click',resetPilot);
}

function exportRows(){
  return controls.map(c=>{
    const a=assessmentFor(c.id); const sc=scoreControl(c,a);
    return {
      ID:c.id,'Macro módulo':c.macroModule,Módulo:c.module,Fundamento:c.foundationValidated,Requisito:c.requirement,
      Responsable:a.responsible||c.responsibleBase,Hito:c.milestone,'Riesgo base':c.baseRisk,'Riesgo residual':a.residualRisk,
      'Estatus diagnóstico':a.status,'Estatus evidencia':a.evidenceStatus,Escenario:a.scenario,Ruta:a.route,
      'Fecha compromiso':a.dueDate,'Avance %':a.progress,'Validación OIC':a.oicValidation,'Enlace expediente':a.evidenceLink,
      Observaciones:a.notes,'Puntaje control':sc.score==null?'':Math.round(sc.score*10)/10
    };
  });
}
function downloadBlob(content,type,name){
  const blob=new Blob([content],{type}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportCSV(){
  const rows=exportRows(); const headers=Object.keys(rows[0]);
  const cell=v=>`"${String(v??'').replaceAll('"','""')}"`;
  const csv='\ufeff'+headers.map(cell).join(';')+'\n'+rows.map(r=>headers.map(h=>cell(r[h])).join(';')).join('\n');
  downloadBlob(csv,'text/csv;charset=utf-8',`CATU_ER_${safeName(state.workspace.municipality)}.csv`); toast('CSV generado');
}
function exportExcel(){
  const rows=exportRows(); const headers=Object.keys(rows[0]);
  const html=`<html><head><meta charset="utf-8"></head><body><table border="1"><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr>${rows.map(r=>`<tr>${headers.map(h=>`<td>${esc(r[h])}</td>`).join('')}</tr>`).join('')}</table></body></html>`;
  downloadBlob('\ufeff'+html,'application/vnd.ms-excel',`CATU_ER_${safeName(state.workspace.municipality)}.xls`); toast('Excel compatible generado');
}
function exportJSON(){
  const copy=structuredClone(state);
  downloadBlob(JSON.stringify(copy,null,2),'application/json',`CATU_ER_backup_${safeName(state.workspace.municipality)}.json`); toast('Respaldo JSON generado');
}
async function importJSON(e){
  const file=e.target.files[0]; if(!file) return;
  try{
    const incoming=JSON.parse(await file.text());
    if(!incoming.workspace || !incoming.assessments) throw new Error('Formato no reconocido');
    if(!confirm('Esto sustituirá el estado local actual. ¿Continuar?')) return;
    state=incoming; await saveState({action:'import-backup',summary:file.name}); toast('Respaldo importado'); render();
  }catch(err){toast(`Error al importar: ${err.message}`);} finally{e.target.value='';}
}
function safeName(s){ return String(s||'municipio').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'_').replace(/^_+|_+$/g,''); }
async function resetPilot(){
  if(!confirm('Se eliminará el diagnóstico local y las fotografías del piloto en este dispositivo. ¿Continuar?')) return;
  state=newState(); await saveState(); toast('Piloto reiniciado'); currentView='home'; render();
}
function showInstallHelp(){
  alert('Instalación:\n\nAndroid/Chrome: menú del navegador → Instalar aplicación.\n\niPhone/iPad/Safari: botón Compartir → Añadir a pantalla de inicio.\n\nDespués de la primera carga, el modo piloto funciona parcialmente sin conexión.');
}
function toast(text){
  const host=$('#toastHost'); const t=document.createElement('div'); t.className='toast'; t.textContent=text; host.appendChild(t); setTimeout(()=>t.remove(),3000);
}

function updateNetwork(){
  const b=$('#netBadge');
  if(navigator.onLine){b.textContent='En línea';b.classList.remove('offline');}
  else{b.textContent='Sin conexión';b.classList.add('offline');}
}
function initInstall(){
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;$('#installBtn').classList.remove('hidden');});
  $('#installBtn').addEventListener('click',async()=>{if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;$('#installBtn').classList.add('hidden');});
}
async function init(){
  try{
    await loadData();
    if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(console.error);
    $$('.nav-btn').forEach(b=>b.addEventListener('click',()=>{currentView=b.dataset.view;render();window.scrollTo({top:0,behavior:'smooth'});}));
    $('#saveControlBtn').addEventListener('click',saveActiveControl);
    $('#saveEvidenceBtn').addEventListener('click',saveEvidence);
    window.addEventListener('online',()=>{updateNetwork();toast('Conexión restablecida');});
    window.addEventListener('offline',()=>{updateNetwork();toast('Modo sin conexión');});
    updateNetwork(); initInstall(); render();
  }catch(err){
    console.error(err); $('#app').innerHTML=`<div class="empty-card"><strong>No fue posible iniciar CATU E-R.</strong><p>${esc(err.message)}</p><p>Comprueba que el sitio se abra desde un servidor HTTPS/localhost y que estén disponibles los archivos de baseline en <code>data/runtime/</code>.</p></div>`;
  }
}

document.addEventListener('DOMContentLoaded',init);
