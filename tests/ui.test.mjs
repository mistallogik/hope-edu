import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parseHTML} from 'linkedom';
import {indexedDB} from 'fake-indexeddb';
import {modules,flows} from '../src/domain.js';
import {openStore} from '../src/store.js';
const {window}=parseHTML(await readFile(new URL('../index.html',import.meta.url),'utf8'));
Object.assign(globalThis,{window,document:window.document,indexedDB,location:{hash:'#program/Overview',href:'http://localhost/#program/Overview'}});
window.scrollTo=()=>{};
const dialog=document.querySelector('dialog');dialog.showModal=function(){this.open=true;};dialog.close=function(){this.open=false;};
globalThis.fetch=async()=>({json:async()=>JSON.parse(await readFile(new URL('../public/nigeria.json',import.meta.url),'utf8'))});
globalThis.FormData=class{constructor(form){this.data=[...form.querySelectorAll('input,textarea,select')].filter(x=>x.name&&((x.type!=='checkbox')||x.checked)).map(x=>[x.name,x.value]);}[Symbol.iterator](){return this.data[Symbol.iterator]();}};
await import('../src/app.js');
const delay=()=>new Promise(r=>setTimeout(r,15));
function route(hash){location.hash='#'+hash;window.dispatchEvent(new window.Event('hashchange'));}
async function click(selector){const target=document.querySelector(selector);assert.ok(target,`Missing ${selector}`);target.dispatchEvent(new window.Event('click',{bubbles:true,cancelable:true}));await delay();}
function setSelect(el,value){for(const opt of el.querySelectorAll('option')){if(opt.textContent===String(value))opt.setAttribute('selected','');else opt.removeAttribute('selected');}}
test('every module view renders with a complete navigation shell',()=>{for(const [key,m] of Object.entries(modules)){for(const view of m.views){route(`${key}/${view}`);assert.ok(document.querySelector('main'));assert.equal(document.querySelectorAll('table:not([data-enhanced])').length,0);assert.ok(document.querySelector('.sidebar'));assert.ok(document.querySelector('.panel,.hub-hero'));assert.doesNotMatch(document.querySelector('#app').textContent,/undefined|NaN|could not open/);}}});
test('school, asset, teacher details and unknown records render safely',()=>{for(const path of ['schools/Schools/SCH-001','schools/Asset registry/AST-001','teachers/Teacher profiles/TCH-001']){route(path);assert.ok(document.querySelector('.record-banner'));}route('schools/Asset registry/invalid');assert.match(document.querySelector('main').textContent,/Record not found/);});
test('all six journeys submit through UI handlers and persist',async()=>{for(const [key,m] of Object.entries(modules)){route(`${key}/Record/${m.journey}`);for(const step of flows[key].steps){if(document.querySelector('[data-action="use-role"]'))await click('[data-action="use-role"]');await click('[data-action="advance"]');const form=document.querySelector('#workflow-form');assert.ok(form);for(const f of step.fields){const input=form.querySelector(`[name="${f.key}"]`);if(f.type==='checkbox')input.checked=true;else if(f.type==='select')setSelect(input,f.options[0]);else input.value=f.type==='number'?'5':f.type==='date'?'2026-11-24':f.key==='feedback'?'<b>Literal demonstration feedback</b>':'Verified synthetic demonstration result';}if(step.evidence){await click('[data-action="sample"]');assert.equal(document.querySelector('[data-action="sample"]').getAttribute('type'),'button');}form.dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));await delay();assert.equal(document.querySelector('.form-error')?.textContent||'','');}assert.match(document.querySelector('main').textContent,/Journey completed/);const saved=await openStore();assert.equal(saved.records.find(r=>r.id===m.journey).stage,flows[key].steps.length);}});
test('user-entered markup stays text and evidence remains discoverable',async()=>{route('teachers/Record/OBS-001');assert.match(document.querySelector('.record-fields').textContent,/<b>Literal demonstration feedback<\/b>/);assert.equal(document.querySelector('.record-fields b'),null);route('program/Evidence');assert.ok(document.querySelectorAll('tbody tr').length>=3);});
test('overview map selection and next-step links respond through UI handlers',async()=>{
  route('schools/Overview');
  assert.equal(document.querySelectorAll('.ds-kpi').length,4);
  assert.equal(document.querySelectorAll('[data-action="map-school"]').length,12);
  await click('[data-action="map-school"][data-id="SCH-001"]');
  assert.match(document.querySelector('.ds-map-selection').textContent,/Unity Demonstration School/);
  await click('[data-action="map-clear"]');
  assert.equal(document.querySelector('.ds-map-selection'),null);
  const rows=document.querySelectorAll('.ov-next-steps tbody tr');
  assert.equal(rows.length,3);
  assert.ok(document.querySelector('.ov-next-steps a[href^="#schools/Record/"]'));
  assert.ok(document.querySelector('.school-overview-v2'));
  route('schools/Schools');
  assert.equal(document.querySelector('.school-overview-v2'),null);
  route('energy/Overview');
  assert.ok(document.querySelector('[data-action="overview-report"]'));
});
test('profile switches user type and persists the selected role',async()=>{
  route('schools/Overview');
  assert.match(document.querySelector('.ds-profile-copy strong').textContent,/Abdullahi Hassan/);
  let selector=document.querySelector('#profile-role');
  setSelect(selector,'Technician');
  selector.dispatchEvent(new window.Event('change',{bubbles:true}));await delay();
  assert.equal((await openStore()).settings.role,'Technician');
  assert.equal(document.querySelector('.ds-profile-copy small').textContent,'Technician');
  selector=document.querySelector('#profile-role');setSelect(selector,'National Cordinator');
  selector.dispatchEvent(new window.Event('change',{bubbles:true}));await delay();
  assert.equal((await openStore()).settings.role,'National coordinator');
  assert.equal(document.querySelector('.ds-profile-copy small').textContent,'National Cordinator');
});
test('settings tabs render and workspace edits save or discard without changing records',async()=>{
 for(const tab of ['general','access','assets','verification','demo']){route(`schools/Settings/${tab}`);assert.ok(document.querySelector('#workspace-settings-form'));assert.doesNotMatch(document.querySelector('main').textContent,/undefined|NaN/);}
 route('schools/Settings/general');
 const before=await openStore();
 let name=document.querySelector('[name="displayName"]');name.value='HOPE Workspace';name.dispatchEvent(new window.Event('input',{bubbles:true}));
 await click('[data-action="settings-discard"]');assert.equal(document.querySelector('[name="displayName"]').value,'HOPE EDU');
 name=document.querySelector('[name="displayName"]');name.value='HOPE Workspace';name.dispatchEvent(new window.Event('input',{bubbles:true}));
 document.querySelector('#workspace-settings-form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));await delay();
 assert.equal((await openStore()).settings.displayName,'HOPE Workspace');assert.equal(document.querySelector('.ds-brand span').textContent,'HOPE Workspace');
 assert.deepEqual((await openStore()).records,before.records);
 await click('[data-section="preferences"]');
 const pageSize=document.querySelector('[name="pageSize"]');setSelect(pageSize,25);pageSize.dispatchEvent(new window.Event('change',{bubbles:true}));
 document.querySelector('#workspace-settings-form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));await delay();
 assert.equal((await openStore()).settings.pageSize,25);
 route('schools/Schools');assert.match(document.querySelector('.at-host').textContent,/25/);
});
