import {roleFlows} from './domain.js';
// State names follow Nigeria's constitutional list; coordinates are illustrative demo anchors.
export const regions=[
 ['Abia',7.5,5.5],['Adamawa',12.4,9.3],['Akwa Ibom',7.9,4.9],['Anambra',6.9,6.2],['Bauchi',10.2,10.3],['Bayelsa',6.2,4.8],['Benue',8.8,7.3],['Borno',13,11.8],['Cross River',8.5,5.8],['Delta',5.8,5.7],['Ebonyi',8.1,6.3],['Edo',5.9,6.6],['Ekiti',5.3,7.7],['Enugu',7.5,6.5],['Gombe',11.2,10.3],['Imo',7,5.5],['Jigawa',9.4,12.2],['Kaduna',7.4,10.5],['Kano',8.5,12],['Katsina',7.4,12.8],['Kebbi',4.3,11.5],['Kogi',6.7,7.8],['Kwara',4.7,8.8],['Lagos',3.4,6.5],['Nasarawa',8.3,8.5],['Niger',5.8,10],['Ogun',3.5,7.2],['Ondo',5.2,7.1],['Osun',4.5,7.8],['Oyo',3.9,8.4],['Plateau',9.2,9.2],['Rivers',6.9,4.8],['Sokoto',5.3,13],['Taraba',11,8],['Yobe',11.5,12.3],['Zamfara',6.2,12.1],['FCT',7.2,9]
];
const stamp='2026-11-20T09:00:00Z';
const courses=['Foundational literacy','Numeracy in practice','Inclusive classrooms','Assessment for learning','Digital teaching','Classroom leadership'];
export function expandDemoData(current){
 if(current.demoDataVersion===1)return current;
 const s=structuredClone(current),add=(collection,item)=>{if(!s[collection].some(x=>x.id===item.id))s[collection].push(item);};
 function asset(school,id,i){const condition=i%7===0?'Failed':i%4===0?'Degraded':'Operational';add('assets',{id,name:['Solar inverter','Water pump','Learning tablets','Connectivity router','Battery bank','Classroom projector','Water storage tank','Learning laptop'][i%8],schoolId:school.id,state:school.state,condition,warranty:'30 Jun 2028',history:[],synthetic:true});return s.assets.find(a=>a.id===id);}
 regions.forEach(([name,lon,lat],ri)=>{
  const prefix=`DEMO-${String(ri+1).padStart(2,'0')}`;
  for(let j=0;j<8;j++){
   const school={id:`${prefix}-SCH-${j+1}`,name:`${name} ${['Learning','Unity','Horizon','Community'][j%4]} Demo School ${j+1}`,state:name,lga:`Demo district ${j%4+1}`,students:150+(ri*37+j*53)%800,coordinates:[lon+(j%4-1.5)*.15,lat+(Math.floor(j/4)-.5)*.2],facilities:{ICT:'Available',WASH:j%3?'Operational':'Degraded',Connectivity:j%2?'Available':'Intermittent',Energy:'Operational'},condition:j%3?'Operational':'Degraded',synthetic:true};add('schools',school);
   for(let k=0;k<8;k++)asset(school,`${prefix}-AST-${j+1}-${k+1}`,ri+j+k);
   for(let k=0;k<3;k++)add('teachers',{id:`${prefix}-TCH-${j+1}-${k+1}`,name:`Demo educator ${ri+1}-${j+1}-${k+1}`,schoolId:school.id,state:name,course:courses[(j+k)%courses.length],history:[],synthetic:true});
  }
  const schools=s.schools.filter(x=>x.state===name);
  for(const [module,flow] of Object.entries(roleFlows))for(let j=0;j<12;j++){
   const local=name==='Kaduna',school=local&&['schools','energy'].includes(module)?s.schools.find(x=>x.id==='SCH-001'):schools[j%schools.length];
   const teacher=local?s.teachers.find(t=>t.id==='TCH-001'):s.teachers.find(t=>t.schoolId===school.id);
   const stateActor=local?'state-001':`${prefix}-manager`,reviewer=local?'state-002':`${prefix}-reviewer`,tech=local?'tech-001':`${prefix}-technician`,learner=local?'teacher-001':`${prefix}-teacher`;
   const r={id:`${prefix}-${module.toUpperCase()}-${String(j+1).padStart(2,'0')}`,module,title:`${name} · ${({program:['Facilities reporting','Learning outcomes','Delivery evidence'],schools:['Power service','Water system repair','Connectivity restoration'],teachers:courses,energy:['Solar installation','Battery upgrade','Power commissioning'],essence:courses,community:['Literacy cohort','Numeracy bridge','Community learning cohort']})[module][j%({teachers:6,essence:6}[module]||3)]} ${j+1}`,state:name,schoolId:school.id,stage:(ri+j)%flow.stages.length,version:1,roleVersion:2,synthetic:true,due:j%4===0?'2026-11-12':'2026-12-10',fields:{},evidence:[],audit:[{label:'Synthetic expanded example created',actor:'Demo dataset',at:stamp}],ownerId:stateActor,reviewerId:reviewer,assigneeId:tech,learnerId:learner,mentorId:local?'mentor-001':`${prefix}-mentor`,coordinatorId:stateActor,facilitatorId:learner};
   if(module==='program'){r.pillar=j%8+1;if(j%3===0)r.nationalReviewerId='national-001';}
   if(['teachers','essence'].includes(module)){r.teacherId=teacher.id;r.schoolId=teacher.schoolId;}
   if(module==='essence'){r.participantIds=[learner];r.members=12+j;}
   if(module==='community'){r.centre=`${name} Demo Learning Centre ${j%4+1}`;r.learner=`Synthetic cohort ${prefix}-${j+1}`;}
   if(module==='schools'){const a=asset(school,`${r.id}-ASSET`,j+ri);r.assetId=a.id;if(r.stage===flow.steps.length)a.condition='Operational';}
   const actors={program:[stateActor,stateActor,reviewer],schools:[stateActor,tech,stateActor,tech,local?'facility-001':`${prefix}-facility`],teachers:[learner,r.mentorId,r.mentorId,r.mentorId],energy:[tech,stateActor,tech,local?'facility-001':`${prefix}-facility`,reviewer],essence:[stateActor,r.mentorId,r.mentorId,reviewer],community:[learner,learner,learner,reviewer]};
   for(let step=0;step<r.stage;step++){
    const spec=flow.steps[step];for(const f of spec.fields)r.fields[f.key]=f.type==='checkbox'?true:f.type==='number'?(f.key==='amount'?25000+j*7500:5):f.type==='date'?'2026-12-10':f.type==='select'?f.options[j%f.options.length]:`Synthetic ${f.label.toLowerCase()} for ${r.id}`;
    if(spec.evidence)r.evidence.push({name:`${r.id}-sample-evidence.txt`,type:'text/plain',text:'Synthetic demonstration evidence. Not a real assessment or service record.',data:'data:text/plain;base64,U3ludGhldGljIGV2aWRlbmNl',stage:step,actor:spec.role,at:stamp});
    r.audit.push({label:`${spec.label} · seeded example`,actor:spec.role,actorId:actors[module][step],at:stamp});r.submittedBy=spec.role;r.submittedById=actors[module][step];
   }
   if(module==='energy'&&r.stage===flow.steps.length){const a=asset(school,`${r.id}-COMMISSIONED`,1);a.name='Commissioned solar hybrid';a.condition='Operational';r.assetId=a.id;}
   add('records',r);
  }
  for(let j=0;j<12;j++)add('grants',{id:`${prefix}-GRT-${j+1}`,schoolId:name==='Kaduna'?'SCH-001':schools[j%schools.length].id,title:`${name} · ${['Classroom refurbishment','WASH upgrade','Library improvement','Accessible learning space'][j%4]} ${j+1}`,amount:450000+(ri+j)*75000,status:['Approval pending','In progress','Handover pending','Completed'][j%4],milestones:['Survey complete','Procurement review','Handover review'],synthetic:true});
 });
 for(const school of s.schools.filter(x=>x.synthetic)){const assets=s.assets.filter(a=>a.schoolId===school.id);school.condition=assets.some(a=>a.condition==='Failed')?'Failed':assets.some(a=>a.condition==='Degraded')?'Degraded':'Operational';school.facilities.Energy=assets.some(a=>/inverter|battery|solar/i.test(a.name)&&a.condition==='Failed')?'Failed':'Operational';}
 s.demoDataVersion=1;return s;
}
