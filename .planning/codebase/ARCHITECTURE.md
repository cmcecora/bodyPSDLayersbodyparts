# Architecture

**Analysis Date:** 2026-04-07

## Pattern Overview

**Overall:** Stateful root web component with event-driven child components, static domain catalogs, and asset-backed data loading.

**Key Characteristics:**
- `src/body-map-explorer.ts` is the only stateful application shell. It owns selection state, active system/view/gender state, async data maps, live announcements, and modal state.
- Child components in `src/body-map-model.ts`, `src/body-map-sidebar.ts`, `src/body-map-detail-panel.ts`, `src/body-map-data-panel.ts`, and `src/body-map-modal.ts` communicate upward with bubbling `CustomEvent`s and receive all shared state via properties.
- Runtime content is driven by lookup tables and assets rather than a backend API: domain definitions live in `src/data/*.ts`, while shipped images and JSON live in `public/assets/` and `public/data/`.

## Layers

**Build and Runtime Layer:**
- Purpose: Build the library and provide a local dev harness.
- Location: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- Contains: Vite library build config, TypeScript compiler settings, npm scripts, and a dev page that mounts `<body-map-explorer>`.
- Depends on: `src/body-map-explorer.ts` as the library entry and `public/` for copied runtime assets.
- Used by: Local development, `npm run build`, and downstream consumers of the generated bundle in `dist/`.

**Application Shell Layer:**
- Purpose: Coordinate all shared application state and compose the four-column layout plus modal.
- Location: `src/body-map-explorer.ts`
- Contains: Root `LitElement`, shared reactive state, async loading orchestration, event handlers, live-region announcements, and view-specific branching.
- Depends on: All child components, domain catalogs in `src/data/`, and the `DataProvider` abstraction from `src/data/data-service.ts`.
- Used by: `index.html`, the Vite library build, and any external page that renders `<body-map-explorer>`.

**Interactive Model Layer:**
- Purpose: Render the anatomical SVG scene and translate direct model interactions into semantic events.
- Location: `src/body-map-model.ts`
- Contains: Organs view, Organs 2 view, front/back sections scene, roving-tabindex keyboard interaction, gender toggle, view toggle, and highlight overlay rendering.
- Depends on: `src/data/organs.ts`, `src/data/sections.ts`, `src/data/body-part-highlight-regions.ts`, and `src/styles/tokens.css.ts`.
- Used by: `src/body-map-explorer.ts`.

**Panel and Modal Presentation Layer:**
- Purpose: Render the sidebar, detail panel, diseases/symptoms panel, and contextual modal without owning application-wide state.
- Location: `src/body-map-sidebar.ts`, `src/body-map-detail-panel.ts`, `src/body-map-data-panel.ts`, `src/body-map-modal.ts`
- Contains: Visual panels, local UI state like expanded/collapsed sections and search input debounce, and retry/close/toggle events.
- Depends on: Design tokens from `src/styles/tokens.css.ts` plus strongly typed data passed in from `src/body-map-explorer.ts`.
- Used by: `src/body-map-explorer.ts`.

**Domain Catalog and Mapping Layer:**
- Purpose: Define the canonical IDs, labels, thumbnails, image filenames, hit areas, and crosswalk tables that the UI depends on.
- Location: `src/data/body-parts.ts`, `src/data/organs.ts`, `src/data/systems.ts`, `src/data/sections.ts`, `src/data/section-mapping.ts`, `src/data/body-part-modal-anchor.ts`, `src/data/body-part-highlight-regions.ts`
- Contains: Immutable arrays, reverse lookup maps such as `BODY_PARTS_BY_ID` and `BODY_SYSTEMS_BY_ID`, and helper functions that translate IDs into assets or modal anchors.
- Depends on: Stable asset and JSON filenames in `public/assets/` and `public/data/`.
- Used by: Every component under `src/`, especially `src/body-map-explorer.ts` and `src/body-map-model.ts`.

**Data Access Layer:**
- Purpose: Load disease and symptom content from shipped JSON or an injected external provider.
- Location: `src/data/data-service.ts`
- Contains: `DataProvider`, cache state, organ-to-data-key translation, default fetch implementation, and cache reset for tests.
- Depends on: Browser `fetch`, `public/data/diseases/*.json`, and `public/data/symptoms-by-part.json`.
- Used by: `src/body-map-explorer.ts` directly and any consumer that passes a compatible `external-data` provider into `<body-map-explorer>`.

## Data Flow

**Primary Selection Flow:**

1. `src/body-map-sidebar.ts` and `src/body-map-model.ts` emit semantic events such as `system-toggle-request`, `body-part-select-request`, `organ-selection-change`, `section-click`, `organ2-click`, `gender-change`, and `view-change`.
2. `src/body-map-explorer.ts` receives those events, mutates its reactive state, and decides which UI mode is authoritative: active system, selected organs, selected body parts, detail focus, or open modal.
3. When a selection needs medical content, `src/body-map-explorer.ts` calls the active `DataProvider` from `src/data/data-service.ts` and stores results in `_diseasesMap`, `_symptomsMap`, `_loadingIds`, `_errorIds`, or modal-specific state.
4. The root shell recomputes derived props such as `_panelOrganIds`, `_detailPhotoEntries`, `systemHighlightOrganIds`, and live-region text using crosswalk tables from `src/data/body-parts.ts`, `src/data/systems.ts`, `src/data/section-mapping.ts`, and `src/data/body-part-modal-anchor.ts`.
5. Updated props flow back down into `src/body-map-model.ts`, `src/body-map-detail-panel.ts`, `src/body-map-data-panel.ts`, and `src/body-map-modal.ts`.
6. Presentation components render the current state and emit follow-up events like `retry-organ`, `modal-retry`, and `symptom-toggle` when user action is needed.

