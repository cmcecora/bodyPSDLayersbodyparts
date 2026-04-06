# Roadmap: Body Part Directory — Milestone 1

## Overview

Milestone 1 refactors a 7K-line monolithic HTML file into a distributable, framework-agnostic Web Component (`<body-map-explorer>`). The work proceeds in six phases: standing up the build system and extracting assets first, then rebuilding the visual model, wiring up the sidebar and panels, adding the data layer and modal, defining the public component API, and finally applying polish, accessibility, back-view artwork, and performance tuning. Every subsequent phase depends on Phase 1's build foundation.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Scaffolding & Asset Extraction** - Set up Vite + Lit + TypeScript build pipeline and extract all base64 assets into external files (completed 2026-03-29)
- [x] **Phase 2: Core SVG Body Model** - Build the `<body-map-model>` sub-component with organ layers, hit areas, hover/click interaction, and external image loading (completed 2026-04-06)
- [ ] **Phase 3: Body Systems Sidebar & Detail Panel** - Build `<body-map-sidebar>` and `<body-map-detail-panel>` with bidirectional organ-to-system selection
- [ ] **Phase 4: Data Layer, Disease/Symptom Panels & Modal** - Implement lazy per-body-part JSON loading, disease/symptom lists with search, and the organ detail modal
- [ ] **Phase 5: Web Component API** - Build the `<body-map-explorer>` orchestrator with its full public API (attributes, properties, events, dual data mode)
- [ ] **Phase 6: Polish, Back View & Performance** - Accessibility, keyboard nav, mobile layout, visual polish, back-view artwork, and performance profiling

## Phase Details

### Phase 1: Scaffolding & Asset Extraction

**Goal**: The project runs on a modern build pipeline and all base64 assets are external files ready to be consumed by the component
**Depends on**: Nothing (first phase)
**Requirements**: BUILD-01, BUILD-02, BUILD-03, BUILD-04, BUILD-05
**Success Criteria** (what must be TRUE):

1. `npm run dev` starts a hot-reloading development server that serves the component
2. `npm run build` outputs a single distributable Web Component bundle under 500 KB (component shell only, no image data)
3. All organ PNGs exist as separate WebP files in the `src/assets/` directory — zero base64 strings remain in HTML or JS source
4. A developer can edit a component file and see the change reflected in the browser without a manual refresh
5. The monolithic HTML file is no longer the development artifact — the Vite project is the canonical source
   **Plans:** 2/2 plans complete

Plans:

- [x] 01-01-PLAN.md — Scaffold Vite + Lit + TS build pipeline with component shell and CSS design tokens
- [x] 01-02-PLAN.md — Extract base64 images to WebP, convert data files to JSON, validate production build

### Phase 2: Core SVG Body Model

**Goal**: Users can see the anatomical body diagram and interact with organ regions through hover and click
**Depends on**: Phase 1
**Requirements**: MODEL-01, MODEL-02, MODEL-03, MODEL-04, MODEL-05, MODEL-06, MODEL-07
**Success Criteria** (what must be TRUE):

1. All 20+ organ layers render correctly inside the SVG body model sub-component, images loaded from external files
2. Hovering an organ shows a blue highlight overlay and drop-shadow — removing the cursor removes the effect
3. Clicking an organ toggles its selection; multiple organs can be selected simultaneously
4. The gender toggle switches between male and female reproductive organ layers
5. The view toggle switches between the organs view and the body sections view
   **Plans**: 3 plans (2 complete + 1 gap closure)
   **UI hint**: yes

Plans:

- [x] 02-01-PLAN.md — Set up Vitest, extract the silhouette asset, and define typed organ/section datasets
- [x] 02-02-PLAN.md — Implement `<body-map-model>` with SVG layers, hover/click selection, and view/gender toggles
- [x] 02-03-PLAN.md — Fix hit-area path alignment and add green sections background (gap closure from UAT)

### Phase 3: Body Systems Sidebar & Detail Panel

**Goal**: Users can explore body systems through the left sidebar and see system descriptions, with the body model reflecting system selections bidirectionally
**Depends on**: Phase 2
**Requirements**: SYSTEM-01, SYSTEM-02, SYSTEM-03, SYSTEM-04, SYSTEM-05
**Success Criteria** (what must be TRUE):

