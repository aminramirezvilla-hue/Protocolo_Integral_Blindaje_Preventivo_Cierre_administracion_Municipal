'use strict';

// P5-TZ-001 — auditable timezone handling for dev/v0.1.4.
// Keep UTC as the canonical machine timestamp and derive a civil local datetime
// using the workspace timezone. This avoids the UTC-date rollover previously
// visible in follow-up notes and evidence cards after evening operations.
const P5_DEV8_VERSION = '0.1.4-dev.8';
const P5_DEV8_DEFAULT_TIME_ZONE = 'America/Mexico_City';

function p5Dev8TimeZone(){
  return state?.workspace?.timeZone || P5_DEV8_DEFAULT_TIME_ZONE;
}

function p5Dev8Date(value){
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function p5Dev8LocalDateTime(value,timeZone=p5Dev8TimeZone()){
  const d = p5Dev8Date(value);
  if(!d) return '';
  try{
    const parts = new Intl.DateTimeFormat('en-CA',{
      timeZone,
      year:'numeric',month:'2-digit',day:'2-digit',
      hour:'2-digit',minute:'2-digit',second:'2-digit',
      hourCycle:'h23'
    }).formatToParts(d).reduce((acc,p)=>{ if(p.type!=='literal') acc[p.type]=p.value; return acc; },{});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
  }catch(err){
    console.warn('P5-TZ-001: timezone fallback',err);
    return d.toISOString().replace('Z','');
  }
}

function p5Dev8FmtDateTime(value,timeZone=p5Dev8TimeZone()){
  const d = p5Dev8Date(value);
  if(!d) return '—';
  try{
    return new Intl.DateTimeFormat('es-MX',{
      timeZone,
      day:'2-digit',month:'short',year:'numeric',
      hour:'2-digit',minute:'2-digit',hourCycle:'h23'
    }).format(d);
  }catch(err){
    return d.toLocaleString('es-MX');
  }
}

function p5Dev8Envelope(value){
  const d = p5Dev8Date(value) || new Date();
  const timestampUTC = d.toISOString();
  const timeZone = p5Dev8TimeZone();
  return {
    timestampUTC,
    timeZone,
    localDateTime:p5Dev8LocalDateTime(timestampUTC,timeZone)
  };
}

function p5Dev8EnrichRecord(record,sourceField){
  if(!record) return record;
  const source = record.timestampUTC || record[sourceField] || nowIso();
  const envelope = p5Dev8Envelope(source);
  record.timestampUTC ||= envelope.timestampUTC;
  record.timeZone ||= envelope.timeZone;
  record.localDateTime ||= envelope.localDateTime;
  return record;
}

function p5Dev8MigrateState(){
  if(!state) return;
  state.workspace ||= {};
  state.workspace.timeZone ||= P5_DEV8_DEFAULT_TIME_ZONE;
  state.workspace.runtimeVersion = P5_DEV8_VERSION;
  state.workspace.temporalModel = 'UTC-canonical+workspace-timezone+civil-local-datetime';
  state.version = P5_DEV8_VERSION;

  (state.auditLog || []).forEach(x=>p5Dev8EnrichRecord(x,'at'));
  (state.evidence || []).forEach(x=>p5Dev8EnrichRecord(x,'createdAt'));
  Object.values(state.assessments || {}).forEach(a=>{
    (a.followUpLog || []).forEach(x=>p5Dev8EnrichRecord(x,'at'));
    if(a.evaluatedAt){
      const e=p5Dev8Envelope(a.evaluatedAt);
      a.evaluatedTimeZone ||= e.timeZone;
      a.evaluatedLocalDateTime ||= e.localDateTime;
    }
    if(a.updatedAt){
      const e=p5Dev8Envelope(a.updatedAt);
      a.updatedTimeZone ||= e.timeZone;
      a.updatedLocalDateTime ||= e.localDateTime;
    }
    if(a.oicInvalidatedAt){
      const e=p5Dev8Envelope(a.oicInvalidatedAt);
      a.oicInvalidatedTimeZone ||= e.timeZone;
      a.oicInvalidatedLocalDateTime ||= e.localDateTime;
    }
  });
}

// Follow-up history: format the original UTC instant in the configured municipal timezone.
// Do not slice YYYY-MM-DD from UTC before conversion.
p5Dev7FollowUpHistory = function(a){
  const rows = Array.isArray(a?.followUpLog) ? a.followUpLog.slice(-5).reverse() : [];
  if(!rows.length) return '<p class="hint" style="margin:6px 0 0">Sin notas de seguimiento registradas.</p>';
  return `<div class="detail-block" style="margin-top:8px"><strong>Últimas notas de seguimiento</strong>${rows.map(x=>`<p style="margin:6px 0"><span class="hint">${esc(p5Dev8FmtDateTime(x.timestampUTC||x.at,x.timeZone||p5Dev8TimeZone()))} · ${esc(x.user||'Sistema')}</span><br>${esc(x.text||'')}</p>`).join('')}</div>`;
};

const p5Dev8BaseAppendFollowUp = p5Dev7AppendFollowUp;
p5Dev7AppendFollowUp = function(id,text){
  const entry = p5Dev8BaseAppendFollowUp(id,text);
  p5Dev8EnrichRecord(entry,'at');
  return entry;
};

const p5Dev8BaseSaveState = saveState;
saveState = async function(logEntry){
  await p5Dev8BaseSaveState(logEntry);
  p5Dev8MigrateState();
  if(logEntry && state.auditLog?.length) p5Dev8EnrichRecord(state.auditLog[0],'at');
  await idbSet(STATE_KEY,state);
};

const p5Dev8BaseSaveEvidence = saveEvidence;
saveEvidence = async function(){
  const controlId = document.getElementById('evControlId')?.value || '';
  const beforeIds = new Set((state.evidence||[]).map(x=>x.id));
  const result = await p5Dev8BaseSaveEvidence();
  const added = (state.evidence||[]).find(x=>x.controlId===controlId && !beforeIds.has(x.id));
  if(added){
    p5Dev8EnrichRecord(added,'createdAt');
    await idbSet(STATE_KEY,state);
  }
  return result;
};

const p5Dev8BaseSaveActiveControl = saveActiveControl;
saveActiveControl = async function(){
  const id = activeControlId;
  const result = await p5Dev8BaseSaveActiveControl();
  if(id && state.assessments?.[id]){
    const a = state.assessments[id];
    if(a.evaluatedAt){
      const e=p5Dev8Envelope(a.evaluatedAt);
      a.evaluatedTimeZone=e.timeZone;
      a.evaluatedLocalDateTime=e.localDateTime;
    }
    if(a.updatedAt){
      const e=p5Dev8Envelope(a.updatedAt);
      a.updatedTimeZone=e.timeZone;
      a.updatedLocalDateTime=e.localDateTime;
    }
    await idbSet(STATE_KEY,state);
  }
  return result;
};

const p5Dev8BaseRenderEvidence = renderEvidence;
renderEvidence = function(){
  const ev=[...state.evidence].sort((a,b)=>String(b.timestampUTC||b.createdAt).localeCompare(String(a.timestampUTC||a.createdAt)));
  $('#app').innerHTML=`${pageHead('Evidencia','La PWA conserva metadatos, vínculos y fotografías locales puntuales. El expediente oficial permanece en Drive/OneDrive.')}
    <div class="evidence-list">${ev.length?ev.map(e=>`<article class="evidence-card"><div class="evidence-top"><div><span class="control-id">${esc(e.controlId)}</span><h3>${esc(e.description)}</h3><div class="meta">${esc(p5Dev8FmtDateTime(e.timestampUTC||e.createdAt,e.timeZone||p5Dev8TimeZone()))} · ${esc(e.userName||'')}</div></div>${e.photoData?`<img class="photo-thumb" src="${e.photoData}" alt="Fotografía de evidencia">`:''}</div><div class="control-footer">${e.link?`<a class="secondary-btn" href="${esc(e.link)}" target="_blank" rel="noopener">Abrir expediente</a>`:''}<button class="secondary-btn" data-open-control="${esc(e.controlId)}">Ver control</button></div></article>`).join(''):`<div class="empty-card">Aún no se han registrado evidencias de campo.</div>`}</div>`;
  bindOpenButtons();
};

const p5Dev8BaseLoadData = loadData;
loadData = async function(){
  await p5Dev8BaseLoadData();
  p5Dev8MigrateState();
  await idbSet(STATE_KEY,state);
};

const p5Dev8BaseRenderMore = renderMore;
renderMore = function(){
  p5Dev8BaseRenderMore();
  const badge = document.getElementById('p4VersionBadge');
  if(badge) badge.textContent = P5_DEV8_VERSION;
  const continuity = document.getElementById('p4ContinuityPanel');
  if(continuity){
    continuity.innerHTML = `<strong>P5-TZ-001 · trazabilidad temporal</strong><p style="margin:6px 0">Versión ${P5_DEV8_VERSION}. Cada evento auditable conserva UTC como sello canónico y la fecha/hora civil se deriva con la zona <code>${esc(p5Dev8TimeZone())}</code>. Se elimina el desfase de día producido por recortar fechas UTC antes de mostrarlas.</p>`;
  }
};
