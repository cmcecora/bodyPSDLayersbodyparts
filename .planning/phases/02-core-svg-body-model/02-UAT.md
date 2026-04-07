---
status: diagnosed
phase: 02-core-svg-body-model
source: [02-01-SUMMARY.md, 02-02-SUMMARY.md]
started: 2026-04-06T18:30:00Z
updated: 2026-04-06T18:38:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Dev Server Loads Body Model

expected: Run `npm run dev`. Open the URL in browser. The page loads showing the body-map-explorer shell with a visible body model in the center column — a human silhouette with organ images overlaid on it. No console errors related to missing assets or component registration.
result: pass

### 2. Silhouette Background Renders

expected: The body model displays a human body silhouette as the background layer. The silhouette image loads from public/assets/silhouette.webp and is visible behind the organ layers.
result: pass

### 3. All 19 Organ Images Render in Organs View

expected: In the default organs view, all 19 organ images are visible on the body model — brain, heart, lungs (L/R), liver, kidneys, stomach, intestines, gallbladder, spleen, pancreas, thyroid, larynx/trachea, thymus, bladder, knee joint, muscle, and one set of reproductive organs (male by default). No broken image placeholders.
result: issue
reported: "they are there on default but when you mouse over the body model in organs tab option page, the highlight organs are all moved to the top left of the container."
severity: major

### 4. Organ Hover Highlight

expected: Hovering over any organ shows a blue highlight effect (rgba(100, 180, 255, 0.35) overlay). Moving the cursor away removes the highlight. The hover effect feels responsive with no visible lag.
result: issue
reported: "see the issue just described, this does not happen correctly — hover highlights are mispositioned to top-left of container"
severity: major

### 5. Organ Click Selection

expected: Clicking an organ selects it with a persistent stronger blue highlight. Clicking again deselects it. Multiple organs can be selected simultaneously. Each selection/deselection fires an organ-selection-change event (observable via DevTools event listener or component state).
result: issue
reported: "clicking on an organ does not select it because the hit state hover layer is not lined up correctly with the organs on the body model"
severity: major

### 6. View Tabs Switch Between Organs / Organs2 / Sections

expected: Three view tabs are visible (Organs, Organs2, Sections). Clicking each tab switches the body model view with a crossfade transition. The active tab is visually distinguished. Switching views clears any existing selections.
result: pass

### 7. Gender Toggle

expected: Male/Female toggle buttons are visible. Clicking Female hides male reproductive organs and shows female reproductive organs (and vice versa). If a hidden reproductive organ was selected, the selection is cleared automatically.
result: pass

### 8. Sections View Shows Clickable Body Regions

expected: Switching to Sections view shows 7 front-side body region zones (head/neck, chest, abdomen, etc.) as large clickable areas overlaying the silhouette. The sections view uses a green-tinted body model as background (not the default silhouette). Hovering highlights the section. Clicking selects it.
result: issue
reported: "the body sections image is incorrect — should be the green body model from the original, not the standard silhouette. Original has a separate sections-base-body image (from 2bodymodelgreen.psd) that the Lit component doesn't include."
severity: major

### 9. Tests Pass

expected: Running `npx vitest run --reporter=verbose` shows 18 passing tests with zero failures. Tests cover data integrity (organ/section counts, reproductive flags) and component behavior (rendering, hover, selection, view switching, gender toggle).
result: pass

## Summary

total: 9
passed: 5
issues: 4
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "All 19 organ images render correctly in organs view, including on hover"
  status: failed
  reason: "User reported: they are there on default but when you mouse over the body model in organs tab option page, the highlight organs are all moved to the top left of the container."
  severity: major
  test: 3
  root_cause: "Hit-area <path> elements in \_renderOrganGroup() are missing transform='translate(imageX,imageY)'. Path data in organs.ts uses organ-local coordinates (starting near 0,0), but no translate offsets them to absolute SVG position. Original HTML has transform on every hit-area path."
  artifacts:
  - path: "src/body-map-model.ts"
    issue: "Line 390: <path class='hit-area'> missing transform attribute"
    missing:
  - "Add transform=${`translate(${organ.imageX},${organ.imageY})`} to <path> in \_renderOrganGroup()"
- truth: "Hovering over any organ shows a blue highlight at the correct organ position"
  status: failed
  reason: "User reported: same issue as test 3 — hover highlights are mispositioned to top-left of container"
  severity: major
  test: 4
  root_cause: "Same as test 3 — hit-area paths lack translate transform, so hover detection fires on wrong coordinates"
  artifacts:
  - path: "src/body-map-model.ts"
    issue: "Line 390: <path class='hit-area'> missing transform attribute"
    missing:
  - "Same fix as test 3"
- truth: "Clicking an organ selects it because the hit-area path aligns with the visible organ image"
  status: failed
  reason: "User reported: clicking on an organ does not select it because the hit state hover layer is not lined up correctly with the organs on the body model"
  severity: major
  test: 5
  root_cause: "Same as test 3 — hit-area paths at (0,0) instead of organ position, so clicks land on wrong elements"
  artifacts:
  - path: "src/body-map-model.ts"
    issue: "Line 390: <path class='hit-area'> missing transform attribute"
    missing:
  - "Same fix as test 3"
- truth: "Sections view uses the green-tinted body model as background, not the default silhouette"
  status: failed
  reason: "User reported: the body sections image is incorrect — should be the green body model. Original has sections-base-body image from 2bodymodelgreen.psd."
  severity: major
  test: 8
  root_cause: "The Lit component renders a single <image id='base-body'> for all views using silhouette.webp. The original HTML has a separate <image id='sections-base-body'> with a green body PNG inside the sections-layer group. No green body asset exists in public/assets/ and no extraction script targets it."
  artifacts:
  - path: "src/body-map-model.ts"
    issue: "sections-layer group (lines 352-362) has no background image element"
  - path: "scripts/extract-silhouette.mjs"
    issue: "Only extracts id='base-body', not id='sections-base-body'"
    missing:
  - "Extract green body from HTML (anchor: id='sections-base-body') to public/assets/sections-body.webp"
  - "Add \_greenBodyUrl() helper to body-map-model.ts"
  - "Add <image id='sections-base-body'> as first child of sections-layer group"
