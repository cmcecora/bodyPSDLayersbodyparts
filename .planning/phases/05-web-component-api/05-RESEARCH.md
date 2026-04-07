# Phase 5: Web Component API - Research

**Researched:** 2026-04-07
**Domain:** Custom Elements API & Data Orchestration
**Confidence:** HIGH

## Summary

This phase focuses on transforming the `<body-map-explorer>` into a robust, framework-agnostic web component with a clearly defined public API. Research confirms that Lit v3's `@property` is the standard for public APIs (supporting attributes and reactive updates), while `@state` should be used for internal implementation details. The "Dual Data Mode" will be implemented using a Provider pattern, allowing the component to either use its bundled local JSON data or switch to an external API/Prop override provided by the host application.

**Primary recommendation:** Use `@property` with `reflect: true` for state that the host app needs to sync with (like selection), and implement a `DataProvider` interface to cleanly handle the switch between bundled and external data.

<user_constraints>
## User Constraints (from 05-CONTEXT.md)

### Locked Decisions
- Build the `<body-map-explorer>` orchestrator with its full public API (attributes, properties, events, dual data mode). [VERIFIED: ROADMAP.md]
- `<body-map-explorer>` can be dropped into a plain HTML page with a `<script type="module">` tag and works fully standalone with bundled data. [VERIFIED: ROADMAP.md]
- A host app can pass organ data via attributes/properties and receive `body-part-selected`, `body-part-deselected`, and `system-selected` CustomEvents. [VERIFIED: ROADMAP.md]
- A host app can programmatically set selected body parts by writing to the component's property API. [VERIFIED: ROADMAP.md]
- Setting the `asset-base` attribute redirects all image loads to the specified URL prefix, enabling CDN or custom asset hosting. [VERIFIED: ROADMAP.md]
- The component operates in dual data mode: bundled JSON data used by default, external data accepted via props when provided. [VERIFIED: ROADMAP.md]

### the agent's Discretion
- Research Lit's `@property({ type: ... })` vs. `@state` for public vs. private API. [VERIFIED: 05-CONTEXT.md]
- Define the schema for the `external-data` property. [VERIFIED: 05-CONTEXT.md]

### Deferred Ideas (OUT OF SCOPE)
- N/A for this phase.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| API-01 | Standalone operation with bundled data | Confirmed Vite "Standalone Bundle" mode in `vite.config.ts` handles this. |
| API-02 | Public Attributes/Properties for selection | Lit `@property` with reflection and custom converters for arrays (comma-separated strings). |
| API-03 | CustomEvents for interaction | Standardized `CustomEvent<T>` with `bubbles: true` and `composed: true`. |
| API-04 | Asset base redirection | Implementation of `assetBase` property passed to sub-components and used in URL construction. |
| API-05 | Dual Data Mode | `DataProvider` interface allows swapping internal `fetch` logic for external injection. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Lit | ^3.0.0 | Component Core | Lightweight, fast, standard-compliant. [VERIFIED: npm registry] |
| TypeScript | ^5.5.0 | Type Safety | Ensures API contracts are respected. [VERIFIED: package.json] |
| Vite | ^6.0.0 | Build System | Modern, fast ESM-based bundler. [VERIFIED: package.json] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | ^4.1.2 | Testing | Component API and logic verification. [VERIFIED: package.json] |
| Happy DOM | ^20.8.9 | Test Env | Fast DOM simulation for Vitest. [VERIFIED: package.json] |

## Architecture Patterns

### Pattern 1: Orchestrator Component
The `<body-map-explorer>` acts as the central state manager. It receives public configuration via properties/attributes and coordinates sub-components (`body-map-model`, `body-map-sidebar`, etc.) by passing state down and listening to their internal events.

### Pattern 2: Data Provider Interface
To support "Dual Data Mode", we define an interface that abstracts data fetching.

```typescript
export interface DiseaseEntry {
  name: string;
}

export interface ExternalDataProvider {
  fetchDiseases(id: string): Promise<DiseaseEntry[]>;
  fetchSymptoms(id: string): Promise<string[]>;
}
```

### Pattern 3: Computed Asset URLs
Sub-components should use a computed getter or private helper method to construct URLs using the `assetBase` property.

