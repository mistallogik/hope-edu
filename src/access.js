export const demoUsers=[
 {id:'national-001',name:'Abdullahi Hassan',role:'National coordinator',label:'National Coordinator',home:'program'},
 {id:'state-001',name:'Amina Yusuf',role:'State manager',label:'State Manager',home:'schools'},
 {id:'facility-001',name:'Musa Ibrahim',role:'Facility manager',label:'Facility Manager',home:'schools'},
 {id:'teacher-001',name:'Zainab Bello',role:'Teacher',label:'Teacher',home:'teachers'},
 {id:'tech-001',name:'Ibrahim Suleiman',role:'Technician',label:'Technician',home:'schools'},
];
export const isTechnician=state=>state.settings.role==='Technician';
export const activeUser=state=>allUsers.find(u=>u.id===state.settings.activeUserId&&u.role===state.settings.role)||demoUsers.find(u=>u.role===state.settings.role)||{id:'legacy-demo',name:state.settings.profileName||'Demonstration user',role:state.settings.role,label:state.settings.role,home:'schools'};
export const assignedJobs=state=>state.records.filter(r=>['schools','energy'].includes(r.module)&&r.assigneeId===activeUser(state).id);
export function requireJob(state,id,write=false){const r=assignedJobs(state).find(r=>r.id===id);if(!r||write&&!(state.roleVersion?canAct(state,r):[1,3].includes(r.stage)))throw Error('This work order is not available for this action.');return r;}
export function technicianRoute(state,mod,view,id){if(mod!=='schools')return false;if(view==='Record')return assignedJobs(state).some(r=>r.id===id);return ['Overview','Work orders','Settings'].includes(view)&&(!id||view==='Settings'&&id==='general');}
export function technicianData(state){const records=assignedJobs(state),ids=new Set(records.map(r=>r.schoolId)),assets=new Set(records.map(r=>r.assetId));return {...state,records,schools:state.schools.filter(s=>ids.has(s.id)),assets:state.assets.filter(a=>assets.has(a.id)),teachers:[],grants:[],queue:state.queue.filter(q=>records.some(r=>r.id===q.recordId))};}
export function addTechnicianFixtures(state){
 if(state.technicianVersion)return state;
 const next=structuredClone(state);next.technicianVersion=1;next.messages||=[];next.personalPreferences||={};
 // Separate, explicitly assigned synthetic jobs; never guess ownership of legacy records.
 [1,2,3,4,5,1,1].forEach((stage,i)=>{const a=next.assets[i%next.assets.length];if(!a)return;next.records.push({id:`TECH-${String(i+1).padStart(3,'0')}`,module:'schools',title:['Inverter cooling inspection','Water pump pressure fault','Tablet charging repair','Router connection repair','Solar cable inspection','Pump service at another site','Unassigned equipment inspection'][i],state:a.state,schoolId:a.schoolId,assetId:a.id,assigneeId:i<5?'tech-001':i===5?'tech-002':null,stage,version:1,due:i===0?'2026-11-15':'2026-11-24',fields:{assignee:i<5?'Ibrahim Suleiman':'Pending assignment',due:i===0?'2026-11-15':'2026-11-24',...(stage>=2?{diagnosis:'Synthetic inspection found a service fault.',amount:25000,vendor:'Demonstration service team'}:{}),...(stage>=3?{decision:'Sample repair approved.'}:{}),...(stage>=4?{repair:'Synthetic repair completed.',tested:true}:{})},evidence:stage>=4?[{name:'Demonstration repair record.txt',type:'text/plain',text:'Synthetic repair evidence for review.',data:'data:text/plain;base64,U3ludGhldGljIHJlcGFpciBldmlkZW5jZS4=',actor:'Ibrahim Suleiman',stage:3}]:[],audit:[{label:'Synthetic work order assigned',actor:'Amina Yusuf',at:`2026-11-${String(10+i).padStart(2,'0')}T09:00:00Z`}],submittedBy:stage===2||stage===4?'Technician':'State manager'});});return next;
}

