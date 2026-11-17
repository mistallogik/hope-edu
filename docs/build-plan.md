# HOPE EDU browser demonstration build plan

Prepared 16 November 2026. First milestone: a working browser demonstration, selected by the user. The demonstration presents six connected proposals using ONSA's design language and synthetic data. This plan defines the implementation scope before screen design and coding.

## Requirements and working decisions

The supplied HOPE_EDU_Six_Proposal_Figma_Brief.docx defines the six proposals, 26 screen groups, desktop and mobile sizes, provider attribution, six complete journeys, and supporting presentation deliverables. The user's explicit direction establishes ONSA as the design reference and a working browser demonstration as the first milestone.

The architecture, role permissions, seed dataset, thresholds, and delivery sequence below are proposed implementation defaults. They are not approved government operating rules. Government definitions, integrations, and production access policies remain dependencies.

| Decision | First milestone |
| --- | --- |
| Product structure | One application shell with six modules and shared school, evidence, task, and audit records |
| Primary audience | National coordinator and implementation partners, with simulated operational roles |
| Delivery | Locally runnable browser application; remote hosting is a separate delivery decision |
| Data | Synthetic fixtures, labeled throughout; no real learner or protected school records |
| Persistence | Browser-local records and attachments, retained after refresh; reset restores the demonstration |
| Identity | Clearly labeled demo role switcher; no claim of real authentication or server-enforced security |
| Screen targets | 1440 px desktop and 390 px mobile, with usable intermediate widths |
| Mobile priorities | Maintenance closeout, mentor observation, and community outreach |
| Theme | Light surfaces with green accents; semantic warning and critical colors remain distinct |
| Integrations | Local adapters with simulated responses and documented replacement points |
| Offline | Explicit offline simulation with queued changes and sync feedback; full offline application loading is a later decision |
| Completion | All six scripted journeys work, update shared records, persist, and can be reset |

## Product structure

The desktop shell contains a module switcher, module navigation, location scope, reporting period, notifications, demo role selector, and visible demonstration label. Provider attribution appears in each module header. Mobile uses a compact header, navigation drawer, and prominent primary action.

Shared destinations: assigned actions, evidence, school directory, notifications, and demo controls. These reuse filtered views of the same records rather than separate copies of module data.

Location scope follows federal, state, LGA, and school. Community centres and the Essence training centre are separate site types; community records need not belong to a school. Scope and period remain visible on reporting views. Detail pages retain a breadcrumb back to their filtered list.

| Module | Navigation | Provider attribution |
| --- | --- | --- |
| Program Intelligence | Overview, State scorecards, DLR readiness, Actions | Software by Hsry |
| SchoolOps | Infrastructure, Schools, Assets, Work orders, Grants and projects | Software by Hsry |
| TeacherOps | Teachers, Learning, Observations, Outcomes | Software by Hsry |
| Auroch | Sites, Energy passports, Installation options, Projects, Monitoring | Infrastructure delivery by Auroch; software by Hsry |
| Essence | Training centre, Cohorts, Schedule, Practicum, Follow-up | Learning delivery by Essence; software by Hsry |
| Open Classroom | Centres, Referrals and enrollment, Delivery, Progress and transition | Community learning by The Open Classroom; software by Hsry |

## Screen inventory

These 26 entries map to the brief's named screen groups. Detail tabs, drawers, forms, confirmation dialogs, and workflow states belong to these groups and increase the eventual view count.

