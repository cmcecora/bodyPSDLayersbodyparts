# Requirements: Body Part Directory — Milestone 1

**Defined:** 2026-03-29
**Core Value:** Make health information discovery intuitive and visual — users start from "where it hurts" and navigate a rich medical knowledge graph.

## v1 Requirements

Requirements for Milestone 1: Body Map App Refactor & Web Component. Each maps to roadmap phases.

### Build & Scaffolding

- [ ] **BUILD-01**: Project scaffolded with Vite + Lit + TypeScript build pipeline
- [ ] **BUILD-02**: All base64-encoded PNGs extracted from HTML into separate image files
- [ ] **BUILD-03**: Extracted PNGs converted to WebP format for optimized delivery
- [ ] **BUILD-04**: Development server with hot reload for component development
- [ ] **BUILD-05**: Production build outputs a single distributable Web Component bundle

### SVG Body Model

- [ ] **MODEL-01**: SVG body model renders as a Lit sub-component with all 20+ organ layers
- [ ] **MODEL-02**: Organ regions are clickable with transparent hit-area overlays
- [ ] **MODEL-03**: Hover feedback displays blue highlight overlay and drop-shadow filter
- [ ] **MODEL-04**: Click toggles organ selection (multiple simultaneous selections supported)
- [ ] **MODEL-05**: Gender toggle switches between male and female reproductive organs
- [ ] **MODEL-06**: View switching between organs view and body sections view
- [ ] **MODEL-07**: Organ images load from external files (not base64 inline)

### Body Systems Sidebar

- [ ] **SYSTEM-01**: Left sidebar displays all 11 body systems with color dots and thumbnails
- [ ] **SYSTEM-02**: Clicking a system highlights all mapped organs in the body model
- [ ] **SYSTEM-03**: Clicking an organ in the model activates the corresponding system in the sidebar
- [ ] **SYSTEM-04**: System description panel shows in the right column when a system is selected
- [ ] **SYSTEM-05**: Deselecting a system clears all system-driven organ highlights

### Disease & Symptom Panels

- [ ] **DATA-01**: Selected body part displays related diseases in a scrollable list
- [ ] **DATA-02**: Selected body part displays related symptoms in a scrollable list
- [ ] **DATA-03**: Disease and symptom lists support search/filter with debounced input
- [ ] **DATA-04**: Disease/symptom data is lazy-loaded per body part (not all upfront)
- [ ] **DATA-05**: Data files split into per-body-part JSON chunks (~100-200 KB each)

### Organ Modal

- [ ] **MODAL-01**: Clicking a body section opens a detail modal with symptoms and diseases
- [ ] **MODAL-02**: Modal positions relative to the clicked region
- [ ] **MODAL-03**: Modal displays skeleton loading state while data loads
- [ ] **MODAL-04**: Modal can be closed by clicking outside or pressing Escape

### Web Component API

- [ ] **API-01**: Full app packaged as `<body-map-explorer>` custom element using Shadow DOM
- [ ] **API-02**: Dual data mode: bundled JSON data works standalone, props/attributes accept external data
- [ ] **API-03**: Component dispatches CustomEvents for selection changes (`body-part-selected`, `body-part-deselected`, `system-selected`)
- [ ] **API-04**: Programmatic selection API: host app can set selected body parts via properties
- [ ] **API-05**: `asset-base` attribute allows host app to specify where image assets are served from

### Visual & UX Polish

- [ ] **UX-01**: Refined color palette, hover states, and selection indicators for professional look
- [ ] **UX-02**: Mobile responsive layout using container queries (works at any component width)
- [ ] **UX-03**: Keyboard navigation: tab through body systems, arrow keys through organs, Enter to select
- [ ] **UX-04**: ARIA labels on all interactive organ regions and UI controls
- [ ] **UX-05**: Screen reader announces selected body part name and system membership

### Back View

- [ ] **BACK-01**: Back view rotation works for the female green body model (body sections tab)
- [ ] **BACK-02**: Male back-view artwork sourced and integrated
- [ ] **BACK-03**: Front/back toggle animates with CSS 3D flip transition

### Performance

