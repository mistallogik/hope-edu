# HOPE EDU

A locally runnable browser demonstration connecting Program Intelligence, SchoolOps, TeacherOps, Auroch infrastructure, Essence training, and Open Classroom community learning. It uses the supplied Sharp Grotesk Medium 20 font, locally bundled Geist and DM Mono, and the HSRY Align design system.

## Run

Use Node.js 22 or newer (`.nvmrc` selects Node 22). The application has no runtime package dependencies.

```sh
git clone https://github.com/mistallogik/hope-edu.git
cd hope-edu
npm ci
npm run dev
```

Open http://127.0.0.1:4173. Set `PORT` to use a different local port. Routes use URL hashes so every record can be linked and refreshed directly.

## Explore

Choose **Start guided journey** or **Guided demo** to open one of the six seeded scenarios. On each record, choose **Use [role] role** to switch to the role responsible for the next step. Complete the form, add synthetic sample evidence where requested, and submit. Shared asset and teacher records update when the relevant stages complete.

The bottom-left profile control switches the viewing role. The Settings page contains workspace identity, display preferences, role responsibilities, asset categories, verification rules, offline simulation, simulated sync, and reset. Workspace preferences support save and discard; saved settings remain local to this browser. Records, drafts, decisions, and attached files persist in IndexedDB on the current browser and origin. Reset clears local changes and restores the synthetic dataset.

## Checks

```sh
npm ci
npm run check
npm test
```

The test suite covers all six complete workflows, role restrictions, evidence requirements, stale versions, returned reviews, attendance bounds, queue entries, derived totals, route rendering, UI submission handlers, and persistence through a simulated DOM and IndexedDB environment. These tests do not replace real-browser visual and interaction testing.

## Current scope

Implemented: six module workspaces; national/state views; school, asset, and teacher records; workflow forms; role-gated transitions; evidence previews and downloads; audit timelines; CSV exports; shared asset/teacher updates; guided journeys; local persistence; mobile CSS; offline/sync simulation; reset.

This is the initial browser demonstration, not a production system. Government pillars, results, thresholds, learning rubrics, installation estimates, telemetry, and records are explicitly illustrative. Role controls simulate authorization; they are not a security boundary. Map geography is labeled illustrative and school locations are synthetic.

Current simplifications: some screen groups reuse workflow records instead of dedicated editors; grants use a minimal approval/handover form; enrollment represents seeded cohorts and coded learners; scope controls filter data rather than enforce geographic permissions; offline behavior is a simulation rather than an offline-installable application; sync conflict resolution retains the local copy. No live APIs, real login, deployment, deck, or Figma source handoff is included in this build.

The School Operations overview has been visually checked at desktop and 390px mobile widths. The shared directory table and workflow detail styling have been checked in Brave, including numeric sorting, selection and pagination. Full visual coverage of every module, dialog and mobile table remains outstanding; native browser access became intermittent during the platform-wide pass. Automated route and workflow coverage spans all six modules.

See [the build plan](docs/build-plan.md), [demo scripts](docs/demo-scripts.md), and [implementation status](docs/implementation-status.md).

## Shared design system and tables

`src/platform.css` applies the approved typography, controls, cards, forms, badges and workflow treatments across the platform. `src/tables.js` and `src/tables.css` implement the shared Figma table structure: sortable data columns, selection per page, selected CSV export, 10/25/50 rows per page, first/previous/next/last navigation, empty states and responsive horizontal scrolling. Actions retain their original destinations. Sorting and selection reset when application filters or routes change; selected rows persist across table pages. Print previews include all filtered rows.

Reports use the same table component with locally stored file-format and download icons. Report files are CSV; PDF remains available through browser print-to-PDF from previews.

## Repository layout

- `src/`: application routes, workflow rules, IndexedDB storage, settings, and shared UI styles.
- `public/`: bundled fonts, icons, Figma assets, and illustrative geography.
- `tests/`: workflow, overview, table, and UI integration tests.
- `docs/`: scope, implementation notes, and demonstration scripts.
- `server.mjs`: local development server, bound to loopback.

GitHub Actions runs syntax checks and all tests on Node.js 22 and 24 for pushes and pull requests. There is no compilation step or deployment workflow. For static hosting, serve `index.html`, `src/`, and `public/` from the site root; root-relative asset URLs require a root-hosted site, not a GitHub Pages project subdirectory without additional configuration.

## Assets and licensing

See [asset sources](public/ASSET-SOURCES.md) and bundled third-party license files. Sharp Grotesk is a user-supplied commercial font; its inclusion does not grant redistribution rights. This repository does not assign an open-source license to the application or design assets.
