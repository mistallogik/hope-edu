import { modules, flows, complete, stageName, severity } from './domain.js';

export const moduleTitles = {
  program: 'Program Intelligence', schools: 'School Operations', teachers: 'Teacher Development',
  energy: 'Energy & Infrastructure', essence: 'Essence Teacher Centre', community: 'Community Learning',
};
export const figmaAssets = {
  logo: 'c1efe.svg', avatar: 'b8b74.png', school: '9dce9.svg', chevronDown: 'f7dbb.svg',
  overview: '14722.svg', chevron: '76fb8.svg', schoolNav: 'b3d2b.svg', asset: '10395.svg',
  tools: 'e5518.svg', stack: '83f35.svg', settings: '01c46.svg', evidence: '7398f.svg',
  guide: 'c938e.svg', verified: 'c2dea.svg', profileChevron: '0cc3e.svg', search: 'd2ad1.svg',
  searchButton: 'f1295.svg', notifications: '48bc8.svg', calendar: 'fd628.svg',
  assetMetric: 'ccbaf.svg', schoolMetric: 'b785d.svg', toolsMetric: '41cef.svg',
  serviceMetric: '9812d.svg', report: 'b059e.svg', reportChevron: '58ced.svg', assetChevron: '3c7bc.svg',
};
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function dsIcon(name, className = '') {
  // Keep exported SVG intrinsic dimensions; wrapper styles control their layout slot.
  return `<img class="ds-icon ${className}" src="/public/figma-overview/${figmaAssets[name]}" alt="">`;
}
export const navIcons = { Overview:'overview', Schools:'schoolNav', 'Asset registry':'asset', 'Work orders':'tools', 'Grants & projects':'stack', 'State scorecards':'schoolNav', 'DLR readiness':'evidence', Actions:'tools', 'Teacher profiles':'schoolNav', 'Courses & guides':'stack', 'Mentor observations':'tools', 'Learning outcomes':'evidence', 'Site selection':'schoolNav', 'Energy passports':'evidence', 'Installation options':'stack', Construction:'tools', Monitoring:'settings', 'Training hub':'schoolNav', 'Cohorts & schedule':'calendar', Practicum:'tools', 'Completion & follow-up':'evidence', 'Community centres':'schoolNav', 'Referral & enrollment':'evidence', 'Attendance & materials':'stack', 'Progress & transition':'tools' };
export const moduleIcons = { program:'overview', schools:'school', teachers:'school', energy:'serviceMetric', essence:'school', community:'school' };

