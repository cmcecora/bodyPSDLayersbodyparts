# Phase 6: Polish, Back View & Performance - Research

**Researched:** 2026-04-07
**Domain:** Accessibility, responsive layout, back-view body artwork, and runtime performance for a Lit web component
**Confidence:** HIGH

## Summary

Phase 6 is a cross-cutting pass over the existing `body-map-explorer` stack. The current component already has the core pieces needed for this phase: a working `body-map-model`, a sidebar/detail/data-panel layout, a modal, section datasets for front and back views, and shipped back-view base assets in `public/assets/sections-body-back.webp` and `public/assets/sections-body-male-back.webp`. What is missing is the product-quality layer: keyboard semantics for the SVG interaction model, screen-reader announcements, container-query-driven layout changes, a polished front/back flip treatment, and explicit control over which assets are loaded eagerly vs deferred.

Two technical constraints shape the plan:

1. Native keyboard accessibility does **not** come for free with SVG `<path>` hit areas. If the organ and section regions stay as raw SVG paths, the phase must add explicit focus management, keyboard handlers, `tabindex`, and ARIA semantics, or introduce an overlaid/focusable interaction layer.
2. Native `loading="lazy"` is not available on SVG `<image>` elements. Performance work therefore needs conditional rendering / deferred `href` assignment for non-critical organ and section assets rather than relying on browser lazy loading alone.

**Primary recommendation:** split Phase 6 into four plans: accessibility/keyboard infrastructure, container-query responsive layout + visual polish, back-view flip behavior, and performance/caching. That keeps the plans concrete and lets the checker verify each requirement cluster independently.

<user_constraints>
## User Constraints (derived from ROADMAP.md and REQUIREMENTS.md)

### Locked Decisions
- Keyboard-only users must be able to tab through body systems, move through organs with arrow keys, and toggle with Enter. [VERIFIED: ROADMAP.md]
- Screen readers must hear the selected body part name and system membership. [VERIFIED: ROADMAP.md]
- Responsive behavior must use container queries, not media queries. [VERIFIED: ROADMAP.md]
- Front/back rotation must animate with a CSS 3D flip and work for the female green body model in the body-sections tab. [VERIFIED: ROADMAP.md]
- Initial page load budget is under 500 KB for the component shell plus critical assets. [VERIFIED: ROADMAP.md]
- Hot interaction paths must avoid repeated DOM queries. [VERIFIED: ROADMAP.md]

### the agent's Discretion
- Exact roving-focus model for organs vs systems.
- Exact breakpoint thresholds and panel stacking behavior under container queries.
- Whether the 3D flip is applied to the SVG wrapper, an inner scene container, or the section-body layer only.
- Which assets are considered critical vs deferred on first paint.
- How much of the visual polish should be token-driven versus component-local CSS.

### Deferred Ideas (OUT OF SCOPE)
- Full dark mode / host theming API.
- WebGL / zoom / pan / 3D navigation.
- Reworking the entire information architecture of the component.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| UX-01 | Professional visual polish | Existing tokens and component-local styles can be refined without new deps. |
| UX-02 | Responsive layout via container queries | Replace fixed grid behavior in `src/body-map-explorer.ts` with `container-type: inline-size` and `@container` rules. |
| UX-03 | Keyboard navigation for systems and organs | Roving tabindex + arrow-key index map in sidebar/model; Enter/Space toggles selection. |
| UX-04 | ARIA labels on interactive regions and controls | Add `role`, `aria-label`, `aria-pressed`, `aria-current`/`aria-selected` where relevant. |
| UX-05 | Screen reader announcement of body part + system | Add a live region in explorer and update it from selection handlers. |
| BACK-01 | Female green body model back view works | Current assets and `SECTIONS` support back mode; verify female back asset path and flip state wiring. |
| BACK-02 | Male back-view artwork sourced and integrated | Asset already exists at `public/assets/sections-body-male-back.webp`; integration/polish still required. |
| BACK-03 | 3D front/back flip animation | `body-map-model.ts` already has `perspective`/`transform-style`; extend into an actual flip scene. |
| PERF-01 | Initial load under 500 KB | Measure bundle + critical assets; defer non-visible section/organ assets and below-fold imagery. |
| PERF-02 | Cache DOM queries in hot paths | Replace repeated lookup patterns with cached refs/maps. |
| PERF-03 | Organ images lazy-loaded | Use deferred `href`/conditional rendering because SVG images cannot use native lazy loading. |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Lit | ^3.0.0 | Component rendering and reactivity | Already used across all components. [VERIFIED: package.json] |
| TypeScript | ^5.5.0 | Typed state and event contracts | Already used across `src/`. [VERIFIED: package.json] |
| Vite | ^6.0.0 | Build and bundle analysis | Existing build pipeline. [VERIFIED: package.json, vite.config.ts] |
| Vitest | ^4.1.2 | Automated component verification | Existing test runner. [VERIFIED: package.json] |
| happy-dom | ^20.8.9 | DOM test environment | Existing test environment. [VERIFIED: package.json] |

### Supporting