```typescript
private _assetUrl(path: string): string {
  const base = this.assetBase.replace(/\/$/, "");
  return base ? `${base}/${path}` : `/${path}`;
}
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Attribute Sync | Custom mutation observers | Lit `@property` | Built-in, efficient, and handles type conversion. |
| Event Namespacing | Custom naming registry | Standard CustomEvents | Native browser support, works across frameworks. |
| Debouncing | `setTimeout` logic everywhere | Reusable debounce util | Avoids memory leaks and redundant calls in re-renders. |

## Common Pitfalls

### Pitfall 1: Shadow DOM Event Blockage
**What goes wrong:** Host application cannot hear events dispatched by sub-components.
**Why it happens:** Web Component events stay inside the Shadow DOM by default.
**How to avoid:** Use `{ bubbles: true, composed: true }` in `CustomEvent` options. [VERIFIED: Lit docs]

### Pitfall 2: Attribute/Property Type Mismatch
**What goes wrong:** Setting an attribute like `selected-organs="heart,lungs"` results in a string instead of an array.
**Why it happens:** HTML attributes are always strings.
**How to avoid:** Use Lit's `converter` option in `@property` to handle comma-separated strings to arrays.

### Pitfall 3: Prop-Loopback
**What goes wrong:** Component updates its own property, triggering a re-render and an external event, potentially causing an infinite loop in some frameworks.
**Why it happens:** Two-way binding attempts.
**How to avoid:** Differentiate between *Internal State* updates and *External API* property updates. Internal clicks should update `@state` or just dispatch the event, letting the host decide to update the `@property`.

## Code Examples

### Public API Decoration
```typescript
@customElement('body-map-explorer')
export class BodyMapExplorer extends LitElement {
  // Public API: Reflects to attribute 'selected-organs'
  @property({ 
    type: Array, 
    reflect: true, 
    attribute: 'selected-organs',
    converter: {
      fromAttribute: (value: string) => value ? value.split(',') : [],
      toAttribute: (value: string[]) => value.join(',')
    }
  }) 
  selectedOrganIds: string[] = [];

  // Public API: Asset base URL
  @property({ type: String, attribute: 'asset-base' }) 
  assetBase = "";

  // Internal State: Not exposed to attributes
  @state() private _loading = false;
}
```

### Dispatching Public Events
```typescript
private _dispatchSelect(organId: string, name: string) {
  this.dispatchEvent(new CustomEvent('body-part-selected', {
    detail: { 
      organId, 
      name,
      systemId: this.activeSystemId 
    },
    bubbles: true,
    composed: true
  }));
}
```

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `asset-base` should also affect JSON data loads | Summary | If host app only wants to redirect images but keep data local, this might be too restrictive. |
| A2 | Standalone bundle including Lit is preferred over peer-dependency | Standard Stack | Could lead to duplicate Lit versions if the host app also uses Lit. |

## Open Questions

1. **Should `selected-organs` be additive or absolute?**
   - Recommendation: Absolute. If the host sets `selected-organs="heart"`, only the heart should be selected. Programmatic API should handle the "absolute" state.
2. **What happens if `asset-base` is updated at runtime?**
   - Recommendation: The component should re-trigger fetches for currently visible data/images. Lit's reactivity handles this automatically if `assetBase` is a `@property`.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build/Dev | ✓ | v20.19.0 | — |
| NPM | Dependencies | ✓ | 10.8.2 | — |
| Vite | Build | ✓ | 6.4.1 | — |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | `vitest.config.ts` |
| Quick run command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| API-02 | Attribute reflects to property | unit | `npm test` | ❌ Wave 0 |
| API-03 | CustomEvent dispatched on click | integration | `npm test` | ❌ Wave 0 |
| API-04 | Asset URL includes base | unit | `npm test` | ❌ Wave 0 |

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | yes | Sanitize attribute inputs to prevent XSS in URL construction. |

### Known Threat Patterns for Lit

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via Attributes | Tampering | Lit auto-escapes bindings in templates. Avoid `unsafeHTML`. |

## Sources

### Primary (HIGH confidence)
- [Lit Documentation] - Properties, State, and Custom Events.
- [Vite Documentation] - Library Mode.
- [Local Source Analysis] - `src/body-map-explorer.ts`, `src/data/data-service.ts`.

### Secondary (MEDIUM confidence)
- [Web Search] - Best practices for Lit v3.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Directly from `package.json` and Lit docs.
- Architecture: HIGH - Follows standard Lit Orchestrator pattern.
- Pitfalls: HIGH - Based on common Custom Element integration issues.

**Research date:** 2026-04-07
**Valid until:** 2026-05-07
