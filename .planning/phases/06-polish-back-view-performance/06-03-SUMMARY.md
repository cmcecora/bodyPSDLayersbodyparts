---
phase: 06-polish-back-view-performance
plan: 03
subsystem: back-view-flip
tags: [lit, svg, css-3d, back-view, sections, tdd]

# Dependency graph
requires:
  - 06-01 (section keyboard semantics already in place)
  - 06-02 (responsive shell can accommodate the flip scene)
provides:
  - Explicit front/back section faces with a CSS 3D flip scene
  - Correct female and male front/back section-body asset wiring
  - Hidden-face interaction safety for pointer and keyboard navigation
affects:
  - src/body-map-model.ts
  - src/__tests__/body-map-model.test.ts
  - src/__tests__/body-map-explorer.test.ts

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Sections mode now renders a dedicated flip-scene/flip-card instead of swapping one background asset in place"
    - "Each sections face owns its own SVG asset and filtered section targets, while only the active face keeps pointer and keyboard access"
    - "Model and explorer tests were updated to assert active-face behavior rather than assuming a single shared sections layer"

key-files:
  modified:
    - src/body-map-model.ts
    - src/__tests__/body-map-model.test.ts
    - src/__tests__/body-map-explorer.test.ts

key-decisions:
  - "The front/back experience is modeled as explicit scene faces so the rotate control drives a real 3D transform instead of a hard asset swap."
  - "Only the active sections face remains interactive; the hidden face is marked aria-hidden, uses pointer-events: none, and leaves section targets at tabindex -1."
  - "Asset selection is face-aware, which keeps female and male front/back artwork explicit and testable instead of inferring it indirectly from one shared URL helper."

requirements-completed: [BACK-01, BACK-02, BACK-03]

metrics:
  duration: 6min
  completed: "2026-04-07"
  tasks: 3
  files: 3
---

# Phase 06 Plan 03: Front/Back Flip Summary

Sections mode now flips between dedicated front and back faces with the correct artwork for both female and male states, while the hidden face stays out of the interaction path.

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-07T13:20:00-04:00
- **Completed:** 2026-04-07T13:26:00-04:00
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Replaced the single sections-layer asset swap with a two-face `flip-scene` / `flip-card` structure in `body-map-model`.
- Wired front/back asset selection explicitly for female front, female back, male front, and male back states.
- Kept hidden flip faces non-interactive by combining `aria-hidden`, `pointer-events: none`, and inactive keyboard targets.
- Updated model and explorer tests so flip behavior and dependent explorer interactions stay covered under the new scene structure.

## Task Commits

1. **Task 1: Build a 3D front/back sections scene instead of a plain asset swap** - `24a4c66` (`feat`)
2. **Task 2: Wire the correct female and male back-view assets into the flipped sections faces** - `24a4c66` (`feat`)
3. **Task 3: Checkpoint: Verify front/back flip in the browser** - approved after browser verification (`no code changes`)

## Files Created/Modified

- `src/body-map-model.ts` - Added the sections flip scene, explicit front/back faces, face-aware geometry and asset helpers, and hidden-face interaction guards.
- `src/__tests__/body-map-model.test.ts` - Added front/back scene contract coverage, explicit female/male front/back asset assertions, and active-face section-count checks.
- `src/__tests__/body-map-explorer.test.ts` - Tightened the Organs 2 modal-anchor setup so explorer tests align with the model’s actual current-view state.

## Decisions Made

- Scoped the 3D scene work to sections mode only and left organ modes on the existing single-SVG rendering path.
- Kept both faces in the DOM so the flip can animate cleanly, but only the active face may receive interaction.
- Updated legacy tests to assert against the active sections face rather than a single global sections DOM assumption.

## Deviations from Plan

None - plan executed as written.

## Issues Encountered

- `npm test` continues to emit localhost `EPERM` connection noise in this sandbox while still exiting 0. This remained an environment artifact, not a code failure.

## User Setup Required

None - no external assets or setup changes required beyond the repo contents already present.

## Next Phase Readiness

- The sections scene now exposes explicit face state, which makes deferred asset loading and hidden-face omission straightforward in `06-04`.
- Manual browser verification passed for female front/back, male front/back, flip timing, and hidden-face interaction safety.

## Verification

- `npx vitest run src/__tests__/body-map-model.test.ts`
- `npx vitest run src/__tests__/body-map-explorer.test.ts`
- `npm test`
- Manual browser verification in `test/standalone.html`

## Self-Check: PASSED