| Capability | Existing Support | When to Use |
|------------|------------------|-------------|
| CSS container queries | Native CSS | Use for layout collapse and panel reflow. |
| `aria-live` | Native DOM | Use for selection announcements. |
| `ResizeObserver` / `IntersectionObserver` | Native DOM | Use only if conditional asset loading needs viewport observation outside CSS. |

No new npm dependencies are required for this phase.

## Architecture Patterns

### Pattern 1: Roving Focus for Mixed Controls

The sidebar already uses real `<button>` elements and is close to accessible. The body model is not: organ hit areas are SVG paths inside delegated click handlers. The least invasive approach is:

- keep the existing SVG rendering model,
- add a deterministic ordered list of interactive organ/section IDs,
- assign focusability only to the active item (`tabindex="0"` for current, `-1` for others),
- handle Arrow keys to move the active index,
- handle Enter/Space to dispatch the same selection events used by mouse clicks.

This allows keyboard and mouse to share a single event model instead of building a parallel DOM overlay.

### Pattern 2: Explorer-Owned Live Region

Screen-reader announcements belong in `src/body-map-explorer.ts`, not the leaf components, because explorer already knows:

- selected organ/body-part identity,
- mapped system membership through `ORGAN_TO_SYSTEM`,
- current mode and gender.

Recommended shape:

```ts
@state() private _liveAnnouncement = "";

private _announceSelection(partName: string, systemName?: string) {
  this._liveAnnouncement = systemName
    ? `${partName} selected. Body system: ${systemName}.`
    : `${partName} selected.`;
}
```

Rendered as a visually hidden live region:

```html
<div class="sr-only" aria-live="polite">${this._liveAnnouncement}</div>
```

### Pattern 3: Container-Scoped Layout, Not Viewport Media Queries

The current explorer uses a fixed 4-column grid:

```css
grid-template-columns: 260px 1fr 300px minmax(280px, 1fr);
```

This is not component-responsive. The component should become its own query container and progressively collapse:

- wide container: 4 columns,
- medium container: sidebar + model on row 1, detail/data panels stacked or spanning row 2,
- narrow container: single column with model first, then system/detail/data panels.

This should be expressed with `@container` rules on the component wrapper, not `@media`.

### Pattern 4: Deferred Asset Activation for SVG Images

The current model eagerly renders organ `<image>` nodes and current section base assets. For PERF-03, native browser lazy loading is unavailable inside SVG, so use one or both of:

- conditional rendering of non-active view assets,
- deferred `href` assignment for secondary views/genders/back side until user switches modes.

The phase should focus on deferring *non-visible* assets first:

- inactive section side,
- inactive gender-specific section body,
- inactive organ-set mode (`organs` vs `organs2`),
- below-fold body-part photo thumbnails in detail/data panels.

### Pattern 5: Cache Read-Mostly Lookups

The hottest repeated lookups in current code are not network calls but repeated searches:

- `BODY_PARTS.find(...)` across selection paths,
- `this.renderRoot.querySelector("body-map-model")` in `_resolveOrgans2ModalAnchor`,
- repeated `Set`/`Map` recreation during selection flows.

The plan should prefer:

- `Map<string, BodyPartDefinition>` and similar lookup tables built once,
- cached element refs (`@query` or private field captured after render),
- helper functions that accept already-resolved objects rather than repeating `find()`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Keyboard accessibility | Separate keyboard-only overlay tree | Reuse existing event model with roving tabindex | Smaller change surface, fewer sync bugs. |
| Responsive behavior | Viewport-only media query breakpoints | Container queries on the component wrapper | Requirement explicitly mandates it. |
| Screen-reader messaging | `alert()` or hidden text scattered across components | Single explorer-owned `aria-live` region | Centralized and testable. |
| Performance measurement | Subjective browser feel | Concrete build/network assertions | Requirement is budgeted, not aesthetic. |

## Common Pitfalls

### Pitfall 1: SVG Paths Are Not Automatically Keyboard-Interactive
**What goes wrong:** Keyboard users cannot reach organs/sections even if click handlers exist.
**Why it happens:** SVG shapes do not behave like buttons by default.
**How to avoid:** Add focusability, role/label semantics, and explicit key handlers for the selected navigation model.

### Pitfall 2: Container Queries Fail If No Container Is Declared
**What goes wrong:** `@container` rules never activate.
**Why it happens:** The component root lacks `container-type`.
**How to avoid:** Declare `container-type: inline-size` on the host or layout wrapper before introducing container rules.

### Pitfall 3: 3D Flip Animation Can Break Hit Testing
**What goes wrong:** Back-face or transformed layers still intercept clicks/focus.
**Why it happens:** `transform-style: preserve-3d` is present, but `backface-visibility`, stacking, and pointer behavior are not coordinated.
**How to avoid:** Flip a dedicated scene container; ensure hidden face has `backface-visibility: hidden` and inactive face disables pointer events.

### Pitfall 4: `aria-live` Spam on Multi-Selection
**What goes wrong:** Screen readers announce too many state changes in rapid succession.
**Why it happens:** Every internal selection mutation updates the live region.
**How to avoid:** Announce only user-facing toggles, debounce repeated announcements, and avoid announcements during bulk resets.

