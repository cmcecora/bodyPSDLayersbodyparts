---
phase: 04-data-layer-disease-symptom-panels-modal
plan: 04
subsystem: modal
tags:
  [
    typescript,
    lit,
    web-component,
    vitest,
    modal,
    tdd,
    section-click,
    positioned-overlay,
  ]

# Dependency graph
requires:
  - 04-01 (DataService: fetchDiseases, fetchSymptomsForPart, DiseaseEntry)
  - 04-02 (section-click CustomEvent from body-map-model)
  - 04-03 (explorer pattern: 4-column grid, data orchestration)
provides:
  - BodyMapModal web component (<body-map-modal>) with tabbed content, checkboxes, carat, skeleton, error retry
  - Explorer section-click handler with modal state management and aggregated data loading
  - 17 unit tests for modal component
  - 3 new integration tests for explorer modal wiring
affects:
  - body-map-explorer (modal open/close orchestration, section data fetching)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Fixed-position modal with viewport-clamped positioning and triangular carat pointer
    - Toggle guard: clicking same section closes modal (sectionId equality check)
    - Promise.all over bpKeys array for parallel multi-part data fetching
    - Deduplication via Map (diseases by name) and Set (symptoms) after flat()
    - document keydown listener added in connectedCallback, removed in disconnectedCallback (Pitfall 2)
    - Modal rendered OUTSIDE .layout grid div to preserve position:fixed stacking context (Pitfall 1)

key-files:
  created:
    - src/body-map-modal.ts
    - src/__tests__/body-map-modal.test.ts
  modified:
    - src/body-map-explorer.ts
    - src/__tests__/body-map-explorer.test.ts

key-decisions:
  - "Modal rendered outside .layout div — CSS grid creates stacking context that traps position:fixed children"
  - "Toggle guard: clicking same section ID closes modal rather than re-fetching (sectionId === _modalSectionId check)"
  - "_handleSymptomToggle is a pass-through at explorer level — selected symptom state lives in body-map-modal itself"
  - "Escape keydown listener on document (not shadowRoot) — composedPath needed to reach shadow DOM events; using document ensures capture"

patterns-established:
  - "Modal positioning: _computePosition() in willUpdate when anchorX/anchorY change; flip-left if overflow right"
  - "Multi-part data aggregation: Promise.all over bpKeys, flat(), deduplicate with Map/Set"

requirements-completed: [MODAL-01, MODAL-02, MODAL-03, MODAL-04]

# Metrics
duration: ~25min
completed: 2026-04-06
tasks_completed: 2
files_modified: 4
---

# Phase 4 Plan 04: Body-Section Modal Component Summary

**BodyMapModal Lit v3 component with tabbed Symptoms/Diseases content, checkbox-selectable symptoms, positioned carat pointer, skeleton loading, error retry, and backdrop/Escape dismiss — wired into BodyMapExplorer via section-click event handler with aggregated multi-part data loading.**

## Performance

- **Duration:** ~25 min
- **Completed:** 2026-04-06
- **Tasks:** 2 (Task 1: TDD modal component build; Task 2: Explorer wiring)
- **Files modified:** 4

## Accomplishments

- `BodyMapModal` (`<body-map-modal>`) Lit v3 web component created with:
  - `sectionId`, `sectionName`, `diseases`, `symptoms`, `loading`, `error`, `anchorX`, `anchorY` props
  - Symptoms tab (default active) and Diseases tab with active border indicator
  - Checkbox-selectable symptoms dispatching `symptom-toggle` CustomEvent with `{ symptom, checked }`
  - `_computePosition()` with viewport clamping: flips left if right edge overflows, clamps top/bottom
  - Triangular carat pointer (14px rotated square) positioned at anchor point
  - Skeleton shimmer (6 bars) shown while `loading` is true
  - Empty states: "No symptoms found" and "No diseases found"
  - Error state: "Failed to load data." with Retry button dispatching `modal-retry`
  - Debounced 250ms search filter (module-level debounce, Pitfall 3 prevention)
  - `document.addEventListener("keydown")` in `connectedCallback`, removed in `disconnectedCallback`
  - Backdrop click dispatches `modal-close`; modal content div does NOT have close handler (Pitfall 7 prevention)
