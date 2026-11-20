# HOPE EDU V2 role based experience plan

Date: 19 November 2026

Status: Planning draft for review. No V2 application changes have been made. The decisions below incorporate the user's responses on 19 November 2026; proposed details are explicitly identified for review.

## Purpose and agreed direction

V2 will replace the module-first demonstration with a role-first experience. The six capabilities remain underneath the application, but each user lands on an appropriate overview and sees one combined sidebar containing only their permitted work. There will be no unrestricted module selector.

Confirmed decisions:

- Build a browser demonstration first, with sample user identities. Real sign-in and server-enforced authorization are outside this milestone.
- Use five primary roles: National Coordinator, State Manager, Facility Manager, Teacher, and Technician.
- Give each role one combined sidebar rather than a filtered module dropdown.
- Assign specialist duties within those roles. Selected Teachers may mentor or facilitate community learning; selected State Managers may coordinate cohorts and validate submissions; Facility Managers may verify completed repairs at their own schools.
- National Coordinator views focus on national summaries, exceptions, escalations, and supporting detail for assigned reviews. State Managers manage daily operations in their assigned state.
- A Technician sees only Overview, Work Orders, and Settings. The overview contains relevant statistics and recent work orders.
- Energy commissioning requires Facility Manager acceptance followed by State Manager validation before the installation becomes operational.
- Safeguarding case details remain unavailable in V2 until a responsible owner and access policy are defined.

The plan uses the standard spelling “National Coordinator.” The current interface's “National Cordinator” label can be corrected during the role migration.

## What the source brief establishes

Source: `HOPE_EDU_Six_Proposal_Figma_Brief.docx`, supplied by the user. The document describes six complementary proposals, not six workspaces every user must be allowed to enter. Its requirements are source material; its deliverable list does not expand the current request to implement, publish, or produce a deck.

| Brief section | Relevant requirement | V2 implication |
| --- | --- | --- |
| Shared design requirements | Federal/state/LGA/school navigation with clear role-based views; synthetic data; field workflows | Access scope must follow the user, not a freely selectable geographic filter. Maintain field workflows and synthetic fixtures. |
| 01 Program Intelligence | National command centre, state scorecards, DLR readiness, corrective actions | National oversight and state delivery should have different landing pages and detail permissions. |
| 02 SchoolOps and Asset Lifecycle | Facility profiles, asset records, dispatch, quotes, approval, repair evidence and closeout | Separate facility reporting, state approval, technician execution, and closure verification. |
| 03 TeacherOps and Outcomes | Teacher development history, learning resources, mentor observations and aggregate outcomes | A Teacher needs personal learning access; mentoring is a separately assigned duty with access to assigned teachers only. |
| 04 Auroch Energy and Modular Infrastructure | Site audits, installation options, commissioning and monitoring | Preserve technical delivery under assigned work; reserve option approval and portfolio planning for State Managers. |
| 05 Essence Kaduna Teacher Centre | Cohort enrollment, attendance, practicum, completion and follow-up | Preserve cohort coordination and mentoring through assigned duties; participation alone does not grant management access. |
| 06 Open Classroom Community Learning | Centre records, anonymized enrollment, delivery, progression, safeguarding and transition | Community duties need explicit centre/cohort assignments. Ordinary Teacher or national summary access must not expose referral details. |
| Technical review questions | Who owns and validates data at each level? How does independent verification affect pilots? | The brief leaves approval ownership and independent verification policy unresolved. V2 mappings are proposed demo rules, not government policy. |

The brief also requires responsible roles, timestamps, stages and audit histories on approval screens. V2 must retain these while replacing generic role names as actors with identifiable synthetic user IDs. Provider labels remain: Hsry software, Auroch infrastructure, Essence training and The Open Classroom community delivery.

## Findings in the existing implementation

The current application defines six module routes and 11 roles in `src/domain.js`. All users receive the same module selector and largely the same pages. The role currently controls selected workflow actions rather than the full experience.

Key gaps:

1. Role-only checks do not establish which school, state, teacher, cohort or work order belongs to a user. Technician assignments are currently free text; records need stable assignee IDs.
2. State filters are presentation controls, not access boundaries. Detail URLs, search, evidence, exports and reports need the same checks as list pages.
3. Workflow buttons can switch to the required role immediately. These shortcuts undermine a role-first demonstration and must leave ordinary record screens.
4. Review independence currently compares role names. After consolidation, two State Managers could legitimately submit and review different steps, while one person must not approve their own submission. Identity must drive that rule.
5. Settings expose workspace changes and demo controls broadly. Personal preferences, workspace administration and presenter controls need separate permissions.
6. The existing teacher/cohort/community fixtures lack enough explicit membership and ownership information to demonstrate restricted access reliably.
7. Current summaries and maps derive from broad shared data. Filtering only the table would still leak information through counts, pins, search, notifications and downloads.
8. The application stores the complete synthetic dataset in IndexedDB. Client-side checks can demonstrate policy consistently but cannot secure real data against a person using browser developer tools.