### Pitfall 5: False “Lazy Loading” Claims for SVG Assets
**What goes wrong:** The plan claims lazy loading but still emits all `<image href>` nodes on first paint.
**Why it happens:** Browsers fetch referenced SVG images eagerly.
**How to avoid:** Verify by network inspection and conditionally omit or defer non-critical asset references.

## Code Examples

### Focusable SVG Group Pattern

```ts
<g
  class="body-part-group"
  data-part=${organ.id}
  tabindex=${this._activeKeyboardPartId === organ.id ? "0" : "-1"}
  role="button"
  aria-label=${`Select ${organ.name}`}
  aria-pressed=${String(isSelected)}
  @focus=${() => this._setActiveKeyboardPart(organ.id)}
  @keydown=${(event: KeyboardEvent) => this._handleOrganKeydown(event, organ.id)}
>
```

### Container Query Skeleton

```css
:host {
  display: block;
  container-type: inline-size;
}

.layout {
  display: grid;
  grid-template-columns: 260px minmax(280px, 1fr) 300px minmax(280px, 1fr);
}

@container (max-width: 1180px) {
  .layout {
    grid-template-columns: minmax(260px, 320px) minmax(320px, 1fr);
  }
}

@container (max-width: 820px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
```

### Deferred Secondary Asset Pattern

```ts
private _getSectionBodyHref() {
  if (this.currentView !== "sections") {
    return nothing;
  }
  return this._sectionsBodyUrl();
}
```

The point is not to render a hidden asset and hope the browser skips it; the asset reference itself must be absent until needed.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Existing back-view assets are visually acceptable and only need integration/polish, not re-authoring | Summary | If the assets are incomplete, the plan needs a sourcing/generation step. |
| A2 | Keyboard navigation can stay within the current SVG structure rather than requiring HTML overlays | Pattern 1 | If browser/screen-reader support proves inconsistent, an overlay interaction layer may be required. |
| A3 | The 500 KB budget refers to JS bundle + immediately requested critical images, not the copied lazy data files in `dist/` | PERF-01 | If the budget is interpreted differently, build output may need restructuring. |

## Open Questions

1. Should body systems and organs share one keyboard tab stop sequence, or should Tab move between regions while Arrow keys move within each region?
   - Recommendation: separate tab stops per region; Arrow keys navigate within the focused region.
2. Is the organs2 modal flow also expected to participate in screen-reader announcements?
   - Recommendation: yes, but announcements should describe the resolved body part, not the raw organ ID.
3. Are the existing back-view assets final art?
   - Recommendation: treat them as final enough to integrate now, and leave any art replacement as a follow-up only if visual verification fails.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | build/test scripts | ✓ | v20.x | — |
| npm | build/test scripts | ✓ | available | — |
| Vite | bundle/build verification | ✓ | 6.x | — |
| Vitest | automated checks | ✓ | 4.1.2 | — |

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | `vite.config.ts` |
| Quick run command | `npm test` |
| Full suite command | `npm test` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| UX-03 | Keyboard traversal and Enter/Space selection for sidebar/model | unit + integration | `npm test` | partial |
| UX-04 | ARIA labels / pressed state on interactive controls | unit | `npm test` | partial |
| UX-05 | Live region announces selection context | unit | `npm test` | missing |
| BACK-01 / BACK-03 | Front/back switching and flip state | unit + browser | `npm test` + manual | partial |
| PERF-01 / PERF-03 | Build/network budget and deferred asset loading | build + manual | `npm run build` | missing |

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V1 Architecture | yes | Keep keyboard/live-region state centralized to avoid inconsistent UI state. |
| V5 Input Validation | yes | Continue rendering user/host-provided strings via Lit bindings only; avoid `unsafeHTML`. |
| V10 Malicious Code / File Handling | low | Asset path manipulation should remain path-prefix based, not arbitrary URL execution. |

### Known Threat Patterns for This Phase

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| `asset-base` or external data content reflected into UI | Tampering | Keep Lit-escaped rendering and avoid dynamic HTML injection. |
| Keyboard/live-region event spam | Denial of Service (UX) | Debounce announcements and avoid redundant selection dispatch. |
| Focus trapped on hidden face during flip | Spoofing / UX integrity | Disable pointer/focus on inactive face and verify with keyboard-only tests. |

## Sources

### Primary (HIGH confidence)
- Local code analysis of `src/body-map-explorer.ts`
- Local code analysis of `src/body-map-model.ts`
- Local code analysis of `src/body-map-sidebar.ts`
- Local file inventory under `public/assets/`
- `package.json`
- `vite.config.ts`

### Secondary (MEDIUM confidence)
- Established accessibility patterns for roving tabindex and `aria-live`
- Standard browser behavior for SVG image loading and container queries

## Metadata

**Confidence breakdown:**
- Asset/back-view readiness: HIGH - confirmed from local files and section dataset.
- Accessibility approach: HIGH - aligns with current event/state architecture.
- Performance strategy: MEDIUM/HIGH - based on code inspection; final budget still needs measurement.

**Research date:** 2026-04-07
**Valid until:** 2026-05-07
