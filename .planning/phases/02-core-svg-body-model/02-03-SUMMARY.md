---
phase: 02-core-svg-body-model
plan: 03
subsystem: body-map-model
tags: [bug-fix, tdd, hit-area, sections-view, alignment, green-body]
dependency_graph:
  requires: ["02-01", "02-02"]
  provides:
    [
      "hit-area alignment fix",
      "sections-body asset",
      "green sections background",
    ]
  affects:
    [
      "UAT tests 3, 4, 5, 8",
      "organ hover/click accuracy",
      "sections view rendering",
    ]
tech_stack:
  added: ["scripts/extract-sections-body.mjs"]
  patterns:
    [
      "TDD red-green",
      "SVG transform attribute for hit-area positioning",
      "WebP asset extraction",
    ]
key_files:
  created:
    - src/__tests__/body-map-model.test.ts
    - scripts/extract-sections-body.mjs
    - public/assets/sections-body.webp
  modified:
    - src/body-map-model.ts
decisions:
  - "Hit-area paths use SVG transform=translate(imageX,imageY) to position organ-local path coordinates into SVG viewport space"
  - "sections-base-body image is the first child of sections-layer group, rendered before section hit-areas, matching legacy HTML structure"
  - "Green body asset extracted from legacy HTML via extract-sections-body.mjs, same pattern as extract-silhouette.mjs"
metrics:
  duration: "~2 min"
  completed: "2026-04-06"
  tasks_completed: 1
  tasks_total: 2
  files_created: 3
  files_modified: 1
---

# Phase 02 Plan 03: Gap Closure — Hit-Area Alignment and Sections Background Summary

**One-liner:** Fixed organ hit-area misalignment via SVG translate transform and added green-tinted body model background to sections view using extracted WebP asset.

## Objective

Fix two UAT-reported visual bugs in `<body-map-model>`:

1. Hit-area path polygons rendered at (0,0) instead of aligned with their organ images, causing hover/click to target the wrong location.
2. Sections view used the default white silhouette instead of the green-tinted body model background.

## What Was Built

### Fix 1: Hit-area path alignment (UAT tests 3, 4, 5)

**Root cause:** `_renderOrganGroup()` rendered `<path class="hit-area" d=.../>` with no transform, but the hitAreaPath data in `organs.ts` uses organ-local coordinates (starting near 0,0). Each organ's SVG `<image>` is positioned at `(imageX, imageY)` in the viewport. Without a matching translate, hit-areas all clustered at the top-left corner.

**Fix:** Added `transform=${translate(${organ.imageX},${organ.imageY})}` to each hit-area path in `_renderOrganGroup()`. This positions the organ-local hit polygon directly over the corresponding organ image in the SVG viewport — exactly matching the original legacy HTML pattern.

### Fix 2: Green sections background (UAT test 8)

**Root cause:** The sections-layer group had no background image; users saw the base-body white silhouette showing through.

**Fix:**

- Added `private _sectionsBodyUrl(): string` helper returning `/assets/sections-body.webp`
- Added `<image id="sections-base-body">` as the first child of the sections-layer group (x=0, y=0, width=698, height=1698, pointer-events="none")
- Created `scripts/extract-sections-body.mjs` to extract the green body PNG from the legacy HTML and convert to WebP
- Generated `public/assets/sections-body.webp` (136KB) from the legacy HTML's base64-encoded green body

## Test Results

All 23 tests pass (21 existing + 2 new regression tests):

**New tests added:**

- `MODEL-01: every hit-area path has a transform matching its organ position` — verifies all 19 organs have correctly positioned hit-areas
- `MODEL-06: sections view renders green body background image` — verifies `#sections-base-body` exists with href containing "sections-body"

## Commits

| Hash      | Type | Description                                                            |
| --------- | ---- | ---------------------------------------------------------------------- |
| `3cf6e04` | test | Add failing tests for hit-area transform and sections background (RED) |
| `f8f5557` | feat | Fix hit-area alignment and add green body sections background (GREEN)  |

## Deviations from Plan

None — plan executed exactly as written. TDD red-green cycle followed, both fixes committed as specified.

## Known Stubs

None — the sections-body.webp asset is fully wired and generated.

## Verification

- `npx vitest run --reporter=verbose` — 23/23 tests pass
- `npx tsc --noEmit` — no TypeScript errors
- `npm run build` — production bundle built successfully (73KB ES, 65KB UMD)
- `node scripts/extract-sections-body.mjs` — regenerates sections-body.webp without error
- Visual browser verification pending (Task 2 checkpoint: human-verify)

## Self-Check: PASSED

- [x] `src/__tests__/body-map-model.test.ts` — exists (3cf6e04, f8f5557)
- [x] `scripts/extract-sections-body.mjs` — exists (f8f5557)
- [x] `public/assets/sections-body.webp` — exists, 136950 bytes (f8f5557)
- [x] `src/body-map-model.ts` — modified (f8f5557)
- [x] All commits exist in git log