export function overviewModel(state, module, scope = 'All states') {
  const inScope = x => scope === 'All states' || x.state === scope;
  const schools = state.schools.filter(inScope);
  const schoolIds = new Set(schools.map(s => s.id));
  const assets = state.assets.filter(a => schoolIds.has(a.schoolId));
  const records = state.records.filter(r => r.module === module && inScope(r));
  const workOrders = state.records.filter(r => r.module === 'schools' && inScope(r));
  const operational = assets.filter(a => a.condition === 'Operational').length;
  const failed = assets.filter(a => a.condition === 'Failed').length;
  const affected = assets.filter(a => a.condition !== 'Operational').sort((a,b) => (a.condition === 'Failed' ? 0 : 1) - (b.condition === 'Failed' ? 0 : 1));
  const finished = records.filter(complete).length;
  const schoolReadiness = s => {
    const a = assets.filter(a => a.schoolId === s.id);
    return a.length ? Math.round(a.filter(a => a.condition === 'Operational').length / a.length * 100) : null;
  };
  let metrics;
  if (module === 'schools' || module === 'energy') {
    metrics = [
      {label:'Operational assets',value:assets.length ? `${Math.round(operational/assets.length*100)}%` : '—',context:`${operational}/${assets.length}`,description:`${operational} of ${assets.length} assets operational`,icon:'assetMetric'},
      {label:'Schools in scope',value:schools.length,context:`${new Set(schools.map(s=>s.state)).size} states`,description:'Demonstration schools in this location scope',icon:'schoolMetric'},
      {label:module==='energy'?'Installation projects':'Work orders',value:module==='energy'?records.length:workOrders.length,context:`${(module==='energy'?records:workOrders).filter(complete).length} closed`,description:'Completed and active work in this scope',icon:'toolsMetric'},
      {label:'Service interruptions',value:failed,context:failed?'Action needed':'Clear',description:'Assets marked failed in this scope',icon:'serviceMetric'},
    ];
  } else if (module === 'program') {
    metrics = [
      {label:'Evidence readiness',value:records.length?`${Math.round(finished/records.length*100)}%`:'—',context:`${finished}/${records.length}`,description:'Validated illustrative DLRs / all scoped DLRs',icon:'assetMetric'},
      {label:'Schools in scope',value:schools.length,context:'Demo',description:'Connected synthetic school profiles',icon:'schoolMetric'},
      {label:'Results tracked',value:records.length,context:'8 pillars',description:'Illustrative DLI and DLR definitions',icon:'toolsMetric'},
      {label:'Reporting gaps',value:records.filter(r=>!complete(r)).length,context:'Open',description:'Results that still require validation',icon:'serviceMetric'},
    ];
  } else {
    const people = module==='teachers'?state.teachers.filter(inScope).length:records.length;
    metrics = [
      {label:module==='teachers'?'Teachers in scope':module==='essence'?'Training cohorts':'Learning referrals',value:people,context:'Demo',description:'Synthetic records in the selected state',icon:'schoolMetric'},
      {label:'Completed journeys',value:finished,context:`${records.length-finished} open`,description:'Verified workflow completion',icon:'assetMetric'},
      {label:'Evidence records',value:records.reduce((n,r)=>n+r.evidence.length,0),context:'Saved',description:'Supporting evidence retained in this browser',icon:'toolsMetric'},
      {label:'Follow-up plans',value:records.filter(r=>r.fields.due).length,context:'Recorded',description:'Recorded follow-up dates and plans',icon:'serviceMetric'},
    ];
  }
  return {schools,assets,records,workOrders,affected,metrics,schoolReadiness};
}

const reports = {
  schools: [
    ['readiness','Asset Readiness Summary','School infrastructure, asset condition and service readiness.'],
    ['maintenance','Maintenance Performance','Work order progress, repair evidence and verified closure.'],
    ['critical','Priority Asset Register','School assets needing attention and their linked work orders.'],
  ],
  program: [
    ['readiness','Program Readiness Summary','DLI pillars, reporting gaps and evidence validation.'],
    ['maintenance','Corrective Action Register','Responsible roles, deadlines and current workflow stages.'],
    ['critical','Outstanding Evidence','Results awaiting validation and their supporting evidence.'],
  ],
  teachers: [['readiness','Teacher Development Summary','Training, observations and follow-up progress.'],['maintenance','Coaching Action Register','Mentor observations, feedback and next actions.'],['critical','Learning Evidence Register','Training and classroom-practice evidence awaiting review.']],
  energy: [['readiness','Infrastructure Delivery Summary','Site audits, installation stages and commissioning.'],['maintenance','Service & Maintenance','Linked school assets and operational maintenance.'],['critical','Priority Asset Register','Energy and school assets requiring service attention.']],
  essence: [['readiness','Cohort Completion Summary','Attendance, practicum and cohort completion.'],['maintenance','Practicum & Follow-up','Mentor assessments and classroom follow-up plans.'],['critical','Incomplete Cohorts','Training cohorts with remaining delivery requirements.']],
  community: [['readiness','Community Learning Summary','Coded enrollment, delivery and validated transitions.'],['maintenance','Delivery & Follow-up','Attendance, learning materials and progression plans.'],['critical','Progression Evidence','Learning referrals still awaiting transition validation.']],
};
export function reportData(state,module,scope,key) {
  const model=overviewModel(state,module,scope);
  const definition=reports[module].find(r=>r[0]===key) || reports[module][0];
  let columns,rows;
  if((module==='schools'||module==='energy')&&key!=='maintenance') {
    columns=['Asset ID','Asset','School','State','Condition','Open work order'];
    rows=(key==='critical'?model.affected:model.assets).map(a=>[a.id,a.name,state.schools.find(s=>s.id===a.schoolId)?.name||a.schoolId,a.state,a.condition,model.workOrders.find(r=>r.assetId===a.id&&!complete(r))?.id||'None']);
  } else {
    const records=(module==='schools'||module==='energy')&&key==='maintenance'?model.workOrders:model.records;
    columns=['Record ID','Title','State','Stage','Responsible role','Evidence count'];
    rows=records.filter(r=>key!=='critical'||!complete(r)).map(r=>[r.id,r.title,r.state,stageName(r),flows[r.module].steps[r.stage]?.role||'Complete',r.evidence.length]);
  }
  return {title:definition[1],description:definition[2],columns,rows,scope};
}