## Access model

Use this rule for every view and action:

**Allowed capability + permitted scope + relevant assignment + valid workflow state.**

A senior role is not an automatic superset of all lower roles. Default to no access when a permission or assignment is missing. UI filters may narrow authorized scope but cannot widen it.

Each sample user will have a stable ID, name, one primary role, geographic assignments, and optional specialist assignments. Records will link to stable school, asset, teacher, cohort, centre, assignee and reviewer IDs as applicable. A specialist duty grants only its named actions on its assigned records; it is not a hidden sixth role or a global permission bypass.

The sample-account switcher will be explicitly labeled as a demonstration control. It selects a complete identity with preconfigured assignments, not an arbitrary role attached to the same person. Production authentication and account provisioning remain separate future work.

## Proposed role experiences

These page labels and metric selections are recommendations for review; the five roles and overall access approach above are confirmed.

| Role | Landing overview | Combined navigation | Scope |
| --- | --- | --- | --- |
| National Coordinator | National delivery, state comparison, DLR readiness, exceptions and escalations | Overview; State scorecards; Results & evidence readiness; Escalations & reviews; Reports; Settings | National aggregates; limited supporting detail for an assigned review or escalation |
| State Manager | State performance, pending decisions, unresolved maintenance, training and delivery progress | Overview; Schools; Assets; Work Orders; Grants & Projects; Results & Actions; Teacher Development; Energy & Infrastructure; Reports; Settings | Assigned state; additional cohort/community pages only when the corresponding duty is assigned |
| Facility Manager | Own school's facility readiness, open issues and repairs awaiting verification | Overview; My School; Assets; Work Orders; School Projects; Settings | Assigned school or explicitly assigned schools; facility operations, not unrestricted teacher or learner records |
| Teacher | Own learning progress, upcoming sessions and follow-up tasks | Overview; My Development; Courses & Guides; Training & Schedule; Settings | Own teacher profile, enrollments and feedback; conditional mentoring/community pages for assigned work |
| Technician | Assigned open jobs, overdue jobs, jobs awaiting approval/verification, and recent work orders | Overview; Work Orders; Settings | Explicitly assigned jobs, including required site/asset context |

Conditional navigation:

- State Manager with cohort coordination: Training Cohorts. With community coordination/review: Community Learning. With evidence-validation duty: Reviews. These pages show only assigned scope.
- Teacher with mentor duty: Mentoring, limited to assigned teachers/cohorts. Teacher with community facilitator duty: Community Sessions, limited to assigned centres/cohorts.
- National oversight shows summary measures from all six capabilities without exposing six operational workspaces.
- School Projects is proposed as read-only progress and handover context plus assigned evidence tasks; it does not grant budget approval.
- Settings for ordinary users contains personal profile/preferences and read-only assignment information. Workspace identity and global configuration are proposed for National Coordinator only in the demo. Scope and duties cannot be self-assigned there.

### Technician overview and work detail

Statistics are derived only from assigned jobs: open jobs, overdue jobs, awaiting approval, and awaiting verification. Recent work orders are ordered by latest activity and show ID, task, site, priority, stage, due date and a View action. Provide a scoped empty state when no work is assigned.

The work-order detail includes the site name and location, assigned asset, reported issue, relevant service history, due date, diagnosis/quote fields, repair evidence and verification feedback. Site labels do not become unrestricted school-profile links. The technician cannot dispatch themselves, approve their quote, browse other technicians' jobs, or close their own repair as independently verified.

Energy audits and commissioning tasks assigned to technicians appear as typed Work Orders, keeping the three-item sidebar. Planning and installation-option approval remain with the State Manager.

## Proposed responsibility mapping

The user has approved the principle of assigned duties. Exact action ownership below remains a proposed operating model for this demonstration.

| Existing role or responsibility | V2 owner | Boundary |
| --- | --- | --- |
| National coordinator | National Coordinator | Summary oversight, escalations and assigned national reviews |
| State manager | State Manager | State delivery, assignment and approval within scope |
| Facility manager | Facility Manager | Facility reporting, own-school updates and assigned repair verification |
| Technician | Technician | Assigned diagnosis, quote, technical work and evidence |
| Evidence verifier | State Manager with validation duty; Facility Manager for repair closeout | Different person from the submission being reviewed; scoped assignment required |
| Teacher | Teacher | Own learning and participation |
| Mentor | Teacher with mentoring duty | Assigned mentees/cohorts only; cannot assess own practicum |
| Auroch manager | State Manager for planning/approval; Technician for field delivery | Split responsibility rather than mapping the old role wholesale |
| Essence coordinator | State Manager with cohort coordination duty | Assigned centre/cohorts only |
| Community facilitator | Teacher with community facilitation duty | Assigned community centres/cohorts only |
| Community reviewer | State Manager with community review duty | Assigned transition reviews; no automatic access to safeguarding details |

