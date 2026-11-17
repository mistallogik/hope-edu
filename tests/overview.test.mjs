import test from 'node:test';
import assert from 'node:assert/strict';
import {seed} from '../src/domain.js';
import {overviewModel,reportData,schoolOverviewRows,renderOverview} from '../src/overview.js';

test('overview figures and priorities reflect assets, including repaired conditions',()=>{
  const state=seed();
  const before=overviewModel(state,'schools');
  assert.deepEqual(before.metrics.map(m=>m.value),['83%',12,6,1]);
  assert.equal(before.affected[0].condition,'Failed');
  const asset=state.assets.find(a=>a.condition==='Failed');
  asset.condition='Operational';
  const after=overviewModel(state,'schools');
  assert.equal(after.metrics[3].value,0);
  assert.equal(after.affected.length,before.affected.length-1);
  assert.equal(after.schoolReadiness(state.schools.find(s=>s.id===asset.schoolId)),100);
});

test('state scope consistently limits map schools, KPIs and report rows',()=>{
  const state=seed();
  for(const scope of ['Kaduna','Kano','Oyo']) {
    const model=overviewModel(state,'schools',scope);
    assert.equal(model.schools.length,4);
    assert.ok(model.assets.every(a=>a.state===scope));
    const readiness=reportData(state,'schools',scope,'readiness');
    assert.equal(readiness.rows.length,model.assets.length);
    assert.ok(readiness.rows.every(r=>r[3]===scope));
    const priority=reportData(state,'schools',scope,'critical');
    assert.equal(priority.rows.length,model.affected.length);
    assert.ok(priority.rows.every(r=>r[4]!=='Operational'));
  }
  const empty=overviewModel(state,'schools','Unknown');
  assert.equal(empty.metrics[0].value,'—');
  assert.equal(empty.schools.length,0);
});


test('school overview separates workflow stage from asset priority and excludes closed orders',()=>{
  const state=seed();
  let rows=schoolOverviewRows(overviewModel(state,'schools'));
  assert.equal(rows[0].record.id,'WO-001');
  assert.equal(rows[0].priority,'Critical');
  assert.equal(rows[0].stage,'Reported');
  assert.ok(rows.every(row=>row.school.state===row.record.state));
  assert.equal(new Set(rows.map(row=>row.record.id)).size,rows.length);
  state.records.find(r=>r.id==='WO-001').stage=5;
  rows=schoolOverviewRows(overviewModel(state,'schools'));
  assert.ok(!rows.some(row=>row.record.id==='WO-001'));
  assert.equal(schoolOverviewRows(overviewModel(state,'schools','Oyo')).length,0);
});

test('degraded assets remain visible when a state has no work orders',()=>{
  const ui={link:(text,path)=>`<a href="#${path}">${text}</a>`,button:text=>`<button>${text}</button>`};
  const html=renderOverview({state:seed(),module:'schools',scope:'Oyo',geometry:[],selection:'',zoom:1,ui});
  assert.match(html,/No work order/);
  assert.match(html,/AST-022/);
  assert.match(html,/No outstanding work orders/);
  assert.match(html,/1 state</);
  assert.doesNotMatch(html,/1 states/);
});