- [ ] **PERF-01**: Initial page load under 500 KB (excluding lazy-loaded data)
- [ ] **PERF-02**: DOM queries cached — no repeated getElementById/querySelectorAll in hot paths
- [ ] **PERF-03**: Organ images lazy-loaded (only visible viewport organs load initially)

## v2 Requirements

Deferred to Milestone 2 or later. Tracked but not in current roadmap.

### CSS Theming

- **THEME-01**: CSS custom property API for host page theming (colors, fonts, sizes)
- **THEME-02**: Dark mode support via custom properties

### NPM Distribution

- **DIST-01**: Published as npm package with TypeScript types
- **DIST-02**: CDN script tag fallback for non-npm environments
- **DIST-03**: README with usage examples for Angular, React, Next.js, plain HTML

### Advanced Features

- **ADV-01**: Animated transitions between front/back views
- **ADV-02**: Zoom/pan on body model regions
- **ADV-03**: Body part comparison view (side-by-side)
- **ADV-04**: Print-friendly layout for selected body parts and conditions

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature                         | Reason                                                                 |
| ------------------------------- | ---------------------------------------------------------------------- |
| 3D WebGL body model             | Massive complexity, accessibility nightmare, mobile performance issues |
| AI symptom checker / diagnosis  | Medical liability risk, regulatory issues — belongs in host app        |
| User accounts / personalization | Scope creep — host app concern, not component concern                  |
| Inline content editing          | Component is viewer/selector, not CMS                                  |
| Built-in analytics              | Privacy concern — dispatch events, let host app handle tracking        |
| Directory pages (Next.js)       | Milestone 2 — this milestone is component refactor only                |
| Database / PostgreSQL setup     | Milestone 2 — this milestone uses bundled JSON data                    |
| Location pages (600K)           | Milestone 3 — requires directory infrastructure first                  |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase   | Status  |
| ----------- | ------- | ------- |
| BUILD-01    | Phase 1 | Pending |
| BUILD-02    | Phase 1 | Pending |
| BUILD-03    | Phase 1 | Pending |
| BUILD-04    | Phase 1 | Pending |
| BUILD-05    | Phase 1 | Pending |
| MODEL-01    | Phase 2 | Pending |
| MODEL-02    | Phase 2 | Pending |
| MODEL-03    | Phase 2 | Pending |
| MODEL-04    | Phase 2 | Pending |
| MODEL-05    | Phase 2 | Pending |
| MODEL-06    | Phase 2 | Pending |
| MODEL-07    | Phase 2 | Pending |
| SYSTEM-01   | Phase 3 | Pending |
| SYSTEM-02   | Phase 3 | Pending |
| SYSTEM-03   | Phase 3 | Pending |
| SYSTEM-04   | Phase 3 | Pending |
| SYSTEM-05   | Phase 3 | Pending |
| DATA-01     | Phase 4 | Pending |
| DATA-02     | Phase 4 | Pending |
| DATA-03     | Phase 4 | Pending |
| DATA-04     | Phase 4 | Pending |
| DATA-05     | Phase 4 | Pending |
| MODAL-01    | Phase 4 | Pending |
| MODAL-02    | Phase 4 | Pending |
| MODAL-03    | Phase 4 | Pending |
| MODAL-04    | Phase 4 | Pending |
| API-01      | Phase 5 | Pending |
| API-02      | Phase 5 | Pending |
| API-03      | Phase 5 | Pending |
| API-04      | Phase 5 | Pending |
| API-05      | Phase 5 | Pending |
| UX-01       | Phase 6 | Pending |
| UX-02       | Phase 6 | Pending |
| UX-03       | Phase 6 | Pending |
| UX-04       | Phase 6 | Pending |
| UX-05       | Phase 6 | Pending |
| BACK-01     | Phase 6 | Pending |
| BACK-02     | Phase 6 | Pending |
| BACK-03     | Phase 6 | Pending |
| PERF-01     | Phase 6 | Pending |
| PERF-02     | Phase 6 | Pending |
| PERF-03     | Phase 6 | Pending |

**Coverage:**

- v1 requirements: 42 total
- Mapped to phases: 42
- Unmapped: 0

---

_Requirements defined: 2026-03-29_
_Last updated: 2026-03-29 after roadmap creation — traceability populated, coverage corrected from 30 to 42_