### Proposed workflow sequences

1. **Program results:** State Manager assigns a corrective action and submits evidence → a different assigned State Manager validates → National Coordinator receives aggregate status or an assigned escalation. Cross-state validation needs explicit review scope rather than full access to another state.
2. **Maintenance:** Facility Manager reports issue → State Manager dispatches → assigned Technician submits diagnosis/quote → State Manager approves → Technician submits repair evidence → Facility Manager verifies repair at their school. Escalations return to State Manager. Closure updates asset readiness only after verification.
3. **Teacher development:** Teacher completes learning → a different Teacher assigned as mentor records observation and feedback → mentor schedules and completes follow-up. The observed teacher can view feedback but cannot change it.
4. **Energy delivery:** assigned Technician records site audit → State Manager approves installation option → Technician submits commissioning evidence → assigned Facility Manager records facility acceptance → assigned State Manager validates commissioning before the installation becomes operational. This acceptance-then-validation sequence is confirmed by the user. Facility acceptance alone must not be described as qualified independent electrical inspection.
5. **Essence training:** assigned State Manager enrolls/manages cohort → assigned mentor records attendance and practicum assessment → a different authorized reviewer confirms completion → Teacher sees their own completion and follow-up. Attendance and completion records are participant-linked, not a single editable cohort total standing in for every teacher.
6. **Community learning:** assigned Teacher facilitator reviews referral/enrollment and records delivery/progression evidence → assigned State Manager reviewer validates transition. General users see permitted aggregates rather than learner case detail.

A person may participate in multiple steps but cannot verify the submission they authored. This requires submission author IDs, review assignments and stage history, not a single “last role” string. If no eligible reviewer exists, the record stays awaiting assignment; the app must not silently grant access or auto-complete it.

## Decisions still needing confirmation

The following do not block this planning document, but should be settled before their respective implementation phases:

- **Scope cardinality:** proposed default is one state per State Manager and one school per Facility Manager, while the data model supports explicit multiple assignments. Technicians may receive jobs across states; a job assignment grants job context only.
- **Independent verification:** the energy acceptance-then-validation sequence is confirmed. The five-role demo can assign a different person to review, but that does not establish independent verifier accreditation or production governance. The proposed maintenance closure sequence remains part of the action-matrix review.
- **Safeguarding — confirmed:** do not expose safeguarding case details or invent a referral workflow under the five roles. Keep a synthetic restricted/unavailable state until ownership and access are explicitly defined. Community learning itself remains in scope.
- **Workspace administration:** National Coordinator ownership of demo workspace branding/configuration is proposed, not inferred from national reporting authority. Real account provisioning is out of scope.
- **Revised visual designs:** no new Figma frame was supplied with this feedback. Use the approved current design system for planning; obtain updated role-specific frames before final visual implementation if they are intended to supersede it.

## Build phases

### Phase 1 Policy and fixtures

Finalize the role/page/action matrix and proposed workflow ownership. Add stable role IDs and sample user identities with assignments. Keep five role types but include extra sample people within those types when needed to demonstrate independent review, a mentor, and a community facilitator. Five roles does not mean only five people.

Define named capability checks for viewing, editing, dispatching, submitting, approving, verifying and exporting. Add shared helpers for permitted routes, records and fields. Create fixtures for an assigned job, an unassigned job, a job belonging to another technician, two state scopes, two schools, mentor assignments and separate submitter/reviewer identities.

Exit condition: policy tests describe each permitted and denied operation before the UI depends on them.

### Phase 2 Identity and navigation

Replace the unrestricted module selector with the combined role-specific sidebar. Select the landing route from the active user. Remove “Use this role” shortcuts from record screens. Put account switching and reset in a distinct presenter/demo control rather than treating them as user administration.

On user switch, discard or isolate unsaved UI state, clear search/results, selections, filters and open dialogs, and route to an allowed overview. Old deep links must resolve only if authorized; otherwise show a neutral unavailable state with an allowed destination. Do not briefly render restricted record content before the check runs.

Exit condition: all five roles receive the expected shell, and the Technician has exactly the three agreed navigation entries.

### Phase 3 Scope every read surface

Apply the shared policy to lists, detail pages, maps, KPI counts, search, notification summaries, evidence previews, report rows, selected-row CSV exports and print output. The national summary query is separate from operational detail access: national aggregate permission must not accidentally become permission to browse every underlying row.

