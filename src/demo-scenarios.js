import {roleFlows} from './domain.js';
export const sampleGuides=[
 {title:'Foundational literacy',duration:'20 minutes',steps:['Choose a short age-appropriate story.','Model reading aloud and identify three unfamiliar words.','Ask learners to retell the story in pairs.','Record one adjustment for the next lesson.']},
 {title:'Classroom practice',duration:'15 minutes',steps:['Set one clear learning objective.','Model the task before independent practice.','Check understanding with a short exit question.','Discuss participation with your mentor.']},
 {title:'Inclusive learning',duration:'25 minutes',steps:['Identify barriers in the sample classroom activity.','Offer spoken, written and visual instructions.','Plan flexible pairs and accessible materials.','Reflect on which adjustments supported participation.']},
 {title:'Numeracy in practice',duration:'20 minutes',steps:['Use counters to model a simple addition problem.','Ask pairs to explain two ways to reach the answer.','Compare strategies as a group.','Record common misconceptions for follow-up.']},
 {title:'Assessment for learning',duration:'15 minutes',steps:['Write three questions linked to the learning objective.','Collect anonymous sample responses.','Group responses by the support needed.','Plan a short reteaching activity.']},
 {title:'Digital teaching',duration:'30 minutes',steps:['Check that the sample devices and offline materials are ready.','Demonstrate safe use of the learning activity.','Rotate small groups through the activity.','Record access issues and learning reflections.']}
];
export function addTestingScenarios(current){
 if(current.testingScenariosVersion===1)return current;
 const s=structuredClone(current),at='2026-11-26T09:00:00Z';
 const cases=[['program',1,'WASH evidence returned for clarification'],['program',2,'Learning delivery evidence awaiting validation'],['schools',1,'Pump inspection with saved diagnosis draft'],['schools',4,'Classroom router repair awaiting verification'],['teachers',0,'Inclusive learning reflection draft'],['teachers',2,'Numeracy observation ready for follow-up'],['energy',1,'Solar audit ready for option approval'],['energy',3,'Battery commissioning ready for facility acceptance'],['essence',1,'Assessment cohort ready for attendance'],['essence',3,'Digital teaching practicum awaiting review'],['community',1,'Numeracy bridge session ready for delivery'],['community',3,'Literacy cohort progression awaiting validation']];
 for(const [i,[module,stage,title]] of cases.entries()){
  const id=`TEST-${module.toUpperCase()}-${i+1}`;if(s.records.some(r=>r.id===id))continue;
  const r={id,module,title,state:'Kaduna',schoolId:'SCH-001',stage,version:1,roleVersion:2,synthetic:true,due:i%3===0?'2026-11-12':'2026-12-10',fields:{},evidence:[],audit:[{label:'Synthetic testing scenario created',actor:'Demo dataset',at}],ownerId:'state-001',reviewerId:'state-002',assigneeId:'tech-001',learnerId:'teacher-001',mentorId:'mentor-001',coordinatorId:'state-001',facilitatorId:'teacher-001'};
  if(module==='program'){r.pillar=i+1;r.nationalReviewerId='national-001';}
  if(['teachers','essence'].includes(module))r.teacherId='TCH-001';
  if(module==='essence'){r.participantIds=['teacher-001'];r.members=16;}
  if(module==='community'){r.centre='Chikun Demo Learning Centre';r.learner=`Synthetic cohort ${i+1}`;}
  const actors={program:['state-001','state-001','state-002'],schools:['state-001','tech-001','state-001','tech-001','facility-001'],teachers:['teacher-001','mentor-001','mentor-001','mentor-001'],energy:['tech-001','state-001','tech-001','facility-001','state-002'],essence:['state-001','mentor-001','mentor-001','state-002'],community:['teacher-001','teacher-001','teacher-001','state-002']};
  for(let j=0;j<stage;j++){const step=roleFlows[module].steps[j];for(const f of step.fields)r.fields[f.key]=f.type==='checkbox'?true:f.type==='number'?(f.key==='amount'?48000:5):f.type==='date'?'2026-12-10':f.type==='select'?f.options[0]:`Synthetic ${f.label.toLowerCase()}: ${title}.`;if(step.evidence)r.evidence.push({name:`${id}-evidence.txt`,type:'text/plain',text:'Synthetic testing evidence only.',data:'data:text/plain;base64,U3ludGhldGljIHRlc3RpbmcgZXZpZGVuY2Ugb25seS4=',stage:j,actor:step.role,at});r.audit.push({label:step.label+' · synthetic example',actor:step.role,actorId:actors[module][j],at});r.submittedBy=step.role;r.submittedById=actors[module][j];}
  if(module==='schools'){r.assetId=`${id}-ASSET`;s.assets.push({id:r.assetId,name:stage===1?'Water pump':'Classroom router',schoolId:r.schoolId,state:r.state,condition:stage===1?'Degraded':'Failed',warranty:'30 Jun 2028',synthetic:true,history:[{label:'Synthetic preventive service completed',actor:'Demo service team',at:'2026-10-12T09:00:00Z'},{label:'Synthetic fault reported for follow-up',actor:'Demo facility team',at:'2026-11-12T09:00:00Z'}]});}
  if(i===0){r.fields.result='Synthetic initial WASH checklist submitted for review.';r.evidence.push({name:'Initial synthetic WASH checklist.txt',type:'text/plain',text:'Synthetic initial checklist awaiting clarification.',data:'data:text/plain;base64,U3ludGhldGljIGV2aWRlbmNl',stage:1,actor:'State manager',at});r.audit.push({label:'Submit evidence · synthetic initial submission',actor:'Amina Yusuf',actorId:'state-001',at});r.audit.push({label:'Returned for correction: clarify the facility checklist and attach supporting evidence (synthetic).',actor:'Bala Ahmed',actorId:'state-002',at});}
  if(i===2)r.draft={diagnosis:'Synthetic draft: inspect the pump seals and pressure switch.',amount:48000,vendor:'Demonstration service team'};
  if(i===4)r.draft={learning:'Synthetic draft: offer visual instructions alongside spoken guidance.'};
  s.records.push(r);
 }
 s.messages||=[];
 const messages={
 'national-001':['Please review the synthetic state reporting gaps before the next demo review.','The sample escalation summary is ready for discussion.'],
 'state-001':['Please confirm the sample repair evidence is ready for facility verification.','The demonstration project review is scheduled for next week.'],
 'facility-001':['The sample router repair is ready for verification.','Please review the synthetic WASH checklist.'],
 'teacher-001':['The sample numeracy reflection is ready for mentor feedback.','Please confirm the demonstration cohort timetable.'],
 'tech-001':['The synthetic pump inspection draft is ready to review.','The sample repair evidence has been prepared for verification.']};
 for(const [senderId,texts] of Object.entries(messages))texts.forEach((text,i)=>{const id=`TEST-MSG-${senderId}-${i}`;if(!s.messages.some(m=>m.id===id))s.messages.push({id,senderId,recipientId:senderId==='state-001'?'facility-001':'state-001',text,at,synthetic:true});});
 s.testingScenariosVersion=1;return s;
}
