import test from 'node:test';
import assert from 'node:assert/strict';
import {seed,flows,modules,transition,complete,metrics,severity} from '../src/domain.js';
const fieldsFor=step=>Object.fromEntries(step.fields.map(f=>[f.key,f.type==='checkbox'?true:f.type==='number'?5:f.type==='date'?'2026-11-24':f.type==='select'?f.options[0]:'Demonstration verification notes']));
const evidence=[{name:'sample.txt',type:'text/plain',data:'data:text/plain;base64,VGVzdA=='}];
for(const [m,config] of Object.entries(modules))test(`${m}: complete journey and preserve audit`,()=>{let state=seed();const start=state.records.find(r=>r.id===config.journey);for(const step of flows[m].steps){const r=state.records.find(r=>r.id===config.journey);state=transition(state,r.id,step.role,fieldsFor(step),{evidence:step.evidence?evidence:[],expectedVersion:r.version});}const record=state.records.find(r=>r.id===config.journey);assert.ok(complete(record));assert.equal(record.audit.length,flows[m].steps.length+1);assert.equal(start.stage,0);if(m==='schools')assert.equal(state.assets.find(a=>a.id===record.assetId).condition,'Operational');if(m==='energy')assert.equal(state.assets.filter(a=>a.id===record.assetId).length,1);if(record.teacherId)assert.equal(state.teachers.find(t=>t.id===record.teacherId).history.length,flows[m].steps.length);assert.throws(()=>transition(state,record.id,'Evidence verifier',{}),/already complete/);});
test('wrong role cannot change records',()=>{const s=seed();assert.throws(()=>transition(s,'WO-001','Teacher',{}),/requires/);assert.equal(s.records.find(r=>r.id==='WO-001').stage,0)});
test('evidence required and stale versions rejected',()=>{let s=seed();s=transition(s,'DLR-07','State manager',fieldsFor(flows.program.steps[0]));assert.throws(()=>transition(s,'DLR-07','State manager',fieldsFor(flows.program.steps[1])),/evidence/);assert.throws(()=>transition(s,'DLR-07','State manager',fieldsFor(flows.program.steps[1]),{evidence,expectedVersion:1}),/changed/)});
test('returned review preserves evidence and audit',()=>{let s=seed();s=transition(s,'DLR-07','State manager',fieldsFor(flows.program.steps[0]));s=transition(s,'DLR-07','State manager',fieldsFor(flows.program.steps[1]),{evidence});s=transition(s,'DLR-07','Evidence verifier',{}, {returnReason:'Add missing checklist'});const r=s.records.find(r=>r.id==='DLR-07');assert.equal(r.stage,1);assert.equal(r.evidence.length,1);assert.match(r.audit.at(-1).label,/missing checklist/)});
test('attendance and numeric bounds enforced',()=>{let s=seed();s=transition(s,'COH-001','Essence coordinator',fieldsFor(flows.essence.steps[0]));assert.throws(()=>transition(s,'COH-001','Mentor',{attendance:6,notes:'test'}),/between/);assert.throws(()=>transition(s,'COH-001','Mentor',{attendance:-1,notes:'test'}),/positive/)});
test('offline changes have unique queue entries',()=>{let s=seed();s.settings.offline=true;s=transition(s,'WO-001','State manager',fieldsFor(flows.schools.steps[0]));s=transition(s,'WO-001','Technician',fieldsFor(flows.schools.steps[1]));assert.equal(s.queue.length,2);assert.equal(new Set(s.queue.map(q=>q.id)).size,2)});
test('aggregates derive from filtered records',()=>{const s=seed(),m=metrics(s,'Kaduna');assert.ok(m.records.every(r=>r.state==='Kaduna'));assert.equal(m.complete,m.records.filter(complete).length);assert.equal(severity(s.records.find(r=>r.id==='DLR-07')),'Critical');assert.equal(s.records.filter(r=>r.module==='program').length,28)});

test('shared severity reflects failed assets and completed work consistently',()=>{
 const state=seed(),record=state.records.find(r=>r.id==='WO-001');
 assert.equal(severity(record,state),'Critical');
 state.assets.find(a=>a.id===record.assetId).condition='Degraded';
 assert.equal(severity(record,state),'Warning');
 record.stage=flows.schools.stages.length-1;
 assert.equal(severity(record,state),'Normal');
});
