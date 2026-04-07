---
phase: 04-data-layer-disease-symptom-panels-modal
plan: 03
subsystem: data-panel
tags: [typescript, lit, web-component, vitest, data-panel, disease-list, symptom-list, tdd]

# Dependency graph
requires:
  - 04-01 (DataService: fetchDiseases, fetchSymptomsForPart, DiseaseEntry)
provides:
  - BodyMapDataPanel web component (<body-map-data-panel>)
  - Explorer 4-column grid layout with data loading orchestration
  - 13 unit tests for data panel component
  - 3 new integration tests for explorer data panel wiring
affects:
  - 04-04-modal (explorer pattern established for event/state wiring)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Lit v3 web component with Map/Set @state properties and new-instance reactivity
    - Module-level debounce utility (not inside render method — avoids Pitfall 3)
    - Lazy data loading with in-flight guard: check has() before fetching
    - CSS grid-template-rows collapsible cards (1fr -> 0fr transition)
    - Skeleton shimmer bars via linear-gradient animation

key-files:
  created:
    - src/body-map-data-panel.ts
    - src/__tests__/body-map-data-panel.test.ts
  modified:
    - src/body-map-explorer.ts
    - src/__tests__/body-map-explorer.test.ts

key-decisions:
  - "Debounce function defined at module level (not class field inside render) to avoid recreating on each render cycle"
  - "New Map/Set instances always created to trigger Lit reactivity — never mutate in place"
  - "_loadOrganData guards on has(organId) in both _diseasesMap and _loadingIds to prevent duplicate fetches"
  - "filterQuery applied inline in render via _filterItems — no derived @state needed"

patterns-established:
  - "Explorer data orchestration pattern: @state Maps for loaded data, Set for loading, Map for errors"
  - "Event-driven retry: retry-organ event clears errorIds entry then re-triggers _loadOrganData"

requirements-completed: [DATA-01, DATA-02, DATA-03]

# Metrics
duration: ~4min
completed: 2026-04-07
tasks_completed: 2
files_modified: 4
---

# Phase 4 Plan 03: Data Panel and Explorer 4-Column Grid Summary

**BodyMapDataPanel Lit v3 component with collapsible per-organ disease/symptom cards, debounced search filter, skeleton loading, empty states, and error retry — wired into BodyMapExplorer as 4th column with lazy data fetching.**

## Performance

- **Duration:** ~4 min
- **Completed:** 2026-04-07
- **Tasks:** 2 (Task 1: TDD component build; Task 2: Explorer wiring)
- **Files modified:** 4

## Accomplishments

- `BodyMapDataPanel` (`<body-map-data-panel>`) Lit v3 web component created
- Per-organ collapsible cards with disease and symptom sub-lists
- Skeleton shimmer (6 bars per card) shown while loading
- Empty states: "No diseases found for {name}" and "No symptoms found for {name}"
- Error state: "Failed to load data." with Retry button dispatching `retry-organ` CustomEvent
- Debounced global search input dispatching `filter-change` CustomEvent after 250ms
- Filter logic: `_filterItems` generic helper using case-insensitive `.includes()`
- CSS grid-template-rows collapsible animation (1fr -> 0fr) on card header click
- Explorer expanded to 4-column grid: `260px 1fr 300px minmax(280px, 1fr)`
- `_loadOrganData` in explorer: `Promise.all([fetchDiseases, fetchSymptomsForPart])` with loading/error/success state
- New Map/Set instances created on every state update (Lit reactivity requirement)
- 13 new data panel tests + 3 new explorer integration tests; full suite 81/81 passing

## Task Commits

1. **Task 1 (RED): Data panel failing tests** — `3cfc84c` (test)
2. **Task 1 (GREEN): Data panel implementation** — `66469f9` (feat)
3. **Task 2: Explorer wiring + new explorer tests** — `db14e4c` (feat)

## Files Created/Modified

- `src/body-map-data-panel.ts` — BodyMapDataPanel Lit v3 web component (415 lines)
- `src/__tests__/body-map-data-panel.test.ts` — 13 unit tests covering all panel behaviors
- `src/body-map-explorer.ts` — 4-column grid, data state properties, _loadOrganData, body-map-data-panel binding
- `src/__tests__/body-map-explorer.test.ts` — vi.mock for data-service + 3 new data panel integration tests

## Decisions Made

- Debounce utility defined at module level (not inside render) per research Pitfall 3 — avoids recreating on each render cycle
- New Map/Set instances always created to trigger Lit reactivity — `.set()` or `.add()` on existing instances would not fire re-renders
- `_loadOrganData` guards on `has(organId)` in both `_diseasesMap` and `_loadingIds` to prevent duplicate concurrent fetches
- Filter applied inline during render via `_filterItems` — no derived `@state` needed, keeping data flow simple
- Explorer tests mock `fetchDiseases` and `fetchSymptomsForPart` to avoid real network calls in unit tests

## Deviations from Plan

None — plan executed exactly as written.

## Threat Model Compliance

Per plan threat model:
- **T-04-05 (Tampering - disease names in DOM):** All data rendered via Lit `html` template literal `${disease.name}` — auto-escaped, no `innerHTML` or `unsafeHTML` used. MITIGATED.
- **T-04-06 (Tampering - search input):** Filter uses `.toLowerCase().includes(query)` on cached strings only. Input value never inserted into DOM except via Lit auto-escaped binding. No regex construction from user input. MITIGATED.
- **T-04-07 (DoS - large disease lists):** Lists are scrollable with `overflow-y: auto`. Disposition: ACCEPT (as planned).

## Known Stubs

None — all data flows from props (diseasesMap, symptomsMap) passed from explorer, which fetches via DataService.

## Threat Flags

No new security-relevant surface introduced beyond what the plan's threat model covers.

## Self-Check: PASSED

- `src/body-map-data-panel.ts` exists: FOUND
- `src/__tests__/body-map-data-panel.test.ts` exists: FOUND
- `src/body-map-explorer.ts` contains `body-map-data-panel`: FOUND
- `src/body-map-explorer.ts` contains `minmax(280px, 1fr)`: FOUND
- commit `3cfc84c` (RED) exists: FOUND
- commit `66469f9` (GREEN) exists: FOUND
- commit `db14e4c` (Task 2) exists: FOUND
- `npx vitest run` → 81 passed, 6 test files: PASSED

---

_Phase: 04-data-layer-disease-symptom-panels-modal_
_Completed: 2026-04-07_
