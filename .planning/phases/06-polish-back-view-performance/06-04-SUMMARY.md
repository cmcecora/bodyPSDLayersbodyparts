---
phase: 06-polish-back-view-performance
plan: 04
subsystem: performance-budget
tags: [lit, performance, lazy-loading, build-budget, tdd]

# Dependency graph
requires:
  - 06-01 (accessible keyboard and live-region behavior already established)
  - 06-02 (responsive shell and shared polish tokens already in place)
  - 06-03 (front/back flip scene already wired for face-specific asset control)
provides:
  - Cached hot-path lookup maps and a cached model reference in the explorer
  - Deferred inactive-face assets and native lazy-loading for below-fold images
  - A repeatable build-budget check tied to the actual initial render payload
affects:
  - src/body-map-explorer.ts
  - src/body-map-model.ts
  - src/body-map-sidebar.ts
  - src/body-map-detail-panel.ts
  - src/data/body-parts.ts
  - src/data/systems.ts
  - src/__tests__/body-map-explorer.test.ts
  - src/__tests__/body-map-model.test.ts
  - src/__tests__/body-systems-panels.test.ts
  - scripts/check-build-budget.js
  - package.json

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Explorer hot paths use precomputed Map lookups instead of repeated BODY_PARTS/BODY_SYSTEMS linear scans"
    - "Sections mode renders the active face asset only, so inactive front/back artwork is omitted from the DOM"
    - "Sidebar and detail imagery rely on native loading=\"lazy\" plus rendering gates to keep non-critical images off the initial request path"
    - "Build budget enforcement derives its asset set from the component's default first render instead of a hand-maintained list"

key-files:
  modified:
    - src/body-map-explorer.ts
    - src/body-map-model.ts
    - src/body-map-sidebar.ts
    - src/body-map-detail-panel.ts
    - src/data/body-parts.ts
    - src/data/systems.ts
    - src/__tests__/body-map-explorer.test.ts
    - src/__tests__/body-map-model.test.ts
    - src/__tests__/body-systems-panels.test.ts
    - scripts/check-build-budget.js
    - package.json

key-decisions:
  - "Explorer state resolution now uses BODY_PARTS_BY_ID and BODY_SYSTEMS_BY_ID maps so repeated selection/detail lookups avoid hot-path array scans."
  - "The explorer caches its body-map-model element after first render instead of querying renderRoot during Organs 2 modal anchoring."
  - "Inactive section-face assets are omitted entirely rather than hidden with opacity, which keeps back-view artwork off the initial DOM and request path."
  - "The body-parts sidebar now starts collapsed so body-part icons do not inflate the first-paint network budget."
  - "The build-budget script counts the built shell, visible system thumbnails, and the default body-view asset because those are the actual first-paint assets observed in the browser."

requirements-completed: [PERF-01, PERF-02, PERF-03]

metrics:
  duration: 26min
  completed: "2026-04-07"
  tasks: 4
  files: 11
---

# Phase 06 Plan 04: Performance Budget Summary

Phase 06 closed with concrete performance work: the explorer now avoids repeated data scans in its hot paths, inactive assets are withheld from first paint, and the repo has an enforceable build-budget check backed by real browser verification.

## Performance

- **Duration:** 26 min
- **Started:** 2026-04-07T14:10:00-04:00
- **Completed:** 2026-04-07T14:36:00-04:00
- **Tasks:** 4
- **Files modified:** 11

## Accomplishments

- Exported `BODY_PARTS_BY_ID` and `BODY_SYSTEMS_BY_ID`, then rewired explorer selection/detail flows to use those maps instead of repeated `.find(...)` scans.
- Cached the explorer's `body-map-model` reference so Organs 2 modal anchoring no longer queries `renderRoot` during interaction.
- Rendered only the active sections-face base asset in `body-map-model`, which keeps inactive front/back artwork out of the DOM.
- Added native `loading="lazy"` and `decoding="async"` to detail and sidebar imagery.
- Collapsed the body-parts sidebar by default so icon images are not part of the initial request waterfall.
- Added `scripts/check-build-budget.js` and `npm run check:budget`, using the built shell plus first-paint assets as the enforced payload.

## Task Commits

1. **Task 1: Cache repeated DOM and data lookups in explorer/model hot paths** - implemented in the plan 04 feature work (`feat`)
2. **Task 2: Defer non-critical assets and enable native lazy loading where available** - implemented in the plan 04 feature work (`feat`)
3. **Task 3: Add a repeatable build-budget check for the component shell and critical initial assets** - implemented in the plan 04 feature work (`feat`)
4. **Task 4: Checkpoint: Verify initial network budget and deferred assets in the browser** - approved after browser verification (`no code changes`)

## Files Created/Modified

- `src/data/body-parts.ts` - Added `BODY_PARTS_BY_ID` and reused it for ID-based photo entry resolution.
- `src/data/systems.ts` - Added `BODY_SYSTEMS_BY_ID` for constant-time system lookup.
- `src/body-map-explorer.ts` - Switched hot-path resolution to cached maps, cached the model element, and preserved runtime registration with a side-effect import.
- `src/body-map-model.ts` - Omitted inactive section-face asset refs from the DOM while keeping the flip scene intact.
- `src/body-map-detail-panel.ts` - Added native lazy-loading and async decoding to the system thumbnail and body-part photos.
- `src/body-map-sidebar.ts` - Added lazy-loading to sidebar imagery and deferred body-part icon rendering by collapsing the panel by default.
- `src/__tests__/body-map-explorer.test.ts` - Added map-export assertions, lazy-image coverage, cached-model-path coverage, and updated collapsed-sidebar expectations.
- `src/__tests__/body-map-model.test.ts` - Added inactive-face asset omission coverage for sections mode.
- `src/__tests__/body-systems-panels.test.ts` - Added sidebar lazy-image and collapsed-panel coverage.
- `scripts/check-build-budget.js` - Added the build-budget verifier with a hard 512000-byte threshold.
- `package.json` - Added the `check:budget` script entry.

## Decisions Made

- Counted first-paint system thumbnails in the budget because the sidebar intentionally renders them on load.
- Treated browser-network verification as the source of truth for the budget script, then updated the script when the real waterfall revealed additional critical assets.
- Kept body-part icon requests off first paint by deferring the panel's inner DOM instead of relying on `loading="lazy"` alone.

## Deviations from Plan

- The browser checkpoint revealed that lazy attributes alone were insufficient for the sidebar: the body-part icon DOM still triggered eager requests. The fix was to collapse the panel by default and render its contents only after expansion.

## Issues Encountered

- Replacing the body-map-model side-effect import with a runtime value import briefly broke standalone registration in the browser. Restoring the side-effect import resolved the regression before final verification.
- `npm test` continues to emit sandbox `EPERM` noise for `localhost:3000` while still exiting 0. This remained environmental, not a plan-04 defect.

## User Setup Required

None - the performance work stays within the existing repo and standalone testbed.

## Next Phase Readiness

- Phase 06 is ready for final phase verification and completion.
- The budget script now reflects the observed first-paint asset set, so future regressions will fail with concrete size data instead of a manual estimate.

## Verification

- `npx vitest run src/__tests__/body-map-explorer.test.ts src/__tests__/body-map-model.test.ts`
- `npx vitest run src/__tests__/body-systems-panels.test.ts`
- `npm test`
- `npm run build`
- `npm run check:budget`
- Manual browser verification in `test/standalone.html`

## Self-Check: PASSED