| ID | Screen group | Required interaction and result |
| --- | --- | --- |
| PI01 | National command centre | Review eight placeholder pillars and 28 placeholder DLRs; filter map and queues; open a state or DLR |
| PI02 | State scorecard | Drill into responsible unit, reporting gap, and related action |
| PI03 | DLR evidence readiness | Inspect requirements; add demonstration evidence; submit; review; return or validate |
| PI04 | Action tracker | Assign owner and deadline; escalate; submit closure evidence; verify closure |
| SO01 | State infrastructure map | Filter condition and asset status; switch map/list; open a school |
| SO02 | School facility profile | Inspect infrastructure, ICT, energy, connectivity, and WASH with linked records |
| SO03 | Asset registry and health record | Search assets; open a QR-addressable record; inspect timeline and warranty |
| SO04 | Work order | Report failure; dispatch technician; record quote; approve; attach repair proof; verify closeout |
| SO05 | Grants and construction | Review maintenance expense; approve a request; record milestone evidence and handover |
| TO01 | Teacher development profile | Inspect training, competency, coaching history, and next action |
| TO02 | Courses and lesson guides | Browse content; assign training; demonstrate download availability and progress |
| TO03 | Mentor observation | Complete mobile rubric; save draft; submit feedback; create follow-up |
| TO04 | Aggregate outcomes | Filter school/LGA and period; inspect sample sizes and metric definitions |
| AU01 | Site selection | Filter infrastructure priorities; select a site and start an audit |
| AU02 | Energy passport | Record load inventory, supply performance, risk, and connectivity |
| AU03 | Installation tier selector | Compare illustrative options, estimates, and constraints; save chosen option |
| AU04 | Construction and commissioning | Progress milestones; attach proof; review commissioning checklist |
| AU05 | Monitoring and service | Inspect simulated telemetry and service status; open the linked asset or work order |
| ES01 | Training hub microsite | Explore facilities, trainers, and course catalogue; open cohort information |
| ES02 | Cohort enrollment and schedule | Check prerequisites; enroll synthetic teacher; record attendance |
| ES03 | Practicum observation | Record mentor rubric and feedback linked to teacher and cohort |
| ES04 | Completion and follow-up | Review completion requirements; record result; assign post-training follow-up |
| OC01 | Community centre map | Open approved demonstration location and view associated cohort |
| OC02 | Referral and enrollment | Register coded learner; record minimal support needs; enroll into a cohort |
| OC03 | Attendance and materials | Record instructor/session attendance and learning-material delivery checklist |
| OC04 | Progress and transition | Review progression evidence; show restricted referral handling; validate transition |

## Proposed role permissions

Permissions are simulated consistently in navigation and action handlers. A production version must enforce authorization on the server. Role switching is a demonstration control, not impersonation of real staff.

| Role | Scope | Create or update | Approval authority in demo |
| --- | --- | --- | --- |
| National coordinator | All demonstration locations | National actions and assignments | Reviews national readiness; does not automatically verify all underlying evidence |
| State program manager | Assigned state | State reporting, corrective actions, infrastructure requests | State submissions and repair quotes |
| LGA officer | Assigned LGA | School issues, reporting drafts, referrals | Reviews completeness; forwards for approval |
| School focal person | Assigned school | Facility updates, issue reports, supporting evidence | No budget or independent closure approval |
| Technician | Assigned work orders | Diagnosis, quote, repair notes, photographs | Requests verification; cannot verify own repair |
| Evidence verifier | Assigned review queue | Review notes and requests for correction | Validates evidence and closure; cannot approve own submission |
| Teacher | Own synthetic profile | Training progress and learning activity | No cohort or observation validation |
| Mentor or trainer | Assigned teachers/cohorts | Attendance, observations, feedback, follow-up | Submits practicum assessment |
| Auroch project manager | Assigned infrastructure sites | Audit, design option, construction milestones | Submits commissioning for independent review |
| Essence coordinator | Assigned training centre/cohorts | Enrollment, schedule, completion review | Confirms cohort completion against demo criteria |
| Community facilitator | Assigned centres/cohorts | Enrollment, attendance, progression evidence | Submits transition request |
| Community reviewer | Assigned community records | Progression review and restricted referral handling | Validates transition; handles referral details separately |

Approver identity is recorded on each decision. Missing authority produces an explanatory restricted state, not a silently disabled control. The same role can have more than one location assignment.

## Shared data model

Every mutable record has an ID, created and updated timestamps, owning organization, scope, and version. Workflow events also capture actor, previous stage, new stage, reason, and evidence references. Provider identity is separate from geographic scope.