1. The left sidebar displays all 11 body systems with color dots and thumbnails
2. Clicking a system in the sidebar highlights all organs mapped to that system in the body model
3. Clicking an organ in the body model activates the corresponding system in the sidebar
4. The right detail panel shows the selected system's description and thumbnail
5. Deselecting a system (clicking it again or clicking elsewhere) clears all system-driven highlights and collapses the detail panel
   **Plans**: 2 plans
   **UI hint**: yes

Plans:

- [ ] 03-01-PLAN.md — Define the typed system dataset plus sidebar and detail-panel component contracts
- [ ] 03-02-PLAN.md — Wire explorer-owned system state across the sidebar, body model, and detail panel

### Phase 4: Data Layer, Disease/Symptom Panels & Modal

**Goal**: Users can click a body part and see related diseases and symptoms loaded on demand, with a modal for detailed body-section exploration
**Depends on**: Phase 3
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, MODAL-01, MODAL-02, MODAL-03, MODAL-04
**Success Criteria** (what must be TRUE):

1. Selecting a body part displays its related diseases in a scrollable list — data loads only when that part is first selected (not upfront)
2. Selecting a body part displays its related symptoms in a scrollable list with the same lazy-load behavior
3. A search/filter input on the disease and symptom lists narrows results in real time with debounced input
4. Clicking a body section opens a modal positioned relative to the clicked region, showing a skeleton loader while data fetches
5. The modal can be dismissed by clicking outside it or pressing Escape
6. Data is split into per-body-part JSON files; the network tab shows only the file(s) for selected parts loading on demand
   **Plans**: TBD
   **UI hint**: yes

### Phase 5: Web Component API

**Goal**: The `<body-map-explorer>` custom element works as a drop-in component in any framework with a defined public API for external control and event communication
**Depends on**: Phase 4
**Requirements**: API-01, API-02, API-03, API-04, API-05
**Success Criteria** (what must be TRUE):

1. `<body-map-explorer>` can be dropped into a plain HTML page with a `<script type="module">` tag and works fully standalone with bundled data
2. A host app can pass organ data via attributes/properties and receive `body-part-selected`, `body-part-deselected`, and `system-selected` CustomEvents
3. A host app can programmatically set selected body parts by writing to the component's property API
4. Setting the `asset-base` attribute redirects all image loads to the specified URL prefix, enabling CDN or custom asset hosting
5. The component operates in dual data mode: bundled JSON data used by default, external data accepted via props when provided
   **Plans**: TBD

### Phase 6: Polish, Back View & Performance

**Goal**: The component is accessible, visually professional, mobile-responsive, includes back-view artwork, and loads within the performance budget
**Depends on**: Phase 5
**Requirements**: UX-01, UX-02, UX-03, UX-04, UX-05, BACK-01, BACK-02, BACK-03, PERF-01, PERF-02, PERF-03
**Success Criteria** (what must be TRUE):

1. A keyboard-only user can tab through body systems, navigate organs with arrow keys, and select with Enter — no mouse required
2. A screen reader announces the selected body part name and its body system membership on selection
3. The component layout adapts correctly at any container width using container queries (not media queries)
4. The front/back rotation button animates with a CSS 3D flip and the back view renders correctly for the female green body model (body sections tab)
5. Initial page load (component shell + critical assets) is under 500 KB; only viewport-visible organ images load on first paint
6. No repeated DOM queries in hot interaction paths — cached references used throughout
   **Plans**: TBD
   **UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase                                         | Plans Complete | Status          | Completed  |
| --------------------------------------------- | -------------- | --------------- | ---------- |
| 1. Scaffolding & Asset Extraction             | 2/2            | Complete        | 2026-03-29 |
| 2. Core SVG Body Model                        | 3/3 | Complete   | 2026-04-06 |
| 3. Body Systems Sidebar & Detail Panel        | 0/2            | Not started     | -          |
| 4. Data Layer, Disease/Symptom Panels & Modal | 0/TBD          | Not started     | -          |
| 5. Web Component API                          | 0/TBD          | Not started     | -          |
| 6. Polish, Back View & Performance            | 0/TBD          | Not started     | -          |
