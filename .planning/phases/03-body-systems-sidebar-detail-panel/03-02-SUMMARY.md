---
phase: "03"
plan: "02"
subsystem: body-systems-explorer-wiring
tags: [lit, web-components, state-management, tdd, bidirectional-binding]
dependency_graph:
  requires: [03-01]
  provides: [SYSTEM-02, SYSTEM-03, SYSTEM-05, explorer-state-owner]
  affects: [body-map-model, body-map-explorer, body-map-sidebar, body-map-detail-panel]
tech_stack:
  added: []
  patterns: [controlled-inputs, event-driven-state, tdd-red-green]
key_files:
  created:
    - src/__tests__/body-map-explorer.test.ts
  modified:
    - src/body-map-model.ts
    - src/__tests__/body-map-model.test.ts
    - src/body-map-explorer.ts
decisions:
  - "Explorer owns activeSystemId and selectedOrganIds as @state; model receives them as @property inputs"
  - "systemHighlightOrganIds is a computed getter on explorer, never merged into selectedOrganIds"
  - "mappedSystemIds[0] first-match rule keeps thymus->endocrine and knee_joint->muscular priority consistent with legacy behavior"
  - "system-highlighted CSS class uses orange glow distinct from direct-selection blue glow"
  - "organ2-click remains emitted in organs2 view mode without toggling selectedOrganIds"
metrics:
  duration: "~15 min"
  completed: "2026-04-06"
  tasks: 2
  files: 4
---

# Phase 03 Plan 02: Explorer System State Wiring Summary

One-liner: Bidirectional system-organ selection wiring via explorer-owned state with TDD-driven controlled inputs on the body model.

## What Was Built

The `<body-map-explorer>` component now owns the shared Phase 03 state: `activeSystemId` and `selectedOrganIds`. The `<body-map-model>` component accepts explorer-driven inputs (`selectedOrganIds`, `systemHighlightOrganIds`) and emits the richer `organ-selection-change` event with `lastToggled`, `selectedOrganIds`, and `isSelected` fields. The three-column layout is fully composed.

### Task 1: Controlled Organ Selection on BodyMapModel

- Added `@property selectedOrganIds: string[] = []` replacing the private `_selectedOrgans` Set
- Added `@property systemHighlightOrganIds: string[] = []` for explorer-driven system highlights
- `_renderOrganGroup` derives `selected` and `system-highlighted` classes from these arrays
- `system-highlighted` has distinct orange glow CSS, keeping direct selection visually stronger
- `organ-selection-change` event now includes `{ selected, selectedOrganIds, lastToggled, isSelected }`
- `organ2-click` is emitted in `organs2` view mode without affecting `selectedOrganIds`
- Gender change removes the hidden reproductive organ from `selectedOrganIds` and re-emits with `isSelected: false`
- Added 8 new tests (MODEL-08, MODEL-09, MODEL-10) covering all controlled property behaviors

### Task 2: Explorer System State Wiring

- `@state() private activeSystemId: BodySystemId | null = null`
- `@state() private selectedOrganIds: string[] = []`
- `private get activeSystem()` and `private get systemHighlightOrganIds()` as computed getters
- `_handleSystemToggleRequest`: toggles `activeSystemId` on same-system click, sets it otherwise
- `_handleOrganSelectionChange`: updates `selectedOrganIds` and derives `activeSystemId` via `ORGAN_TO_SYSTEM` with `mappedSystemIds[0]` first-match rule; deselection clears only when no active-system organs remain
- Replaced placeholder markup with real `<body-map-sidebar>`, `<body-map-model>`, `<body-map-detail-panel>` composition
- Added 14 integration tests (EXPLORER-01 through EXPLORER-04) covering all bidirectional flows

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all data flows are wired. Sidebar receives `BODY_SYSTEMS` directly, detail panel receives `activeSystem` definition, model receives both `selectedOrganIds` and `systemHighlightOrganIds`.

## Verification

- `npx vitest run` — 42 tests pass (28 model + 14 explorer)
- `npm run build` — ES + UMD bundles at 88.90 KB / 79.76 KB, under 500 KB limit

## Commits

| Hash | Description |
|------|-------------|
| b77d6a9 | test(03-02): add failing tests for controlled organ selection and system highlight |
| de1286c | feat(03-02): make body-map-model accept controlled organ selection and system-highlight inputs |
| cef4fb2 | test(03-02): add failing explorer integration tests for sidebar/model/detail-panel synchronization |
| b3f3859 | feat(03-02): wire explorer-owned system state across sidebar, model, and detail panel |

## Self-Check: PASSED
