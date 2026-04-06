---
phase: 03-body-systems-sidebar-detail-panel
plan: 01
subsystem: body-systems-data-and-panels
tags: [data-module, lit-components, tdd, vitest, typescript]
dependency_graph:
  requires: [02-core-svg-body-model]
  provides:
    [
      systems-data-module,
      body-map-sidebar-component,
      body-map-detail-panel-component,
    ]
  affects: [body-map-explorer, Phase 03 Plan 02 coordinator wiring]
tech_stack:
  added: [vitest@4.1.2, happy-dom@20.8.9]
  patterns:
    [TDD red-green, Lit presentational components, computed reverse lookup]
key_files:
  created:
    - src/data/systems.ts
    - src/body-map-sidebar.ts
    - src/body-map-detail-panel.ts
    - src/__tests__/systems-data.test.ts
    - src/__tests__/body-systems-panels.test.ts
    - vitest.config.ts
  modified:
    - package.json
    - package-lock.json
decisions:
  - "ORGAN_TO_SYSTEM computed via reduce over BODY_SYSTEMS rather than hardcoded — stays consistent with systems data automatically"
  - "body-map-sidebar renders each system as button[type='button'] with aria-pressed for toggle semantics"
  - "body-map-detail-panel uses null system property to drive explicit empty state vs rendered detail view"
  - "vitest + happy-dom added to package.json devDependencies to enable Lit component unit testing"
metrics:
  duration: ~5min
  completed: "2026-04-06"
  tasks_completed: 2
  files_created: 6
  files_modified: 2
  tests_passed: 9
---

# Phase 03 Plan 01: Systems Data Module and Presentational Panel Components Summary

**One-liner:** Typed `systems.ts` data module with 11 body systems, computed `ORGAN_TO_SYSTEM` reverse lookup, plus `<body-map-sidebar>` and `<body-map-detail-panel>` Lit components proven by 9 passing Vitest tests.

## What Was Built

### Task 1: Canonical systems data module

`src/data/systems.ts` is the single source of truth for Phase 03:

- `BodySystemId` union type for all 11 system ids
- `BodySystemDefinition` interface with `id`, `title`, `color`, `thumbnail`, `description`, `organIds`
- `BODY_SYSTEMS` array with all 11 systems in canonical order, thumbnail paths to `/assets/systems/*.webp`, and organ mappings (thymus in both endocrine+immune, knee_joint in muscular+skeletal, empty integumentary)
- `ORGAN_TO_SYSTEM` computed via `BODY_SYSTEMS.reduce()` — no hardcoded reverse map

`src/__tests__/systems-data.test.ts` covers 3 data contracts: exact 11-id order, organ id validity + integumentary empty, reverse lookup correctness for shared and reproductive systems.

**Also added:** `src/data/organs.ts` and `src/data/sections.ts` (canonical geometry modules from Phase 02), `vitest.config.ts`, and updated `package.json` devDependencies.

### Task 2: Sidebar and detail panel components

`src/body-map-sidebar.ts` (`<body-map-sidebar>`):

- Renders 11 `button[type="button"]` rows from `BODY_SYSTEMS` property
- Each button has `.system-dot` (colored), `.system-thumb` (img), and `.system-title` text
- Sets `data-system-id` attribute and `aria-pressed` per button
- Dispatches `system-toggle-request` with `{ systemId }` — `bubbles: true, composed: true`
- Accepts `systems: BodySystemDefinition[]` and `activeSystemId: BodySystemId | null`

`src/body-map-detail-panel.ts` (`<body-map-detail-panel>`):

- Accepts `system: BodySystemDefinition | null` property
- Null state renders empty copy: `Select a body system to see details.`
- Non-null state renders `.detail-thumb` img, `.detail-title` h3, `.detail-description` p

`src/__tests__/body-systems-panels.test.ts` covers 6 tests: sidebar renders 11 buttons with required elements, button data attributes, click dispatches correct event, detail panel null state, detail panel system state, and null state doesn't render detail elements.

## Test Results

```
Test Files  2 passed (2)
     Tests  9 passed (9)
```

Both `systems-data.test.ts` and `body-systems-panels.test.ts` pass against real component fixtures in happy-dom.

## Commits

| Hash    | Message                                                                               |
| ------- | ------------------------------------------------------------------------------------- |
| b19c57e | feat(03-01): create canonical systems data module with ORGAN_TO_SYSTEM reverse lookup |
| 351ab73 | feat(03-01): add body-map-sidebar and body-map-detail-panel presentational components |

## Decisions Made

1. **ORGAN_TO_SYSTEM as computed reduce**: Derived from `BODY_SYSTEMS` at module evaluation time rather than a separately maintained hardcoded map — eliminates divergence risk.

2. **button[type="button"] for sidebar rows**: Follows Lit research guidance to avoid anchor elements; enables proper keyboard activation and ARIA pressed state without workarounds.

3. **null system property for detail panel empty state**: Explicit `null` check drives two distinct render branches — no stale content left visible after deselection.

4. **vitest + happy-dom added to devDependencies**: Parallel worktree started without these tools; added to package.json to enable full component test execution.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Set up vitest infrastructure in worktree**

- **Found during:** Task 1 setup
- **Issue:** Worktree branch was based on old `origin/main` (48a47fc) which had no `src/data/`, `vitest`, or `happy-dom`. The `feature/organ-modal` branch commits had these as untracked/uncommitted files.
- **Fix:** Rebased worktree onto `feature/organ-modal`, added `vitest@4.1.2` and `happy-dom@20.8.9` to `package.json`, created `vitest.config.ts`, ran `npm install`, and copied `organs.ts`/`sections.ts` into `src/data/`.
- **Files modified:** `package.json`, `package-lock.json`, `vitest.config.ts`, `src/data/organs.ts`, `src/data/sections.ts`
- **Commit:** b19c57e (included in Task 1 commit)

## Known Stubs

None — all 11 system descriptions are ported from legacy HTML, all thumbnails point to existing `/assets/systems/*.webp` paths, all organ IDs validated against `ORGANS` data.

## Self-Check: PASSED

Files exist:

- [x] src/data/systems.ts — FOUND
- [x] src/body-map-sidebar.ts — FOUND
- [x] src/body-map-detail-panel.ts — FOUND
- [x] src/**tests**/systems-data.test.ts — FOUND
- [x] src/**tests**/body-systems-panels.test.ts — FOUND

Commits exist:

- [x] b19c57e — FOUND
- [x] 351ab73 — FOUND