export const additionalUsers=[
 {id:'state-002',name:'Bala Ahmed',role:'State manager',label:'State Manager',home:'schools',state:'Kaduna',duties:['validation','cohorts','community']},
 {id:'mentor-001',name:'Maryam Ali',role:'Teacher',label:'Teacher',home:'teachers',teacherId:'TCH-002',duties:['mentoring']},
 {id:'facility-002',name:'Halima Sani',role:'Facility manager',label:'Facility Manager',home:'schools',schoolId:'SCH-002'},
];
Object.assign(demoUsers[1],{state:'Kaduna',duties:['cohorts','community']});
Object.assign(demoUsers[2],{schoolId:'SCH-001'});
Object.assign(demoUsers[3],{teacherId:'TCH-001',duties:['community']});
export const allUsers=[...demoUsers,...additionalUsers];
export const roleNavigation=state=>{
 const u=activeUser(state),nav={
 'National coordinator':[['program','Overview','Overview'],['program','State scorecards','State scorecards'],['program','DLR readiness','Results readiness'],['program','Actions','Escalations & reviews'],['program','Reports','Reports']],
 'State manager':[['schools','Overview','Overview'],['schools','Schools','Schools'],['schools','Asset registry','Assets'],['schools','Work orders','Work Orders'],['schools','Grants & projects','Grants & Projects'],['program','Actions','Results & Actions'],['teachers','Teacher profiles','Teacher Development'],['energy','Construction','Energy & Infrastructure'],...(u.duties?.includes('cohorts')?[['essence','Cohorts & schedule','Training Cohorts']]:[]),...(u.duties?.includes('community')?[['community','Progress & transition','Community Learning']]:[]),['schools','Reports','Reports']],
 'Facility manager':[['schools','Overview','Overview'],['schools','Schools','My School'],['schools','Asset registry','Assets'],['schools','Work orders','Work Orders'],['schools','Grants & projects','School Projects'],['energy','Construction','Facility Acceptance']],
 Teacher:[['teachers','Overview','Overview'],['teachers','Teacher profiles','My Development'],['teachers','Courses & guides','Courses & Guides'],['essence','Cohorts & schedule','Training & Schedule'],...(u.duties?.includes('mentoring')?[['teachers','Mentor observations','Mentoring']]:[]),...(u.duties?.includes('community')?[['community','Progress & transition','Community Sessions']]:[])],
 Technician:[['schools','Overview','Overview'],['schools','Work orders','Work Orders']]
 };return [...(nav[u.role]||[]),[u.home,'Settings','Settings']];
};
export function canReadRecord(state,r){if(!r)return false;const u=activeUser(state);switch(u.role){
 case 'National coordinator':return r.nationalReviewerId===u.id;
 case 'State manager':return r.state===u.state&&(!['essence','community'].includes(r.module)||u.duties?.includes(r.module==='essence'?'cohorts':'community'));
 case 'Facility manager':return r.schoolId===u.schoolId&&['schools','energy'].includes(r.module);
 case 'Teacher':return r.module==='teachers'&&(r.teacherId===u.teacherId||r.mentorId===u.id)||r.module==='essence'&&(r.participantIds?.includes(u.id)||r.mentorId===u.id)||r.module==='community'&&r.facilitatorId===u.id&&u.duties?.includes('community');
 case 'Technician':return ['schools','energy'].includes(r.module)&&r.assigneeId===u.id;
 default:return false;
}}
export function actionOwner(r){return ({schools:['state','assignee','state','assignee','facility'],program:['owner','owner','reviewer'],teachers:['learner','mentor','mentor','mentor'],energy:['assignee','state','assignee','facility','reviewer'],essence:['coordinator','mentor','mentor','reviewer'],community:['facilitator','facilitator','facilitator','reviewer']})[r.module]?.[r.stage];}
export function canAct(state,r){if(!state.roleVersion||!r?.roleVersion||!canReadRecord(state,r))return false;const u=activeUser(state),owner=actionOwner(r);const ids={assignee:r.assigneeId,owner:r.ownerId,reviewer:r.reviewerId,mentor:r.mentorId,learner:r.learnerId,coordinator:r.coordinatorId,facilitator:r.facilitatorId};let allowed=owner==='state'?u.role==='State manager'&&r.state===u.state:owner==='facility'?u.role==='Facility manager'&&r.schoolId===u.schoolId:ids[owner]===u.id;
 if(['reviewer','facility'].includes(owner)&&(!r.submittedById||r.submittedById===u.id))allowed=false;
 if(owner==='mentor'&&(r.teacherId===u.teacherId||r.participantIds?.includes(u.id)))allowed=false;
 return !!allowed;
}
export function requireRecord(state,id,write=false){const r=state.records.find(r=>r.id===id);if(!canReadRecord(state,r)||write&&!canAct(state,r))throw Error('This record is not available for this action.');return r;}
export function scopedData(state){const u=activeUser(state),records=state.records.filter(r=>canReadRecord(state,r));const schoolAllowed=s=>u.role==='State manager'?s.state===u.state:u.role==='Facility manager'?s.id===u.schoolId:u.role==='Technician'?records.some(r=>r.schoolId===s.id):false;const schools=state.schools.filter(schoolAllowed);return {...state,records,schools,assets:state.assets.filter(a=>u.role==='Technician'?records.some(r=>r.assetId===a.id):schools.some(s=>s.id===a.schoolId)),teachers:state.teachers.filter(t=>u.role==='State manager'?t.state===u.state:u.role==='Teacher'&&(t.id===u.teacherId||records.some(r=>r.mentorId===u.id&&r.teacherId===t.id))),grants:state.grants.filter(g=>schools.some(s=>s.id===g.schoolId)),queue:state.queue.filter(q=>records.some(r=>r.id===q.recordId))};}
export function allowedRoute(state,m,v,id){const u=activeUser(state);if(v==='Record')return state.records.some(r=>r.id===id&&r.module===m&&canReadRecord(state,r));if(v==='Settings')return m===u.home&&(!id||id==='general');if(!roleNavigation(state).some(([mod,view])=>m===mod&&v===view))return false;if(!id)return true;const data=scopedData(state);return v==='Schools'?data.schools.some(x=>x.id===id):v==='Asset registry'?data.assets.some(x=>x.id===id):v==='Teacher profiles'?data.teachers.some(x=>x.id===id):false;}
export function addRoleFixtures(state){if(state.settings.role==='School focal person'){state=structuredClone(state);state.settings.role='Facility manager';}const primary=demoUsers.find(u=>u.role===state.settings.role);if(primary&&state.settings.activeUserId&&state.settings.activeUserId!==primary.id){state=structuredClone(state);state.settings.activeUserId=primary.id;}if(state.roleVersion)return state;const next=addTechnicianFixtures(state),s=structuredClone(next);s.roleVersion=2;s.settings.activeUserId=demoUsers.find(u=>u.role===s.settings.role)?.id||'national-001';s.settings.role=allUsers.find(u=>u.id===s.settings.activeUserId).role;
 for(const r of s.records.filter(r=>r.id.startsWith('TECH-'))){r.roleVersion=2;if(r.stage===2||r.stage===4)r.submittedById=r.assigneeId;}
 const record=(id,module,title,extra={})=>({id,module,title,state:'Kaduna',stage:0,version:1,roleVersion:2,fields:{},evidence:[],audit:[{label:'Synthetic role-based record created',actor:'Demo dataset',at:'2026-11-16T09:00:00Z'}],...extra});
 s.records.push(record('V2-DLR-001','program','School readiness evidence gap',{pillar:1,ownerId:'state-001',reviewerId:'state-002',nationalReviewerId:'national-001',due:'2026-11-15'}),record('V2-OBS-001','teachers','Zainab’s literacy development',{teacherId:'TCH-001',schoolId:'SCH-001',learnerId:'teacher-001',mentorId:'mentor-001'}),record('V2-INS-001','energy','Unity solar commissioning',{schoolId:'SCH-001',assigneeId:'tech-001',reviewerId:'state-002'}),record('V2-COH-001','essence','Literacy practice · Zainab enrollment',{teacherId:'TCH-001',schoolId:'SCH-001',participantIds:['teacher-001'],coordinatorId:'state-001',mentorId:'mentor-001',reviewerId:'state-002',members:1}),record('V2-REF-001','community','Coded cohort · Chikun learning sessions',{centre:'Chikun Learning Centre',facilitatorId:'teacher-001',reviewerId:'state-002',learner:'Demo cohort CL-A'}));
 return s;
}