| Entity group | Records and relationships |
| --- | --- |
| Organization and access | Organization, user, role assignment, location scope |
| Geography and sites | State, LGA, site, school profile, community centre, training centre |
| Program reporting | Pillar → DLR → reporting-period submission; each submission references requirements, evidence, review, and corrective actions |
| Assets and maintenance | Site → asset → health events and work orders; work order → diagnosis, quote, decision, repair proof, verification |
| Grants and construction | School → grant/project → budget requests, milestones, handover evidence |
| Teacher development | Teacher → training enrollments, competency records, observations, coaching actions |
| Training delivery | Course → cohort → enrollment, schedule, attendance, practicum, completion, follow-up |
| Infrastructure delivery | Site → energy passport → option selection → installation project → commissioning → asset |
| Community learning | Centre → cohort → coded enrollment → sessions, aggregate progress, progression evidence, transition |
| Restricted referrals | Separate referral records and access rules; ordinary cohort views show only permitted status information |
| Shared operations | Action, evidence attachment, review decision, audit event, notification, queued mutation |

SchoolOps and Auroch reference the same asset ID. Essence and TeacherOps reference the same synthetic teacher ID and observation record. Program reporting references approved operational evidence explicitly; completing a work order never automatically certifies a DLR.

Reports derive totals from the underlying filtered records. Outcomes are illustrative aggregates; the demo must not imply that course completion proves a causal improvement in learning outcomes.

## Workflow behavior

| Record | Proposed stages |
| --- | --- |
| Evidence submission | Draft → Submitted → In review → Validated, or Returned → resubmitted |
| Corrective action | Open → Assigned → In progress → Awaiting verification → Closed; escalation is a separate flag |
| Work order | Reported → Triaged → Assigned → Quote pending → Approval pending → Approved → In progress → Verification pending → Closed |
| Installation | Audit draft → Audit reviewed → Option selected → Approved → Installing → Commissioning review → Operational |
| Teacher development | Training assigned → Training completed → Observation scheduled → Observed → Follow-up due → Follow-up completed |
| Cohort enrollment | Pending prerequisites → Enrolled → Attending → Practicum pending → Completion review → Completed or Follow-up required |
| Community journey | Referred → Enrollment reviewed → Enrolled → Participating → Progression review → Transition pending → Transition validated |

Return/rejection requires a reason. Submission preserves the submitted evidence version; later amendments are visible. Closing a record requires its checklist and reviewer decision. Returning a review preserves existing evidence and creates an audit event. Repeated clicks cannot create duplicate decisions or transitions.

Workflow stage, severity, asset condition, evidence readiness, and sync status remain separate fields. Proposed demonstration severity: normal means no overdue required action; warning means an action is due within seven days or a required draft item is missing; critical means an action is overdue or an asset failure is marked service-interrupting. These are illustrative rules only and must be labeled in the metric definition panel. Asset condition uses operational/degraded/failed independently.

Dates and overdue indicators use a fixed, visible demonstration reporting date so the scenario remains reproducible. Event timestamps still record the actual interaction time. Date labels distinguish those meanings.

## Six journey acceptance criteria

### Program Intelligence

Given the national coordinator overview, opening the seeded late DLR preserves period and state context. The detail shows its responsible unit, missing evidence, and explicit readiness rule. A manager assigns a corrective action with an owner and deadline; the assignee records evidence; a different verifier accepts it. The action closes and linked readiness updates only when its defined requirements are satisfied. The audit history contains every transition. Returning the evidence leaves the action open and shows the correction reason.

### SchoolOps

Given a failed inverter on the infrastructure map, opening its school and asset preserves the same asset identity. A school focal person reports the failure; a technician records diagnosis and quote; a manager approves; the technician adds repair proof; a verifier closes the work order. Closure creates an asset health event and updates map/list status. An incomplete closeout cannot be submitted. A returned quote or failed repair verification keeps the case unresolved.

### TeacherOps

Given a teacher profile, assigning and completing a course updates its training history. A mentor opens the mobile observation, completes required rubric fields, records feedback, and schedules a follow-up. The observation appears on the same teacher record. An incomplete rubric remains a draft. Aggregate outcome views display synthetic data, denominators, and period; training completion does not automatically alter learning scores.

### Auroch

Given a selected school site, saving the audit creates its energy passport. The manager compares clearly illustrative installation tiers, records an option, and progresses construction milestones with evidence. An independent reviewer accepts commissioning only after all checklist items pass. Operational status links to the resulting SchoolOps asset. A simulated service alert opens or links a work order without creating a duplicate asset. Estimates and telemetry are labeled as demonstration values.

