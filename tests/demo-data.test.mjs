import test from 'node:test';
import assert from 'node:assert/strict';
import {seed,workflowFor,complete} from '../src/domain.js';
import {addRoleFixtures,scopedData,demoUsers,canAct} from '../src/access.js';
import {expandDemoData,regions} from '../src/demo-data.js';
import {nationalAssetSummary} from '../src/overview.js';
test('expanded dataset covers all states and FCT without replacing saved work',()=>{
 const old=addRoleFixtures(seed());old.records[0].fields.custom='Keep this saved edit';old.messages=[{text:'Keep this message'}];
 const s=expandDemoData(old);assert.equal(regions.length,37);assert.equal(new Set(s.schools.map(x=>x.state)).size,37);assert.equal(nationalAssetSummary(s).length,37);
 for(const key of ['records','schools','assets','teachers','grants']){assert.deepEqual(s[key].slice(0,old[key].length),old[key]);assert.equal(new Set(s[key].map(x=>x.id)).size,s[key].length);}
 assert.deepEqual(s.messages,old.messages);assert.equal(expandDemoData(s),s);
});
test('expanded records have valid relationships and coherent seeded workflow history',()=>{
 const s=expandDemoData(addRoleFixtures(seed()));
 for(const r of s.records.filter(r=>r.synthetic)){
  const school=s.schools.find(x=>x.id===r.schoolId);assert.ok(school);assert.equal(school.state,r.state);assert.ok(r.stage>=0&&r.stage<workflowFor(r).stages.length);assert.equal(r.audit.length,r.stage+1);
  if(r.teacherId)assert.equal(s.teachers.find(t=>t.id===r.teacherId).schoolId,r.schoolId);
  if(r.assetId){const a=s.assets.find(a=>a.id===r.assetId);assert.equal(a.schoolId,r.schoolId);if(complete(r))assert.equal(a.condition,'Operational');}
  for(let i=0;i<r.stage;i++){const step=workflowFor(r).steps[i];for(const field of step.fields)assert.notEqual(r.fields[field.key],undefined);if(step.evidence)assert.ok(r.evidence.some(e=>e.stage===i));}
 }
});
test('all five demo roles receive enough scoped examples and actionable work',()=>{
 const s=expandDemoData(addRoleFixtures(seed()));
 for(const u of demoUsers){s.settings.role=u.role;s.settings.activeUserId=u.id;const d=scopedData(s);assert.ok(d.records.length>=12,u.role);if(u.role==='State manager')assert.ok(d.schools.length>10);if(u.role==='Facility manager'){assert.equal(d.schools.length,1);assert.ok(d.assets.length>10);assert.ok(d.grants.length>10);}if(u.role!=='National coordinator')assert.ok(d.records.some(r=>canAct(s,r)),u.role);}
});

test('supplemental scenarios preserve saved work and remain small and idempotent',async()=>{
 const {addTestingScenarios,sampleGuides}=await import('../src/demo-scenarios.js');const old=expandDemoData(addRoleFixtures(seed()));old.messages=[{text:'My existing message'}];const next=addTestingScenarios(old);
 assert.equal(next.records.length-old.records.length,12);assert.equal(next.assets.length-old.assets.length,2);assert.equal(next.messages.length,11);assert.equal(sampleGuides.length,6);
 assert.deepEqual(next.records.slice(0,old.records.length),old.records);assert.deepEqual(next.assets.slice(0,old.assets.length),old.assets);assert.equal(next.messages[0].text,'My existing message');assert.equal(addTestingScenarios(next),next);
 for(const module of ['program','schools','teachers','energy','essence','community'])assert.equal(next.records.filter(r=>r.id.startsWith('TEST-')&&r.module===module).length,2);
});
