const subtitles = {
  program: {
    Overview: 'See program progress and the results that need attention.',
    'State scorecards': 'Compare reporting progress across states.',
    'DLR readiness': 'Track the evidence needed to validate each result.',
    Actions: 'Review outstanding actions and who is responsible.',
    Record: 'Review this result, its evidence, and the next action.',
  },
  schools: {
    Overview: 'See school readiness and maintenance that needs attention.',
    Schools: 'Find schools and check their facilities.',
    'Asset registry': 'Check school assets, their condition, and maintenance history.',
    'Work orders': 'Track repairs from the first report to verified closure.',
    'Grants & projects': 'Review school project funding, approvals, and milestones.',
    Record: 'Review this repair, its evidence, and the next action.',
  },
  teachers: {
    Overview: 'See teacher development progress and upcoming support needs.',
    'Teacher profiles': 'Review teachers and their training history.',
    'Courses & guides': 'Explore lesson guides and classroom practice activities.',
    'Mentor observations': 'Review classroom observations and coaching progress.',
    'Learning outcomes': 'Compare sample literacy and numeracy results by school.',
    Record: 'Review this observation, its feedback, and the next action.',
  },
  energy: {
    Overview: 'See infrastructure progress and school energy needs.',
    'Site selection': 'Review schools for infrastructure improvements.',
    'Energy passports': 'Review school energy assessments and installation records.',
    'Installation options': 'Compare sample solar packages and estimated costs.',
    Construction: 'Track installations through construction and commissioning.',
    Monitoring: 'Check commissioned installations and solar asset condition.',
    Record: 'Review this installation, its evidence, and the next action.',
  },
  essence: {
    Overview: 'See training progress and cohorts that need follow-up.',
    'Training hub': 'Explore the teacher centre and its learning pathways.',
    'Cohorts & schedule': 'Review training cohorts and their planned activities.',
    Practicum: 'Track classroom practice and mentor feedback.',
    'Completion & follow-up': 'Review training completion and follow-up plans.',
    Record: 'Review this cohort, its training evidence, and the next action.',
  },
  community: {
    Overview: 'See community learning progress and learners needing follow-up.',
    'Community centres': 'Find learning centres and their current cohorts.',
    'Referral & enrollment': 'Track learner referrals and enrollment progress.',
    'Attendance & materials': 'Review attendance and learning material records.',
    'Progress & transition': 'Track learner progress and transition decisions.',
    Record: 'Review this referral, its learning records, and the next action.',
  },
};
export function pageSubtitle(module, view, entityId = '') {
  if (view === 'Settings') return 'Manage your workspace, preferences, and demonstration controls.';
  if (view === 'Evidence') return 'Find supporting documents linked to records in this workspace.';
  if (entityId && view === 'Schools') return 'Review this school’s facilities, assets, and related work.';
  if (entityId && view === 'Asset registry') return 'Review this asset’s condition, history, and linked repairs.';
  if (entityId && view === 'Teacher profiles') return 'Review this teacher’s training, coaching, and learning history.';
  return subtitles[module]?.[view] || 'Review records and follow their progress.';
}
