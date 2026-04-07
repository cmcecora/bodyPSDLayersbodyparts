---
phase: 04-data-layer-disease-symptom-panels-modal
plan: 02
subsystem: body-map-model
tags: [event-dispatch, section-click, custom-event, tdd, shadow-dom]
dependency_graph:
  requires: []
  provides: [section-click CustomEvent from body-map-model]
  affects:
    [
      body-map-explorer @section-click handler,
      Plan 04-03 modal open trigger,
      Plan 04-04 modal positioning,
    ]
tech_stack:
  added: []
  patterns: [CustomEvent with bubbles+composed for Shadow DOM boundary crossing]
key_files:
  created: []
  modified:
    - src/body-map-model.ts
    - src/__tests__/body-map-model.test.ts
decisions:
  - "_handleSectionClick dispatches section-click after toggle logic so toggle state and event are always in sync"
  - "clientX/clientY (viewport coords) used rather than offsetX/offsetY so explorer can position a fixed-position modal correctly"
  - "data-name attribute read from group element for sectionName — avoids SECTIONS array lookup in the event handler"
metrics:
  duration: ~5min
  completed: 2026-04-06
  tasks_completed: 1
  files_modified: 2
---

# Phase 4 Plan 02: Section-Click Event Dispatch Summary

**One-liner:** Added `section-click` CustomEvent dispatch to `_handleSectionClick` with `sectionId`, `sectionName`, `clientX`, `clientY` detail — prerequisite for modal open trigger in Plans 04-03 and 04-04.

## What Was Built

`src/body-map-model.ts` `_handleSectionClick` now dispatches a `section-click` CustomEvent after the existing toggle selection logic. The event carries the section ID, human-readable section name (from `data-name`), and viewport click coordinates (`clientX`/`clientY`). The event is `bubbles: true` and `composed: true` so it crosses the Shadow DOM boundary to the parent `body-map-explorer` component.

This is a prerequisite for:

- **MODAL-01**: The explorer listens for `section-click` to know when to open the disease/symptom modal
- **MODAL-02**: The explorer uses `clientX`/`clientY` from the event detail to position the modal relative to the clicked region

## Commits

| Hash    | Phase | Message                                                                 |
| ------- | ----- | ----------------------------------------------------------------------- |
| b1070cd | RED   | test(04-02): add failing section-click event tests                      |
| 0159c60 | GREEN | feat(04-02): dispatch section-click CustomEvent in \_handleSectionClick |

## Tasks

| Task | Name                                                     | Status | Commit  |
| ---- | -------------------------------------------------------- | ------ | ------- |
| 1    | Add section-click event dispatch to \_handleSectionClick | Done   | 0159c60 |

## TDD Cycle

**RED:** Added 6 failing tests in a new `describe("section-click event")` block covering:

- CustomEvent dispatch on section click
- `detail.sectionId` matches `data-part` attribute
- `detail.sectionName` matches `data-name` attribute
- `detail.clientX` and `detail.clientY` are numbers
- Event has `bubbles: true` and `composed: true`
- Existing toggle selection behavior is preserved

**GREEN:** Added `partName` read from `data-name` attribute and `dispatchEvent(new CustomEvent("section-click", ...))` after `this.requestUpdate()` in `_handleSectionClick`.

**Result:** 34/34 tests pass in `body-map-model.test.ts`; full suite 57/57 with no regressions.

## Verification Results

```
grep -c "section-click" src/body-map-model.ts   → 1  (✓ >= 1)
grep -c "section-click" src/__tests__/body-map-model.test.ts  → 11 (✓ >= 3)
npx vitest run src/__tests__/body-map-model.test.ts  → 34 passed (✓)
npx vitest run  → 57 passed, 4 test files (✓ no regressions)
```

## Acceptance Criteria

- [x] `src/body-map-model.ts` `_handleSectionClick` contains `new CustomEvent("section-click"`
- [x] `src/body-map-model.ts` `_handleSectionClick` contains `sectionId: partId`
- [x] `src/body-map-model.ts` `_handleSectionClick` contains `sectionName:` with data-name attribute read
- [x] `src/body-map-model.ts` `_handleSectionClick` contains `clientX: event.clientX`
- [x] `src/body-map-model.ts` `_handleSectionClick` contains `composed: true`
- [x] `src/__tests__/body-map-model.test.ts` contains `section-click` in at least 3 test assertions (has 11)
- [x] `npx vitest run src/__tests__/body-map-model.test.ts` exits 0 with all tests passing
- [x] `npx vitest run` (full suite) exits 0 — no regressions

## Deviations from Plan

None — plan executed exactly as written. The implementation matched the action spec precisely.

## Known Stubs

None.

## Threat Flags

No new security-relevant surface introduced. The `clientX`/`clientY` values are viewport coordinates already available to any JS on the page (T-04-04 in plan threat model, disposition: accept).

## Self-Check: PASSED

- `src/body-map-model.ts` exists and contains `section-click` dispatch: FOUND
- `src/__tests__/body-map-model.test.ts` exists and contains `section-click` tests: FOUND
- commit `b1070cd` (RED) exists: FOUND
- commit `0159c60` (GREEN) exists: FOUND
