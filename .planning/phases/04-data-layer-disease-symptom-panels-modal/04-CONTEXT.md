# Phase 4: Data Layer, Disease/Symptom Panels & Modal - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can click a body part and see related diseases and symptoms loaded on demand, with a modal for detailed body-section exploration. This phase connects the interactive body model (Phase 2-3) to the medical data layer (diseases, symptoms) through lazy-loaded per-body-part JSON files, a 4th-column data panel, and a positioned body-section modal.

</domain>

<decisions>
## Implementation Decisions

### Disease/Symptom Panel Placement

- **D-01:** Fourth column added to the layout grid (matching the existing monolithic HTML's spanning-sections pattern). Grid changes from `260px 1fr 300px` to `260px 1fr 300px 1fr` (or similar).
- **D-02:** Each selected body part gets its own collapsible card in the 4th column with disease and symptom sub-sections inside. Multiple body parts stack vertically.
- **D-03:** One global search/filter input at the top of the 4th column, filtering across all visible body parts' diseases and symptoms simultaneously. Debounced input per DATA-03.
- **D-04:** Disease names displayed without ICD-10 codes. Codes are available in the data but not shown in the UI.

### Data Splitting & Loading

- **D-05:** The 7.6MB `diseases.json` is split into 83 individual JSON files — one per body part key (e.g., `public/data/diseases/bp_brain.json`, `public/data/diseases/bp_heart.json`). Build-time Node.js script performs the split.
- **D-06:** `symptoms-by-part.json` (100KB) is NOT split — loaded as a whole file on first need, cached in memory. Too small to warrant 83 separate files.
- **D-07:** A Node.js script in `scripts/` (e.g., `scripts/split-diseases.js`) reads `public/data/diseases.json` and writes per-body-part files to `public/data/diseases/`. Added as an npm script.
- **D-08:** Fetched data cached in an in-memory `Map<string, DiseaseEntry[]>` in the data service. First selection of a body part fetches; subsequent selections return cached data. Cache cleared on page reload only.

### Modal Design & Behavior

- **D-09:** Body-section modal shows both symptoms and diseases, organized with tabs inside the modal — "Symptoms" tab and "Diseases" tab.
- **D-10:** Modal positioned adjacent to the click point with a triangular carat pointer, matching the existing app's `symptom-modal` pattern. Smart repositioning to stay within viewport bounds.
- **D-11:** Symptoms in the modal are selectable via checkboxes, matching the existing app's interaction pattern. Selected symptoms tracked in state.
- **D-12:** Modal includes its own search/filter input at the top of the content area, filtering within the current body section's data.
- **D-13:** Modal dismissed by clicking outside (backdrop click) or pressing Escape. Matches MODAL-04.

### Loading & Empty States

- **D-14:** Skeleton shimmer lines shown while data loads — animated placeholder lines mimicking the shape of the disease/symptom list. Used in both the 4th column and the modal (MODAL-03).
- **D-15:** When a body part has no diseases or symptoms, show a muted "No diseases found for [body part]" or "No symptoms found for [body part]" message inline.
- **D-16:** Network errors show inline "Failed to load data. [Retry]" message in place of the skeleton. User can click retry. No full-page error state.

### Claude's Discretion

- Exact 4th column width and responsive breakpoint behavior
- Internal component decomposition (data-panel, disease-list, symptom-list, modal sub-components)
- Skeleton shimmer animation CSS implementation
- Tab component design inside the modal (simple underline tabs vs pill tabs)
- Debounce timing for search input (200-300ms range)
- How selected symptoms integrate with existing component state in the explorer
- Disease list item styling details (font size, padding, hover states)

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Roadmap

- `.planning/REQUIREMENTS.md` — DATA-01 through DATA-05, MODAL-01 through MODAL-04 define Phase 4 acceptance criteria
- `.planning/ROADMAP.md` — Phase 4 success criteria (6 items) and phase dependency chain

### Existing Data Files (Source for Splitting)

- `public/data/diseases.json` — 7.6MB master disease file keyed by body part ID (83 keys), each value is array of `{code, name}` objects
- `public/data/symptoms-by-part.json` — 100KB symptoms keyed by body part ID, each value is array of symptom strings
- `public/data/symptoms.json` — 421KB flat array of all symptom strings (for autocomplete/global search)

### Existing Components (Build On)

- `src/body-map-explorer.ts` — Explorer coordinator that owns `activeSystemId` and `selectedOrganIds` state. Phase 4 adds 4th column and data loading orchestration here.
- `src/body-map-model.ts` — Fires `organ-selection-change` events that Phase 4 listens to for triggering data loads
- `src/body-map-detail-panel.ts` — Right-column detail panel (Phase 4 adds 4th column alongside this, not replacing it)
- `src/data/systems.ts` — Body systems data module pattern to follow for disease/symptom data service

### Existing Monolithic HTML (Visual Reference)

- `interactive-body-model.html` lines 237-380 — CSS for `.spanning-sections`, `.disease-section`, `.symptom-section`, `.disease-list`, `.symptom-list` (4th column styling reference)
- `interactive-body-model.html` lines 894-1025 — CSS for `.symptom-modal-overlay`, `.symptom-modal`, `.symptom-modal-carat` (modal styling reference)
- `interactive-body-model.html` lines 6625-7001 — JS for body part cards, disease/symptom rendering, search handlers (behavior reference)

### Prior Phase Context

- `.planning/phases/01-scaffolding-asset-extraction/01-CONTEXT.md` — D-05/D-06: data files in `public/data/` as JSON, loaded via `fetch()` at runtime
- `.planning/phases/02-core-svg-body-model/02-CONTEXT.md` — D-01: pixel-faithful visuals; D-04: selected-organ pill list deferred to Phase 3

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `src/data/systems.ts` — Established pattern for typed data modules with exported constants and lookup maps. Disease/symptom data service should follow same pattern.
- `src/styles/tokens.css.ts` — CSS design tokens (`--bme-*` properties) for consistent styling of new components.
- `src/body-map-explorer.ts` — Coordinator component pattern where explorer owns state and passes to children via properties/events.

### Established Patterns

- Lit v3 with `@customElement` decorator and Shadow DOM
- CSS custom properties on `:host` for theming
- Event-driven state: child fires CustomEvent, parent handles and updates `@state()` properties
- Controlled inputs: parent passes data down via `@property()`, children are presentational
- TDD with Vitest + happy-dom (51 tests across 4 test files)

### Integration Points

- `body-map-explorer.ts` grid layout needs a 4th column added for the data panel
- Explorer needs to listen for organ selection changes and trigger data fetches via the data service
- Modal component needs click coordinates from the body model's section click events
- Data service needs to resolve `asset-base` attribute for fetch URLs (existing pattern from organ image loading)

</code_context>

<specifics>
## Specific Ideas

- Fourth column layout matches the existing monolithic HTML's "spanning-sections" pattern — users who used the old app will recognize the layout
- Modal carat pointer and positioning should replicate the existing `symptom-modal` CSS/behavior closely
- Symptom checkboxes in the modal preserve the existing interaction pattern for potential future integration with a symptom checker feature

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 04-data-layer-disease-symptom-panels-modal_
_Context gathered: 2026-04-06_