### Essence

Given a course and cohort, enrollment checks the seeded prerequisites. Attendance and practicum assessment contribute to a visible completion checklist. The coordinator records completion only when the demo criteria pass, and assigns follow-up. TeacherOps immediately shows the same course and practicum evidence. Missing attendance or assessment routes to Follow-up required rather than falsely showing completion.

### Open Classroom

Given a coded referral, the facilitator records minimal enrollment information and assigns a cohort. Session attendance and material delivery are saved on mobile. The reviewer inspects progression and transition evidence and records a decision. Ordinary cohort views do not reveal restricted referral details. Missing transition evidence results in a correction request. Refresh preserves the completed journey without exposing identifiable learner data.

## Browser behavior and state

Use one typed domain model and repository interface for shared records. Browser storage provides the first repository implementation; API-backed repositories can replace it later. IndexedDB is the proposed store for record and attachment persistence; lightweight UI preferences may use local storage. A schema version and seeded reset make upgrades and demonstrations predictable.

Each mutation has an ID and expected record version. The offline simulator queues changes, displays pending state, and offers sync/retry when brought online. Replaying an already applied mutation has no extra effect. A simulated conflict shows local and saved values and asks which version to keep. This demonstrates field behavior without claiming background synchronization to a real service.

Evidence supports synthetic sample files and local attachments with type/size validation, preview, and removal before submission. Define a modest attachment limit in configuration; display it in the picker. Persisted attachment failure must not leave a submission falsely marked complete. Reset removes demo records and local attachments after confirmation.

Every route has a real destination and supports direct loading. Search and filters operate on fixture data. Map and list views share selection. Until geographic data provenance is verified, map surfaces carry a visible illustrative geography label; fictional schools and centres are always identified as synthetic. A QR link targets a stable asset route; camera scanning is optional for this milestone.

Public Essence content has a distinct public layout while retaining the same typography and token foundation. Internal cohort actions stay within the role-aware application.

## Design implementation

Figma source: https://www.figma.com/design/WN3vFashMycheSXCbKpqfy/HSRY-Products---Align?node-id=204772-28484

Follow the onsa-design skill for typography and component reuse. Sharp Grotesk applies to headings and display figures; Inter applies to body and supporting UI. Preserve applicable style metrics; use −3% tracking only where a style does not define it. Verify actual font names, weights, and files before claiming fidelity.

The local reference at the original ONSA project contains semantic surfaces, status colors, spacing, and radius tokens. Its public/assets/tokens.css explicitly describes some values as sampled or inferred, so they are implementation references rather than verified Figma specifications. The user supplied Sharp Grotesk Medium 20 on 16 November 2026; the verified copy is at public/fonts/SharpGrotesk-Medium20.otf. Its PostScript name is SharpGrotesk-Medium20 and its embedded weight is 500. Use this supplied face for headings and display figures; additional weights are not supplied. The existing Nigeria geography file requires provenance checking before reuse. ONSA branding, crests, people imagery, and unrelated operational records should not be carried into HOPE EDU by default.

Build reusable shell, page header, filter bar, metric, table, map/list panel, status badge, detail tabs, evidence list, activity timeline, form, approval drawer, step tracker, empty state, notification, and offline indicator. Compose module-specific views from these shared components.

Required states: loading, no records, no filter matches, error/retry, permission restricted, field validation, draft saved, submitted, returned, approved, pending upload, sync conflict, and success. Severity uses text and icons as well as color. Provide keyboard navigation, visible focus, correctly labeled controls, modal focus handling, and readable status contrast. At 390 px, prioritize the field task and avoid desktop-only wide tables.

## Demonstration dataset

Proposed seed coverage: three states, two LGAs per state, twelve synthetic schools, eighteen synthetic teachers, twenty-four assets, six work orders, two installation projects, two teacher cohorts, two community centres, and two anonymized community cohorts. The program scaffold contains eight placeholder pillars and 28 placeholder DLRs to match the requested structure. Their names and requirements remain explicitly illustrative until supplied.

