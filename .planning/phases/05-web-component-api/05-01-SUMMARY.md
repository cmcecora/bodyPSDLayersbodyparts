---
phase: 05-web-component-api
plan: 01
subsystem: orchestrator-public-api
tags: [lit, web-components, custom-elements, public-api, events, standalone-demo]

# Dependency graph
requires:
  - 05-02 (dual data mode)
provides:
  - Public `selectedOrganIds` and `activeSystemId` API surface
  - `organ-selected`, `organ-deselected`, and `system-selected` CustomEvents
  - Standalone HTML testbed for manual browser verification
affects:
  - src/body-map-explorer.ts
  - src/body-map-explorer.test.ts
  - test/standalone.html

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Lit `@property` reflection for public host-controlled state"
    - "Comma-separated attribute conversion for array-backed selection"
    - "CustomEvent dispatch with bubbling and composed propagation"

key-files:
  modified:
    - src/body-map-explorer.ts
    - src/body-map-explorer.test.ts
    - test/standalone.html

key-decisions:
  - "Selection state is exposed as a public API so host apps can drive the component directly."
  - "The component emits `body-part-selected` / `body-part-deselected` aliases alongside the documented organ events to keep host integration flexible."
  - "System thumbnails must honor `assetBase` in the sidebar and detail panel, not just the model imagery."

metrics:
  duration: "~"
  completed: "2026-04-07"
  tasks: 3
  files: 3
---

# Phase 05 Plan 01: Public API Summary

`<body-map-explorer>` now exposes the host-facing control surface expected for a standalone Web Component and for framework embedding.

## What Was Built

- `selectedOrganIds` is a public reactive property backed by the `selected-organ-ids` attribute.
- `activeSystemId` is a public reactive property backed by the `active-system-id` attribute.
- The component dispatches `organ-selected`, `organ-deselected`, and `system-selected` events with bubbled, composed details.
- The standalone testbed now includes controls and an event log so the public API can be verified without a host app.

## Verification

- `npx vitest run src/body-map-explorer.test.ts`
- `npm test`
- `npm run build`
- Manual browser verification in `test/standalone.html`

## Notes

- The event aliases for body-part selection were added to match the broader roadmap and keep integration simple for downstream hosts.
- Asset-base prefixing is applied consistently to system thumbnails after browser verification caught the missing path handling.

## Self-Check: PASSED