function kpi(metric) {
  return `<article class="ds-kpi" title="${escapeHTML(metric.description)}"><span class="ds-key-icon">${dsIcon(metric.icon)}</span><div><h2>${metric.label}</h2><div class="ds-kpi-value"><strong>${metric.value}</strong><span class="ds-context-badge">${metric.context}</span></div></div></article>`;
}

// These are intentionally illustrative demonstration placements, not school geodata.
const schoolPositions=[[7,10],[7.9,9.5],[7.7,10.8],[6.8,11.2],[8.8,12.7],[9.8,12.1],[10.6,11.7],[8.5,11.6],[3.8,7.5],[4.3,8.5],[4.6,7.2],[5.3,8.7]];
const project=([lon,lat])=>[48+(lon-2.5)*57,540-(lat-4)*49];
function regionPath(feature) {
  const rings=feature.geometry.type==='MultiPolygon'?feature.geometry.coordinates.flat():feature.geometry.coordinates;
  return rings.map(r=>r.map((point,i)=>`${i?'L':'M'}${project(point).map(v=>v.toFixed(1)).join(',')}`).join(' ')+' Z').join(' ');
}
function readinessMap(model,geometry,selection,zoom,ui,revised=false) {
  const selected=model.schools.find(s=>s.id===selection);
  const pins=model.schools.map(s=>{
    const index=Number(s.id.slice(-3))-1,[x,y]=project(schoolPositions[index%schoolPositions.length]);
    const value=model.schoolReadiness(s),tone=value===null?'unknown':value<70?'critical':value<90?'warning':'healthy';
    return `<g class="readiness-pin ${tone} ${selection===s.id?'selected':''}" data-action="map-school" data-id="${s.id}" tabindex="0" role="button" aria-label="${escapeHTML(s.name)}, ${s.state}, ${value??'no'} percent operational" transform="translate(${x},${y})"><title>${escapeHTML(s.name)} · ${s.state}</title><circle class="pin-halo" r="21"/><circle class="pin-ring" r="16"/><text text-anchor="middle" dominant-baseline="central">${value??'—'}</text>${value!==null&&value<70?'<circle class="pin-alert" cx="12" cy="-12" r="4"/>':''}</g>`;
  }).join('');
  const mapBody=`<svg class="readiness-map-svg" viewBox="0 0 760 580" aria-label="Illustrative Nigeria school asset readiness map"><defs><pattern id="ds-map-grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="#efefef" stroke-width="1"/></pattern><clipPath id="ds-map-clip"><rect width="760" height="580"/></clipPath></defs><rect width="760" height="580" fill="url(#ds-map-grid)"/><g clip-path="url(#ds-map-clip)"><g transform="translate(${380*(1-zoom)},${290*(1-zoom)}) scale(${zoom})">${geometry.map(f=>`<path class="map-country ${f.name==='Nigeria'?'nigeria':''}" d="${regionPath(f)}"/>`).join('')}<text class="country-label" x="65" y="300">BENIN</text><text class="country-label" x="355" y="25">NIGER</text><text class="country-label" x="630" y="455">CAMEROON</text><text class="nigeria-label" x="425" y="320">NIGERIA</text><text class="water-label" x="126" y="555">Gulf of Guinea</text>${pins}</g></g></svg>`;
  return `<section class="ds-map-panel" aria-label="School asset readiness"><div class="ds-map-toolbar">${revised?`<h2>Education across the nation</h2>${ui.link('View all locations','schools/Schools','ds-button ds-button-small')}`:`${ui.link(`${dsIcon('asset')}View assets`,'schools/Asset registry','ds-button ds-button-small')}${ui.button(`Review affected assets ${dsIcon('reportChevron')}`,'affected-assets','ds-link')}`}</div><div class="ds-map-stage">${mapBody}<div class="ds-map-controls" aria-label="Map controls">${ui.button('+','map-zoom-in','',`aria-label="Zoom in" ${zoom>=1.8?'disabled':''}`)}${ui.button('−','map-zoom-out','',`aria-label="Zoom out" ${zoom<=1?'disabled':''}`)}${ui.button('⛶','map-expand','',`aria-label="Expand map"`)}</div>${selected?`<div class="ds-map-selection"><div><strong>${escapeHTML(selected.name)}</strong><small>${selected.lga}, ${selected.state} · ${model.schoolReadiness(selected)}% operational</small></div>${ui.link('View school →',`schools/Schools/${selected.id}`,'ds-link')}${ui.button('×','map-clear','ds-clear',`aria-label="Clear school selection"`)}</div>`:''}<span class="ds-map-caption">Pin numbers show operational assets %</span></div><div class="ds-map-foot"><div><span class="legend-dot healthy"></span>90–100%<span class="legend-dot warning"></span>70–89%<span class="legend-dot critical"></span>Below 70%</div><small>Synthetic school locations · illustrative map</small></div></section>`;
}
function assetContext(a) {
  if(a.name.toLowerCase().includes('solar'))return {impact:'Classroom power and ICT availability',next:'Inspect inverter and restore school power',icon:'serviceMetric'};
  if(a.name.toLowerCase().includes('water'))return {impact:'School water and WASH provision',next:'Inspect pump and verify water supply',icon:'settings'};
  if(a.name.toLowerCase().includes('tablet'))return {impact:'Access to digital teaching materials',next:'Diagnose device and arrange repair',icon:'asset'};
  return {impact:'School connectivity and learning access',next:'Inspect network and restore connectivity',icon:'asset'};
}
function priorityAssets(model,ui) {
  return `<aside class="ds-priorities"><div class="ds-priority-heading"><div><h2>Priority school assets</h2><p>Start with the highest impact on learning</p></div><small>${Math.min(model.affected.length,3)} / ${model.affected.length}</small></div>${model.affected.slice(0,3).map(a=>{
    const s=model.schools.find(s=>s.id===a.schoolId),context=assetContext(a),work=model.workOrders.find(r=>r.assetId===a.id&&!complete(r));
    return `<article class="ds-priority-card"><div class="ds-priority-card-head"><span class="ds-asset-image">${dsIcon(context.icon)}</span><div><h3>${escapeHTML(a.name)}</h3><p>${a.id} · ${a.condition==='Failed'?'Service interrupted':'Condition degraded'}</p></div><span class="ds-status ${a.condition==='Failed'?'critical':'warning'}">${a.condition==='Failed'?'Critical':'High'}</span></div><dl><dt>Impact</dt><dd>${context.impact}</dd><dt>Next action</dt><dd>${work?escapeHTML(flows.schools.steps[work.stage]?.label):context.next}</dd></dl><div class="ds-priority-card-foot">${ui.link(`${dsIcon('schoolNav')}<span>${escapeHTML(s?.name.replace(' Demonstration School','')||'School')} <b>${s?model.schoolReadiness(s):'—'}%</b></span>`,`schools/Schools/${a.schoolId}`,'ds-location-chip')}${ui.link(`View asset ${dsIcon('reportChevron')}`,`schools/Asset registry/${a.id}`,'ds-link')}</div></article>`;
  }).join('')||'<div class="empty">All school assets in this scope are operational.</div>'}${model.affected.length>3?ui.button(`View all ${model.affected.length} affected assets →`,'affected-assets','ds-link ds-view-all'):''}</aside>`;
}
function priorityActions(model,module,ui) {
  const open=model.records.filter(r=>!complete(r)).sort((a,b)=>(severity(a)==='Critical'?0:1)-(severity(b)==='Critical'?0:1));
  return `<aside class="ds-priorities"><div class="ds-priority-heading"><div><h2>Priority actions</h2><p>Move from issue to evidence and result</p></div><small>${Math.min(open.length,3)} / ${open.length}</small></div>${open.slice(0,3).map(r=>`<article class="ds-priority-card"><div class="ds-priority-card-head"><span class="ds-asset-image">${dsIcon('evidence')}</span><div><h3>${escapeHTML(r.title)}</h3><p>${r.id} · ${escapeHTML(stageName(r))}</p></div><span class="ds-status ${severity(r)==='Critical'?'critical':'warning'}">${severity(r)}</span></div><dl><dt>Responsible</dt><dd>${flows[module].steps[r.stage]?.role}</dd><dt>Next action</dt><dd>${flows[module].steps[r.stage]?.label}</dd></dl><div class="ds-priority-card-foot"><span class="ds-location-chip">${dsIcon('schoolNav')}${r.state}</span>${ui.link(`View record ${dsIcon('reportChevron')}`,`${module}/Record/${r.id}`,'ds-link')}</div></article>`).join('')||'<div class="empty">All journeys in this scope are complete.</div>'}</aside>`;
}
export function renderOverview({state,module,scope,geometry,selection,zoom,ui}) {
  const model=overviewModel(state,module,scope);
  if(module==='schools')return renderSchoolOverview(model,geometry,selection,zoom,ui);
  const reportRows=reports[module].map(([key,title])=>`<tr><td><div class="at-file"><span class="at-file-icon" aria-hidden="true"><img class="file-body" src="/public/figma-table/823e3.svg" alt=""><img class="file-fold" src="/public/figma-table/0e159.svg" alt=""><b>CSV</b></span><strong>${title}</strong></div></td><td>November 2026</td><td><span class="at-format">CSV</span></td><td>Current demo records</td><td>${ui.button('View','overview-report','ds-button',`data-report="${key}"`)}${ui.button('<img src="/public/figma-table/d891d.svg" alt="">','overview-report-csv','ds-button',`data-report="${key}" aria-label="Download ${title} CSV"`)}</td></tr>`).join('');
  return `<div class="ds-kpis">${model.metrics.map(kpi).join('')}</div><div class="ds-overview-split">${readinessMap(model,geometry,selection,zoom,ui)}${module==='energy'?priorityAssets(model,ui):priorityActions(model,module,ui)}</div><section class="ds-reports panel"><h2>Reports & summaries</h2><div class="table-scroll"><table><thead><tr><th>Report name</th><th>Reporting period</th><th>Format</th><th>Data source</th><th>Actions</th></tr></thead><tbody>${reportRows}</tbody></table></div></section><div class="ds-provenance"><span>${modules[module].provider}</span><span>Synthetic data · Discussion concept · November 2026</span></div>`;
}