- `BodyMapExplorer` updated with:
  - Import of `body-map-modal`, `SECTION_TO_BP_KEYS`, and `nothing` from lit
  - 8 modal `@state` properties for section ID, name, anchors, data, loading, error
  - `_handleSectionClick`: toggle guard, sets modal state, fetches via `Promise.all` over all `bpKeys`, deduplicates via `Map`/`Set`
  - `_closeModal`, `_handleModalClose`, `_handleModalRetry`, `_handleSymptomToggle`
  - `@section-click` handler on `body-map-model` element in render template
  - `body-map-modal` rendered OUTSIDE `.layout` div to preserve `position: fixed` stacking context
- 101/101 tests passing (17 new modal tests + 3 new explorer integration tests)

## Task Commits

1. **Task 1 (RED): Modal failing tests** — `ef60ced` (test)
2. **Task 1 (GREEN): Modal implementation** — `69e47e9` (feat)
3. **Task 2: Explorer wiring + new explorer tests** — `95acdba` (feat)

## Files Created/Modified

- `src/body-map-modal.ts` — BodyMapModal Lit v3 web component (~350 lines)
- `src/__tests__/body-map-modal.test.ts` — 17 unit tests covering all modal behaviors
- `src/body-map-explorer.ts` — modal state, section-click handler, modal rendering outside grid
- `src/__tests__/body-map-explorer.test.ts` — 3 new EXPLORER-06 modal integration tests

## Decisions Made

- Modal rendered outside `.layout` grid div — CSS grid creates a stacking context that traps `position: fixed` children inside it, breaking the fixed positioning relative to the viewport (Pitfall 1 from RESEARCH.md)
- Toggle guard in `_handleSectionClick`: if `sectionId === _modalSectionId`, call `_closeModal()` and return — prevents double-fetch and provides intuitive click-to-close behavior
- `_handleModalRetry` clears `_modalSectionId` to null first before calling `_handleSectionClick` — avoids the toggle-close guard firing prematurely
- `_handleSymptomToggle` is a pass-through at the explorer level — symptom selection state lives inside `body-map-modal` component itself, keeping the modal self-contained

## Deviations from Plan

None — plan executed exactly as written.

## Threat Model Compliance

- **T-04-08 (Tampering - modal content rendering):** All disease names and symptom strings rendered via Lit `html` template literal auto-escaping. Checkbox labels use `${symptom}` text interpolation via `html` — no `unsafeHTML`, no `innerHTML`. MITIGATED.
- **T-04-09 (Tampering - modal search input):** Search query used only in `.toLowerCase().includes()` comparison in `_filterItems` and `_filterDiseases`. Never reflected into DOM outside Lit auto-escaped binding. No regex construction from user input. MITIGATED.
- **T-04-10 (Spoofing - modal position coordinates):** `clientX`/`clientY` from `MouseEvent` used only for CSS `left`/`top` positioning. Disposition: ACCEPT (as planned).
- **T-04-11 (Information Disclosure - aggregated section data):** All disease/symptom data is public health information. Disposition: ACCEPT (as planned).

## Known Stubs

None — all data flows from props (diseases, symptoms) passed from explorer, which fetches via DataService using SECTION_TO_BP_KEYS lookup.

## Threat Flags

No new security-relevant surface introduced beyond what the plan's threat model covers.

## Checkpoint Status

Task 3 (visual verification) is a `checkpoint:human-verify` — automated work complete, awaiting human browser verification.

## Self-Check: PASSED

- `src/body-map-modal.ts` exists and contains `@customElement("body-map-modal")`: FOUND
- `src/__tests__/body-map-modal.test.ts` exists with 17 `it(` calls: FOUND
- `src/body-map-explorer.ts` contains `body-map-modal` in import and template: FOUND
- `src/body-map-explorer.ts` contains `SECTION_TO_BP_KEYS`: FOUND
- `src/body-map-explorer.ts` contains `@section-click`: FOUND
- `src/body-map-explorer.ts` modal rendering is OUTSIDE `.layout` div: FOUND
- commit `ef60ced` (RED) exists: FOUND
- commit `69e47e9` (GREEN) exists: FOUND
- commit `95acdba` (Task 2) exists: FOUND
- `npx vitest run` → 101 passed, 7 test files: PASSED

---

_Phase: 04-data-layer-disease-symptom-panels-modal_
_Completed: 2026-04-06_