Filter options are generated from permitted scope. Assigned-job views expose a deliberate subset of linked asset/site fields. Evidence access follows the parent record and any field restrictions.

Exit condition: denied records cannot be discovered through another UI surface or exported through a report.

### Phase 4 Role dashboards and workflows

Build Technician first as the review slice: overview metrics, recent jobs, assigned work-order detail and personal settings. Review it before applying the pattern to Facility Manager, State Manager, Teacher and National Coordinator dashboards.

Replace role-name workflow ownership with capability, assignment, identity and stage checks. Validate all mutations including draft saves, new issues, project decisions, attachments, returns and completion. Preserve the six connected journeys using the proposed responsibility mapping, with separate users for independent review.

Exit condition: each journey completes through authorized actors and rejects self-review, wrong-scope edits and unassigned work.

### Phase 5 Storage migration and regression

Introduce a new schema version and explicit migration. Preserve legacy record IDs, evidence and audit text. Keep old actor labels as historical labels; never invent user authorship for old submissions. Legacy records with ambiguous ownership become unassigned and read-only until assigned by an authorized demo manager.

Do not map ambiguous Auroch, Mentor or verifier accounts blindly to broad access. Migrate simple role preferences where possible and require selection of a valid sample identity otherwise. Keep a recovery copy of existing demo data before migration and offer an explicit reset path. Revalidate queued changes under current assignments when simulated sync runs; revoked access must not restore old permissions through the queue.

Exit condition: existing browser data is either safely migrated or recoverable, and new fixtures remain deterministic for testing.

### Phase 6 Review and handoff

Update demo scripts, README, settings descriptions and implementation status. Verify desktop and 390 px layouts, keyboard navigation, empty/denied states, role switching, refresh persistence and all six journeys. Summarize remaining production gaps without implying client-side policy provides real security.

No production backend, real user invitations, real safeguarding data, external integrations, deployment or Figma/deck deliverables are included in this V2 browser milestone.

## Expected code changes

| Area | Planned change |
| --- | --- |
| New access policy and sample-user modules | Role IDs, capabilities, scoped assignments, identity and permission helpers |
| `src/domain.js` | Identity-based workflow rules, structured assignments, revised fixtures and ownership |
| `src/app.js` | Role-specific shell, route guards, scoped reads/actions, removal of inline role escalation |
| `src/overview.js` and overview styles | Role-specific metrics, national aggregate view and technician recent jobs |
| `src/settings.js` | Personal versus workspace permissions; remove self-service scope/role assignment |
| `src/store.js` | Versioned migration, identity persistence, legacy records and queue handling |
| `src/page-copy.js` | Clear short subtitles matching each user's task |
| `src/tables.js` integration points | Only authorized rows/fields reach sorting, selection, export and print |
| Tests and docs | Permission matrix tests, migration fixtures, cross-role journeys and updated scripts |

Retain existing Align typography, spacing, controls, cards and table structure. Domain modules can remain internal code/data boundaries even though the interface no longer exposes them as six freely selectable workspaces.

## Acceptance checklist

- Exactly five primary roles; specialist duties do not appear as extra roles in the account switcher.
- No unrestricted module selector, role escalation button or self-assignment of geographic scope.
- Technician sees only Overview, Work Orders and Settings, with only assigned jobs and necessary linked context.
- State Manager cannot browse another state's records without a narrowly assigned review permission.
- Facility Manager cannot browse other schools; Teacher cannot browse other teachers unless assigned as mentor.
- Mentor cannot assess their own work; reviewers cannot verify their own submissions.
- Energy commissioning remains pending until Facility Manager acceptance and subsequent State Manager validation are both recorded.
- Safeguarding case details remain unavailable through pages, direct links, search, evidence, reports and exports.
- National Coordinator sees national aggregates and only authorized supporting review details.
- Direct URLs, search, notifications, evidence, reports, CSV and print obey the same policy as navigation.
- KPI totals reconcile with the authorized underlying records; no historical trend is invented without history.
- Switching users removes previous user's selected rows, dialog content, filters and unsaved form state from view.
- Each of the six capability journeys still has a complete, demonstrable issue/action/evidence/review/result sequence.
- Migration preserves old evidence/history and does not guess missing ownership.
- Existing workflow/table behavior is regression-tested alongside positive and negative access cases.
- Demo restrictions are clearly presented as a browser simulation; real data security awaits a backend milestone.

## Recommended review order

Approve the proposed page/action matrix and remaining ownership decisions. Then review the Technician slice first, followed by Facility Manager and State Manager to validate the full maintenance handoff. Review Teacher, specialist learning duties and National Coordinator last, once the shared policy and scoped summary queries are established.
