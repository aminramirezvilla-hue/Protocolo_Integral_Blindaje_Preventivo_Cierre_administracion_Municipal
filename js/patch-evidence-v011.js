'use strict';

// Hotfix v0.1.1 — evidencia: evita doble guardado durante compresión/asíncrono
// y permite retirar duplicados ya creados durante el piloto.
let evidenceSaveInFlight = false;

function canManageEvidence(){
  return ['admin','coordinator','catu'].includes(currentUser().role);
}

function evidenceFingerprint(e){
  const p = e.photoData || '';
  return [e.controlId||'', String(e.description||'').trim(), String(e.link||'').trim(), p.length, p.slice(0,160)].join('|');
}

async function saveEvidence(){
  if(evidenceSaveInFlight){
    toast('Guardado de evidencia en curso…');
    return;
  }
  const controlId=$('#evControlId').value;
  const description=$('#evDescription').value.trim();
  if(!description){toast('Describe la evidencia');return;}

  const btn=$('#saveEvidenceBtn');
  evidenceSaveInFlight=true;
  if(btn){ btn.disabled=true; btn.textContent='Guardando…'; }

  try{
    const file=$('#evPhoto').files[0];
    let photoData=null;
    if(file){
      if(file.size>15*1024*1024){toast('La fotografía excede 15 MB');return;}
      try{photoData=await compressImage(file);}catch(e){console.error(e);toast('No fue posible procesar la fotografía');return;}
    }

    const candidate={
      controlId,
      description,
      link:$('#evLink').value.trim(),
      photoData
    };
    const fp=evidenceFingerprint(candidate);
    const recentDuplicate=(state.evidence||[]).some(e=>{
      if(evidenceFingerprint(e)!==fp) return false;
      const age=Math.abs(Date.now()-Date.parse(e.createdAt||0));
      return Number.isFinite(age) && age < 5*60*1000;
    });
    if(recentDuplicate){
      toast('Evidencia duplicada detectada; no se guardó otra copia');
      return;
    }

    const ev={id:uid('ev'),...candidate,createdAt:nowIso(),userName:currentUser().name};
    state.evidence.unshift(ev);
    const a=assessmentFor(controlId);
    if(ev.link && !a.evidenceLink) a.evidenceLink=ev.link;
    state.assessments[controlId]=a;
    await saveState({action:'add-evidence',controlId,summary:description});
    $('#evidenceDialog').close();
    if($('#controlDialog')?.open) $('#controlDialog').close();
    toast('Evidencia registrada');
    render();
  } finally {
    evidenceSaveInFlight=false;
    if(btn){ btn.disabled=false; btn.textContent='Guardar evidencia'; }
  }
}

async function deleteEvidence(id){
  if(!canManageEvidence()){
    toast('Este perfil no puede eliminar evidencias del piloto');
    return;
  }
  const ev=(state.evidence||[]).find(x=>x.id===id);
  if(!ev) return;
  if(!confirm(`¿Eliminar esta evidencia local de ${ev.controlId}?\n\nNo se eliminará ningún archivo de Drive/OneDrive.`)) return;
  state.evidence=state.evidence.filter(x=>x.id!==id);
  await saveState({action:'delete-evidence',controlId:ev.controlId,summary:ev.description});
  toast('Evidencia local eliminada');
  render();
}

async function dedupeEvidence(){
  if(!canManageEvidence()){
    toast('Este perfil no puede depurar evidencias');
    return;
  }
  const seen=new Set();
  const keep=[];
  let removed=0;
  for(const e of (state.evidence||[])){
    const fp=evidenceFingerprint(e);
    if(seen.has(fp)) removed++;
    else { seen.add(fp); keep.push(e); }
  }
  if(!removed){ toast('No se detectaron duplicados exactos'); return; }
  if(!confirm(`Se detectaron ${removed} evidencia(s) duplicada(s) exacta(s). ¿Conservar una copia de cada una y retirar las demás?`)) return;
  state.evidence=keep;
  await saveState({action:'dedupe-evidence',summary:`${removed} duplicado(s) retirado(s)`});
  toast(`${removed} duplicado(s) retirado(s)`);
  render();
}

function renderEvidence(){
  const ev=[...(state.evidence||[])].sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
  const manage=canManageEvidence();
  const action=manage && ev.length>1 ? '<button id="dedupeEvidenceBtn" class="secondary-btn">Depurar duplicados</button>' : '';
  $('#app').innerHTML=`${pageHead('Evidencia',`La PWA conserva metadatos, vínculos y fotografías locales puntuales. El expediente oficial permanece en Drive/OneDrive. · ${ev.length} registro(s)`,action)}
    <div class="evidence-list">${ev.length?ev.map(e=>`<article class="evidence-card"><div class="evidence-top"><div><span class="control-id">${esc(e.controlId)}</span><h3>${esc(e.description)}</h3><div class="meta">${fmtDate((e.createdAt||'').slice(0,10))} · ${esc(e.userName||'')}</div></div>${e.photoData?`<img class="photo-thumb" src="${e.photoData}" alt="Fotografía de evidencia">`:''}</div><div class="control-footer">${e.link?`<a class="secondary-btn" href="${esc(e.link)}" target="_blank" rel="noopener">Abrir expediente</a>`:''}<button class="secondary-btn" data-open-control="${esc(e.controlId)}">Ver control</button>${manage?`<button class="secondary-btn" data-delete-evidence="${esc(e.id)}">Eliminar local</button>`:''}</div></article>`).join(''):`<div class="empty-card">Aún no se han registrado evidencias de campo.</div>`}</div>`;
  bindOpenButtons();
  $$('[data-delete-evidence]').forEach(b=>b.addEventListener('click',()=>deleteEvidence(b.dataset.deleteEvidence)));
  $('#dedupeEvidenceBtn')?.addEventListener('click',dedupeEvidence);
}
