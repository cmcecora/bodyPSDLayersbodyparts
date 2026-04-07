# Phase 5: Web Component API

## Goal
The `<body-map-explorer>` custom element works as a drop-in component in any framework with a defined public API for external control and event communication.

## Objectives
- [ ] `<body-map-explorer>` can be dropped into a plain HTML page with a `<script type="module">` tag and works fully standalone with bundled data.
- [ ] A host app can pass organ data via attributes/properties and receive `body-part-selected`, `body-part-deselected`, and `system-selected` CustomEvents.
- [ ] A host app can programmatically set selected body parts by writing to the component's property API.
- [ ] Setting the `asset-base` attribute redirects all image loads to the specified URL prefix, enabling CDN or custom asset hosting.
- [ ] The component operates in dual data mode: bundled JSON data used by default, external data accepted via props when provided.

## Dependencies
- Phase 4 (Data Layer) - Required for full data orchestration.
- Phase 3 (Sidebar) - Required for bidirectional selection state.
- Phase 2 (Core Model) - Required for visual interaction.

## Files of Interest
- `src/body-map-explorer.ts` - Main orchestrator to be exposed.
- `src/data/data-service.ts` - Data provider to support external injection.
- `index.html` - Testbed for standalone operation.
- `vite.config.ts` - Library mode configuration.

## Resume Pointer
- Next Task: Research Lit's `@property({ type: ... })` vs. `@state` for public vs. private API.
- Next Task: Define the schema for the `external-data` property.
