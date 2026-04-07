---
phase: 05-web-component-api
plan: 02
subsystem: orchestrator-dual-data-mode
tags: [lit, web-components, data-provider, dual-mode, standalone-demo, tdd]

# Dependency graph
requires:
  - 05-01 (public api)
provides:
  - `DataProvider` abstraction for bundled or injected data
  - `externalData` property support for static objects and provider instances
  - Reload-on-source-change behavior for visible panel data
affects:
  - src/data/data-service.ts
  - src/body-map-explorer.ts
  - src/body-map-explorer.test.ts
  - test/standalone.html

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Provider interface for internal/external data switching"
    - "Epoch-based async invalidation to drop stale fetch results"
    - "Manual demo controls for swapping data sources in place"

key-files:
  modified:
    - src/data/data-service.ts
    - src/body-map-explorer.ts
    - src/body-map-explorer.test.ts
    - test/standalone.html

key-decisions:
  - "Bundled JSON remains the default source; external data is opt-in through the public property."
  - "Static injected data and custom provider instances share the same orchestration path so host integration stays simple."
  - "Changing the active data source should refresh currently visible panel data immediately instead of waiting for a remount."

metrics:
  duration: "~"
  completed: "2026-04-07"
  tasks: 3
  files: 4
---

# Phase 05 Plan 02: Dual Data Mode Summary

The explorer now supports both bundled data and host-provided data, without changing the component surface for consumers.

## What Was Built

- Added a `DataProvider` interface in `src/data/data-service.ts`.
- Added `externalData` support in `<body-map-explorer>` for either static data objects or provider instances.
- Added stale-result protection so visible data reloads safely when the source changes.
- Expanded the standalone testbed with mock static/provider injection demos.

## Verification

- `npx vitest run src/body-map-explorer.test.ts`
- `npm test`
- `npm run build`
- Manual browser verification in `test/standalone.html`

## Notes

- The dual-mode flow is now safe to use in host apps that swap sources at runtime.
- The browser check confirmed the modal and data panels both honor injected data.

## Self-Check: PASSED