Each journey has one linked scenario with fixed IDs and complete starting records. Additional records provide normal, warning, critical, returned, empty, and permission-restricted examples. Fictional schools use obvious demonstration names and IDs. Amounts use NGN and explicit estimate labels. Provider records use distinct names while sharing the same school/site identifiers where applicable.

## Delivery backlog and gates

| Stage | Work | Exit condition |
| --- | --- | --- |
| 1 Foundation | Confirm source assets; extract targeted design references; implement shell, routes, tokens, roles, storage, fixtures, and reset | A role-aware school record loads directly, persists an edit, and resets predictably |
| 2 SchoolOps | Map/list, school profile, asset health, work order, expense approval, project handover | Complete inverter repair journey at desktop and mobile widths |
| 3 Program Intelligence | Eight/28 scaffold, scorecards, readiness, evidence reviews, actions | Complete late-DLR journey with independently verified closure |
| 4 Auroch | Audit, options, installation, commissioning, monitoring | Commissioned asset appears in SchoolOps and monitoring can open a linked service issue |
| 5 TeacherOps and Essence | Profiles, learning, cohorts, attendance, observation, practicum, completion, outcomes | Both journeys share teacher history; mobile mentoring works |
| 6 Open Classroom | Centres, referrals, coded enrollment, delivery, progress, restricted review, transition | Complete outreach journey on mobile with permission boundaries visible |
| 7 Demonstration readiness | Error states, offline simulation, cross-module consistency, accessibility, guided scripts | All six journeys pass after a fresh reset and after refresh |

SchoolOps is implemented first because it establishes reusable evidence, approvals, and asset relationships. The presentation still opens with Program Intelligence, then SchoolOps, as the brief suggests. The full browser milestone includes all six modules; stages are implementation increments, not silent scope cuts.

Following browser validation, prepare the requested executive deck, six scripts, screenshots, and dependency annotations. The Figma source/component handoff remains a separate deliverable from the brief; a browser implementation does not automatically satisfy it. Confirm its destination and whether it should mirror the final browser design when that handoff begins.

## Validation plan

Test domain transitions, required evidence, returned reviews, role restrictions, cross-module identity, computed totals, repeat submission handling, persistence, reset, and queued mutation conflict resolution. Exercise one end-to-end browser test for each journey, plus mobile versions of maintenance, mentoring, and community outreach. Test direct-route refresh, keyboard-only navigation, filtering with no matches, rejected attachments, and offline save/retry. Inspect rendered typography and layouts at 1440 px and 390 px, plus an intermediate width.

Demo acceptance requires no dead primary actions, no fabricated successful saves, no totals disconnected from records, no misleading live-data indicators, and no unmarked government metric assumptions. Verification records should distinguish automated checks from manual visual checks.

## Dependencies and open decisions

| Item | Needed for | Demo approach until resolved |
| --- | --- | --- |
| Sharp Grotesk Medium 20 | Heading and display typography | Resolved: supplied OTF is stored in public/fonts; weight 500 verified. Additional weights require separate assets if needed |
| Approved provider marks | Final branding | Text wordmarks with provider attribution |
| DLI/DLR definitions and verification rules | Authentic Program Intelligence | Clearly labeled placeholder pillars, DLRs, and readiness rules |
| Government role and approval matrix | Production authorization | Proposed demo roles above |
| Approved school IDs and geographic source | Real maps and interoperability | Synthetic IDs and labeled illustrative geography |
| Learning rubrics, materials, and completion rules | Authentic teacher/community workflows | Marked sample content and criteria |
| Infrastructure tiers, prices, and service targets | Authentic Auroch estimates and monitoring | Illustrative options, prices, and telemetry |
| Actual devices, connectivity, and language needs | Production field usability | English demo at 390 px with offline simulator |
| Referral handling and data-access policy | Production community records | Synthetic coded records and separated restricted views |
| Government APIs, exports, and data ownership | Live integration | Documented local repository adapters |
| Hosting and access audience | Shared remote demonstration | Local runnable application first |
| Figma destination and handoff depth | Figma source deliverable | Reuse source library as reference; avoid edits to ONSA/shared library |

Production work beyond this milestone includes real identity, server authorization, durable multi-user storage, object storage, operational synchronization, monitoring, deployment, backups, integration agreements, and approved data-handling controls. Those require a separate production scope and validation pass.