// Overview-only presentation: preserve shared records and other module screens.
export function schoolOverviewRows(model) {
  const rank={Critical:0,Warning:1,Normal:2};
  return model.workOrders.filter(r=>!complete(r)).map(record=>{
    const asset=model.assets.find(a=>a.id===record.assetId);
    const school=model.schools.find(s=>s.id===(asset?.schoolId||record.schoolId));
    const priority=asset?.condition==='Failed'?'Critical':asset?.condition==='Degraded'?'Warning':severity(record);
    return {record,asset,school,priority,stage:stageName(record),title:asset?`${asset.name} ${asset.condition==='Failed'?'failure':'maintenance'}`:record.title};
  }).sort((a,b)=>rank[a.priority]-rank[b.priority] || String(a.record.due||'9999').localeCompare(String(b.record.due||'9999')) || a.record.id.localeCompare(b.record.id));
}
function overviewBadge(text,tone) {return `<span class="ov-badge ${tone}">${escapeHTML(text)}</span>`;}
function renderSchoolOverview(model,geometry,selection,zoom,ui) {
  const rows=schoolOverviewRows(model);
  const attentionRows=[...rows,...model.affected.filter(a=>!rows.some(row=>row.asset?.id===a.id)).map(a=>({asset:a,school:model.schools.find(s=>s.id===a.schoolId),record:{id:a.id,state:a.state},priority:a.condition==='Failed'?'Critical':'Warning',stage:'No work order'}))].sort((a,b)=>({Critical:0,Warning:1,Normal:2}[a.priority]-{Critical:0,Warning:1,Normal:2}[b.priority]));
  const stateCount=new Set(model.schools.map(s=>s.state)).size;
  model.metrics[1]={...model.metrics[1],context:`${stateCount} ${stateCount===1?'state':'states'}`};
  const attention=attentionRows.slice(0,3).map(({record:r,asset:a,school:s,priority,stage})=>`<article class="ov-attention-card"><div class="ov-asset-head"><span class="ov-asset-placeholder" aria-hidden="true">${dsIcon(a?assetContext(a).icon:'asset')}</span><div class="ov-asset-copy"><div class="ov-asset-title"><h3>${escapeHTML(a?.name||r.title)}</h3>${overviewBadge(priority,priority.toLowerCase())}</div><div class="ov-asset-meta"><p>${a?.condition==='Failed'?'System failure':'Maintenance'} · ${escapeHTML(stage)}</p><span>${escapeHTML(r.id)}</span></div></div></div><div class="ov-asset-footer"><div><span>Location</span><p>${escapeHTML(s?`${s.lga}, ${s.state}`:r.state)}</p></div>${ui.link(`View asset ${dsIcon('assetChevron')}`,a?`schools/Asset registry/${a.id}`:`schools/Record/${r.id}`,'ov-asset-link')}</div></article>`).join('');
  const tableRows=rows.slice(0,3).map(({record:r,school:s,priority,stage,title})=>`<tr><td><strong>${escapeHTML(title)}</strong><small>${escapeHTML(r.id)}</small></td><td>${escapeHTML(s?.state||r.state)}</td><td>${overviewBadge(stage,'stage')}</td><td>${overviewBadge(priority,priority.toLowerCase())}</td><td>${ui.link(`Open ${dsIcon('reportChevron')}`,`schools/Record/${r.id}`,'ds-button ov-open')}</td></tr>`).join('');
  return `<div class="ds-kpis">${model.metrics.map(kpi).join('')}</div><div class="ds-overview-split">${readinessMap(model,geometry,selection,zoom,ui,true)}<section class="ov-attention"><div class="ov-panel-heading"><h2>Where attention matters</h2>${ui.link('View all','schools/Asset registry','ds-button ds-button-small')}</div><div class="ov-attention-list">${attention||'<p class="ov-empty">No assets or work orders need attention in this state.</p>'}</div></section></div><section class="ov-next-steps panel"><div class="ov-panel-heading"><h2>Your next steps</h2>${ui.link('View all','schools/Work orders','ds-button ds-button-small')}</div><div class="ov-table-scroll"><table><thead><tr>${['Record','State','Workflow stage','Priority','Actions'].map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${tableRows||'<tr><td colspan="5" class="ov-empty">No outstanding work orders. Choose another state to review its work.</td></tr>'}</tbody></table></div></section><div class="ds-provenance"><span>Software by Hsry</span><span>Synthetic demonstration data · November 2026</span></div>`;
}