**Sections Modal Flow:**

1. `src/body-map-model.ts` emits `section-click` with a semantic section ID and screen coordinates.
2. `src/body-map-explorer.ts` resolves the section to multiple `bp_` keys using `SECTION_TO_BP_KEYS` from `src/data/section-mapping.ts`.
3. The root loads all disease and symptom arrays in parallel, deduplicates them, and passes the merged result into `src/body-map-modal.ts`.

**Organs 2 Modal Flow:**

1. `src/body-map-model.ts` emits `organ2-click`, or `src/body-map-sidebar.ts` emits `body-part-select-request` while the current view is `organs2`.
2. `src/body-map-explorer.ts` resolves the best anchor using `getOrganGroupModalAnchor` and `getBodyPartModalAnchor` from `src/data/body-part-modal-anchor.ts`.
3. The root fetches body-part keyed data and opens `src/body-map-modal.ts` in a fixed-position overlay near the clicked anatomy.

**State Management:**
- Shared application state stays inside `src/body-map-explorer.ts`; there is no external store, router, context provider, or URL state.
- Child components only own ephemeral UI state that does not need to be shared, such as collapsed cards in `src/body-map-data-panel.ts`, expanded body-part search in `src/body-map-sidebar.ts`, selected symptoms in `src/body-map-modal.ts`, and the active keyboard target and section facing in `src/body-map-model.ts`.

## Key Abstractions

**`DataProvider`:**
- Purpose: Decouple UI state management from the source of disease and symptom data.
- Examples: `src/data/data-service.ts`, `src/body-map-explorer.ts`
- Pattern: Interface-plus-default-adapter. The root accepts an injected provider through the `external-data` property and falls back to the fetch-based implementation in `getDefaultDataProvider()`.

**Domain Definition Catalogs:**
- Purpose: Keep runtime IDs, display names, thumbnails, organ mappings, and geometry in source-controlled TypeScript rather than scattering them through components.
- Examples: `src/data/systems.ts`, `src/data/organs.ts`, `src/data/body-parts.ts`, `src/data/sections.ts`
- Pattern: Immutable exported arrays plus derived lookup maps like `BODY_SYSTEMS_BY_ID` and `BODY_PARTS_BY_ID`.

**Mapping Helpers:**
- Purpose: Bridge mismatched ID spaces between SVG organs, sidebar body parts, grouped sections, modal anchors, and JSON filenames.
- Examples: `src/data/data-service.ts`, `src/data/section-mapping.ts`, `src/data/body-part-modal-anchor.ts`, `src/data/body-part-highlight-regions.ts`
- Pattern: Explicit translation tables and narrow helper functions instead of implicit string manipulation spread across components.

**Design Tokens:**
- Purpose: Centralize colors, spacing, typography, radii, and shadows for all Lit components.
- Examples: `src/styles/tokens.css.ts`
- Pattern: Shared `css` template included in each component’s `static styles` array.

## Entry Points

**Library Entry Point:**
- Location: `src/body-map-explorer.ts`
- Triggers: Vite library build in `vite.config.ts` and direct import by downstream applications.
- Responsibilities: Register `<body-map-explorer>`, compose child elements, coordinate state, and expose the public integration surface (`asset-base`, `selected-organ-ids`, `active-system-id`, `external-data`).

**Development Harness:**
- Location: `index.html`
- Triggers: `npm run dev` and `vite preview`.
- Responsibilities: Mount `<body-map-explorer>` directly and point the browser at the TypeScript source module during development.

**Legacy Standalone Prototype:**
- Location: `interactive-body-model.html`, `interactive-body-model-app.js`
- Triggers: Direct browser use outside the current Vite/Lit build.
- Responsibilities: Preserve the earlier standalone implementation and reference data/behavior that later modules still cite, such as modal anchor heuristics noted in `src/data/body-part-modal-anchor.ts`.

**Asset and Data Generation Scripts:**
- Location: `scripts/split-diseases.js`, `scripts/validate-bp-coverage.js`, `scripts/extract-sections-body.mjs`, `scripts/extract-silhouette.mjs`, `scripts/extract-base64.mjs`, `scripts/convert-to-webp.sh`
- Triggers: Manual maintenance workflows.
- Responsibilities: Generate or validate runtime JSON and image assets that the current UI consumes from `public/`.

## Error Handling

**Strategy:** Catch asynchronous fetch failures in the root shell, store errors in reactive state, and let presentation components render retry UI.

**Patterns:**
- `src/data/data-service.ts` throws descriptive `Error` objects that include the failing body-part key and URL.
- `src/body-map-explorer.ts` catches per-item failures in `_loadOrganData()` and stores them in `_errorIds` instead of throwing through the render tree.
- Modal-specific loading paths in `src/body-map-explorer.ts` capture failures into `_modalError` so `src/body-map-modal.ts` can render a local retry action.
- Retry behavior stays event-driven: `src/body-map-data-panel.ts` emits `retry-organ`, and `src/body-map-modal.ts` emits `modal-retry`.

## Cross-Cutting Concerns

**Logging:** Not detected. The runtime components in `src/` do not centralize logs or analytics.
**Validation:** TypeScript `strict` mode in `tsconfig.json`, explicit ID crosswalks in `src/data/*.ts`, and defensive fallback helpers such as `BODY_SYSTEMS_BY_ID.get(...) ?? null` and `SECTION_TO_BP_KEYS[sectionId] ?? []`.
**Authentication:** Not applicable. The app serves static assets and JSON and does not implement user identity.
**Accessibility:** Shared interaction accessibility is handled in the component layer: `src/body-map-model.ts` implements roving tabindex and keyboard activation, and `src/body-map-explorer.ts` owns a polite live region for announcements.

---

*Architecture analysis: 2026-04-07*
