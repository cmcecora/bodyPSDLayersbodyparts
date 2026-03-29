# Phase 2: Core SVG Body Model - Research

**Researched:** 2026-03-29
**Domain:** Lit v3 Web Components + SVG rendering + Shadow DOM interaction
**Confidence:** HIGH

## Summary

Phase 2 builds the `<body-map-model>` Lit sub-component that renders the anatomical body SVG with 20 organ layers, 14 section hit-areas, three view modes, and a gender toggle. All source SVG structure, colors, and interaction logic already exist in `interactive-body-model.html` — Phase 2 is a faithful extraction and Lit-componentization of that code, not greenfield design.

Two Wave 0 blockers exist before implementation can begin. First, the body silhouette background image (`#base-body`) was NOT extracted during Phase 1 — without it the SVG viewport renders as an empty white rectangle. This must be extracted from the source HTML before any other task. Second, no test infrastructure exists (no Vitest config, no test files) and `workflow.nyquist_validation` is absent from config, which means validation is enabled by default.

The single highest-risk implementation mistake is using Lit's `html` tagged template literal for SVG content. SVG elements created with `html` are in the HTML namespace and do not render. All SVG content must use Lit's `svg` tagged template literal, imported separately from `lit`.

**Primary recommendation:** Extract silhouette in Wave 0, use `svg\`...\``for all SVG template content, store organ/section definitions in a TypeScript data file, delegate events via`closest()` on the SVG container, and use conditional click handler behavior (not a separate layer) to distinguish organs vs organs2 view.

---

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Pixel-faithful replica of the existing body model visuals. The rendered component must match the current `interactive-body-model.html` appearance — same hover effects (`rgba(100, 180, 255, 0.35)`), same selection highlights, same drop-shadow filter. Visual refinement is scoped to Phase 6 (UX-01).
- **D-02:** Body silhouette background extracted from existing HTML exactly as-is. Guarantees pixel alignment with organ overlays.
- **D-03:** Hover tooltip (organ name near cursor) deferred to Phase 3+. Phase 2 only shows the visual highlight on hover.
- **D-04:** Selected-organ pill list deferred to Phase 3. Phase 2 shows selection state only on the organs themselves (highlight effect).
- **D-05:** All three view modes implemented: organs (individual organ layers), organs2 (organ groups), and sections (body regions). Despite MODEL-06 mentioning only organs + sections, the user wants full parity with the existing app.
- **D-06:** Front/back rotation deferred entirely to Phase 6. No rotate button in Phase 2.
- **D-07:** Split layout for controls — view-switcher tabs (Organs / Organs 2 / Sections) placed above the SVG model, gender toggle placed below the SVG model.
- **D-08:** View-switcher tabs use text labels only (no icons).
- **D-09:** All organ images load on component mount, not lazy-loaded.

### Claude's Discretion

- Entrance animations: Claude decides whether to replicate the existing fade-in/slide animations or skip for Phase 2
- SVG aspect ratio and scaling behavior within the three-column layout
- SVG data approach: how organ hit-area paths, positions, and image references are structured in the codebase (inline Lit template, JSON data file, or external SVG)
- Component decomposition: how `<body-map-model>` is structured internally (single component vs. smaller sub-components)
- State management pattern for organ selection within the component

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>

## Phase Requirements

| ID       | Description                                                        | Research Support                                                                                                         |
| -------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| MODEL-01 | SVG body model renders as Lit sub-component with 20+ organ layers  | Lit `@customElement`, `svg` template literal; organ data file with 19 WebPs from `public/assets/organs/`                 |
| MODEL-02 | Organ regions clickable with transparent hit-area overlays         | `pointer-events: all` on `.hit-area` paths; `pointer-events: none` on `.part-image`; event delegation via `closest()`    |
| MODEL-03 | Hover shows blue highlight + drop-shadow filter                    | CSS in Shadow DOM: `fill: rgba(100,180,255,0.35)` on hover; `filter: drop-shadow(0 0 6px rgba(66,165,245,0.7))` on image |
| MODEL-04 | Click toggles selection, multiple simultaneous selections allowed  | `Set<string>` for `selectedOrgans`; `.requestUpdate()` after mutation; conditional class in `svg` template               |
| MODEL-05 | Gender toggle switches male/female reproductive organs             | `currentGender` reactive property; CSS show/hide `.male-repro` / `.female-repro` groups                                  |
| MODEL-06 | View switching between organs and sections (plus organs2 per D-05) | Layer opacity crossfade `0.35s ease-in-out`; `currentView` reactive property; conditional event handling for organs2     |
| MODEL-07 | Organ images load from external files, not base64 inline           | `new URL('../assets/organs/${id}.webp', import.meta.url).href` for ES builds; `asset-base` attribute fallback for UMD    |

</phase_requirements>

---

## Standard Stack

### Core

| Library    | Version | Purpose                                                                  | Why Standard                                                                         |
| ---------- | ------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| lit        | ^3.0.0  | Web Component base class, reactive properties, tagged template rendering | Already in stack from Phase 1; `@customElement`, `@property`, `svg` template literal |
| typescript | ^5.5.0  | Type safety for organ data structures and reactive properties            | Already in stack; `experimentalDecorators: true`, `useDefineForClassFields: false`   |
| vite       | ^6.0.0  | Build + dev server; `assetsInlineLimit: 0` prevents base64 inlining      | Already in stack from Phase 1                                                        |

### Supporting

| Library          | Version | Purpose                                                                           | When to Use                                       |
| ---------------- | ------- | --------------------------------------------------------------------------------- | ------------------------------------------------- |
| vitest           | ^2.0.0  | Unit tests for interaction logic (view switching, gender toggle, selection state) | Wave 0 gap — install to enable nyquist validation |
| @web/test-runner | —       | Browser-based Web Component integration tests                                     | Optional; Vitest + happy-dom covers unit logic    |

**Installation (Wave 0 gap):**

```bash
npm install -D vitest @vitest/ui happy-dom
```

**Version verification:**

```bash
npm view lit version          # 3.2.x
npm view vitest version       # 2.x
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── body-map-model.ts          # <body-map-model> Lit component (Phase 2 primary deliverable)
├── body-map-explorer.ts       # Root component — replaces placeholder with <body-map-model>
├── data/
│   ├── organs.ts              # OrganDefinition[] — 19 organs with id, name, hitAreaPath
│   └── sections.ts            # SectionDefinition[] — 14 section hit-areas
├── styles/
│   └── tokens.css.ts          # Already exists from Phase 1 — --bme-* custom properties
public/
├── assets/
│   ├── organs/                # 19 WebP files (extracted Phase 1)
│   └── silhouette.webp        # Body silhouette (WAVE 0 EXTRACTION REQUIRED)
```

### Pattern 1: SVG Tagged Template Literal (CRITICAL)

**What:** All SVG content inside a Lit render method must use `svg\`...\``not`html\`...\``.
**When to use:** Any template content that contains SVG elements (`<svg>`, `<g>`, `<path>`, `<image>`, `<defs>`, `<filter>`, etc.).

```typescript
// Source: Lit v3 docs — lit.dev/docs/templates/svg/
import { LitElement, html, svg, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("body-map-model")
export class BodyMapModel extends LitElement {
  render() {
    return html`
      <div class="svg-wrapper">
        ${svg`
          <svg viewBox="0 0 698 1698" width="100%" height="auto">
            <defs>
              <filter id="blue-glow">
                <feDropShadow dx="0" dy="0" stdDeviation="4"
                  flood-color="#42a5f5" flood-opacity="0.6"/>
              </filter>
              <filter id="green-glow">
                <feDropShadow dx="0" dy="0" stdDeviation="4"
                  flood-color="#4caf50" flood-opacity="0.6"/>
              </filter>
            </defs>
            <!-- layers -->
          </svg>
        `}
      </div>
    `;
  }
}
```

**Why critical:** `html\`<svg>...\``creates SVG elements in the HTML namespace, which the browser silently ignores.`svg\`...\`` creates them in the SVG namespace. This is the single most common Lit+SVG mistake.

### Pattern 2: Organ Data File (Discretion Decision: Use TypeScript Data File)

**What:** Store organ definitions (id, display name, hit-area path `d` attribute) in a TypeScript data file, not inline in the template.
**Why:** The template stays readable; TypeScript provides type-checking on organ IDs; data is reusable by Phase 3+ for system mapping.

```typescript
// src/data/organs.ts
export interface OrganDefinition {
  id: string; // 'brain', 'heart', etc. — matches WebP filename and data-part attribute
  name: string; // 'Brain', 'Heart' — used as data-name attribute
  hitAreaPath: string; // SVG path d= attribute copied from source HTML
  isMaleRepro?: boolean;
  isFemaleRepro?: boolean;
}

export const ORGANS: OrganDefinition[] = [
  { id: "brain", name: "Brain", hitAreaPath: "M 347 ..." },
  // ... 18 more organs
];
```

Organ hit-area `d` attributes are copied verbatim from `interactive-body-model.html` lines 1384-1999.

### Pattern 3: Image URL Resolution for ES + UMD Builds

**What:** Organ images must be referenced as URL strings at runtime, never imported as modules.
**Why:** Vite `assetsInlineLimit: 0` ensures images are served as separate files; importing them would bypass this.

```typescript
// For ES module builds (dev server + ES bundle output)
function organImageUrl(id: string): string {
  return new URL(`../../public/assets/organs/${id}.webp`, import.meta.url).href;
}

// For UMD builds: import.meta.url is not available
// Use an 'asset-base' attribute on the component for externally-set base path:
@property({ type: String, attribute: 'asset-base' })
assetBase: string = '';

organImageUrl(id: string): string {
  if (this.assetBase) return `${this.assetBase}/assets/organs/${id}.webp`;
  return new URL(`../../public/assets/organs/${id}.webp`, import.meta.url).href;
}
```

Usage in SVG template:

```typescript
// Inside svg`` template — note: SVG <image> uses href, not src
svg`<image class="part-image"
  href="${this.organImageUrl(organ.id)}"
  x="0" y="0" width="698" height="1698"
  pointer-events="none"/>`;
```

### Pattern 4: Event Delegation for SVG Groups

**What:** Register one event listener on the SVG container, not one per organ group.
**When to use:** 20+ interactive elements share the same behavior.

```typescript
// Source: .planning/research/SVG_OPTIMIZATION.md
// In body-map-model.ts render():
svg`
  <g id="organs-layer"
    @click="${this._handleOrganClick}"
    @mouseover="${this._handleOrganHover}"
    @mouseout="${this._handleOrganOut}">
    ${ORGANS.map(organ => this._renderOrganGroup(organ))}
  </g>
`

// Event handler:
private _handleOrganClick(e: MouseEvent) {
  const group = (e.target as Element).closest('.body-part-group');
  if (!group) return;
  const partId = group.getAttribute('data-part');
  if (!partId) return;

  if (this.currentView === 'organs2') {
    // Open modal — emit event for Phase 4 to handle
    this.dispatchEvent(new CustomEvent('organ2-click', {
      detail: { partId },
      bubbles: true,
      composed: true,
    }));
    return;
  }

  // organs view: toggle selection
  if (this._selectedOrgans.has(partId)) {
    this._selectedOrgans.delete(partId);
  } else {
    this._selectedOrgans.add(partId);
  }
  this.requestUpdate();
}
```

### Pattern 5: Organs2 View — No Separate Layer (CRITICAL CORRECTION)

**What:** The UI-SPEC lists `#organs2-layer` as a layer ID to preserve. The source HTML has NO such layer. Organs and organs2 views both display `#organs-layer`. The only difference is click handler behavior.
**Implementation:** Do NOT create a separate `#organs2-layer`. Use `currentView` to branch behavior in the click handler. The `#organs2-layer` ID should appear in the DOM only as an alias or be omitted entirely.

```typescript
// currentView controls which SVG layer is visible, not which layer exists:
// 'organs' and 'organs2' both show the same organ groups
// The organs-layer group handles both views
// Layer visibility:
// organs → organs-layer visible, sections-layer hidden
// organs2 → organs-layer visible (same layer), sections-layer hidden
// sections → organs-layer hidden, sections-layer visible
```

This resolves the discrepancy between the UI-SPEC layer ID list and the actual source HTML structure.

### Pattern 6: Gender Toggle State

**What:** `currentGender` reactive property controls which reproductive organ groups are visible.

```typescript
@property({ type: String })
currentGender: 'male' | 'female' = 'male';

// In the SVG template, reproductive groups get conditional class:
// male-repro group: hidden="${this.currentGender !== 'male'}"
// female-repro group: hidden="${this.currentGender !== 'female'}"

// Or via CSS class:
// :host([current-gender="female"]) .male-repro { display: none; }
// :host([current-gender="male"]) .female-repro { display: none; }
```

When gender changes, if the now-hidden gender's reproductive organ was selected, remove it from `_selectedOrgans`.

### Pattern 7: Props-Down / Events-Up State Pattern (Discretion Decision)

**What:** `<body-map-model>` owns its internal state (`currentView`, `currentGender`, `_selectedOrgans`) as Lit reactive properties. It emits `CustomEvent` with `composed: true` for parent consumption.
**Why chosen over Lit Context:** Phase 2 is self-contained. Context adds complexity only needed when multiple distant components share state. Phase 3+ can promote to Context or a shared controller if bidirectional selection demands it.

```typescript
// Emitting selection change for Phase 3+:
private _emitSelectionChange() {
  this.dispatchEvent(new CustomEvent('organ-selection-change', {
    detail: { selected: [...this._selectedOrgans] },
    bubbles: true,
    composed: true,
  }));
}
```

### Pattern 8: SVG Filter Definitions in Shadow DOM

**What:** `<defs>` with filter definitions must be inside the same shadow root as the elements that reference them via `url(#id)`.
**Confidence:** MEDIUM — works in Chrome/Firefox/Safari 16.4+. Older Safari had issues with cross-shadow `url()` references, but since both `<defs>` and the referencing elements are in the same shadow root here, this should be safe.

```typescript
// Correct: defs inside the same svg element as the referencing elements
svg`
  <svg viewBox="0 0 698 1698">
    <defs>
      <filter id="blue-glow">...</filter>
      <filter id="green-glow">...</filter>
      <filter id="bp-glow">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <!-- elements using filter="url(#blue-glow)" -->
  </svg>
`;
// Both defs and referencing elements are in the same shadow root — this works.
// Do NOT reference filters from a separate document or light DOM defs element.
```

### Pattern 9: Component Decomposition (Discretion Decision: Single Component)

**What:** Implement Phase 2 as a single `<body-map-model>` Lit component, not sub-components.
**Why:** The SVG layer structure is tightly coupled — splitting view-switcher, SVG, and gender-toggle into separate components adds cross-component state coordination complexity without benefit. Phase 5 refactoring can extract sub-components when the full API is known.

### Anti-Patterns to Avoid

- **`html\`<svg>...\`\`:** HTML-namespace SVG elements don't render. Always `svg\`...\`\`
- **Base64 organ images in template:** Violates MODEL-07. Always use URL string references.
- **One event listener per organ group:** 20+ listeners — use delegation on the container.
- **Separate `#organs2-layer` DOM element:** Source HTML has no such layer. Don't create one.
- **`@state()` for `selectedOrgans` as array:** Use a `Set<string>` as a private field and call `requestUpdate()` manually — mutating a Set does not trigger Lit's reactivity system automatically.

---

## Don't Hand-Roll

| Problem                      | Don't Build                          | Use Instead                                                                 | Why                                                         |
| ---------------------------- | ------------------------------------ | --------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Set-based reactive selection | Custom reactive Set class            | Lit `@state()` + spread copy, or private Set + `requestUpdate()`            | Mutation detection edge cases; Lit handles change detection |
| CSS crossfade between layers | JavaScript opacity animation loop    | CSS `transition: opacity 0.35s ease-in-out` on layer elements               | GPU-accelerated; no rAF loop needed                         |
| Touch event normalization    | Custom touch-to-click mapping        | `pointer-events` CSS + `touch-action: manipulation` + `touchstart` handler  | Browser normalizes pointer events across touch/mouse        |
| SVG drop-shadow              | Manual `<feComposite>` filter chains | CSS `filter: drop-shadow(...)` on `.part-image` (Chrome/Firefox/Safari 15+) | Simpler; matches source HTML approach                       |
| Asset URL construction       | String concatenation                 | `new URL('./path', import.meta.url)`                                        | Handles relative paths correctly in Vite's module graph     |

**Key insight:** The source HTML already contains the complete, tested implementation. Phase 2's job is componentization, not invention. When in doubt, copy the CSS rule or JS logic from the source HTML and adapt minimally for Lit's reactive model.

---

## Common Pitfalls

### Pitfall 1: Wrong Tagged Template Literal for SVG

**What goes wrong:** `html\`<svg viewBox="0 0 698 1698"><g>...\`\``— the SVG renders as an empty element or throws namespace errors.
**Why it happens:**`html\`\`` creates elements in the HTML namespace (`http://www.w3.org/1999/xhtml`). SVG elements require the SVG namespace (`http://www.w3.org/2000/svg`).
**How to avoid:** Import `svg` from `lit` and use `svg\`...\``for all SVG content nested inside`html\`\``. The outer `html\`\``wraps the host element's template;`svg\`\``wraps the SVG content.
**Warning signs:** SVG renders but all paths are invisible;`<g>` elements exist in DOM but have zero dimensions.

### Pitfall 2: SVG `url(#filter-id)` Broken in Shadow DOM

**What goes wrong:** Organ groups' `filter="url(#blue-glow)"` renders with no effect.
**Why it happens:** If the `<defs>` element is placed in the light DOM (e.g., appended to `document.body`) and the referencing elements are inside the shadow root, the `url(#id)` reference fails to resolve.
**How to avoid:** Declare `<defs>` inside the same `<svg>` element as the referencing elements. Both must be in the same shadow root. This is the correct pattern for Phase 2.
**Warning signs:** Drop-shadow filter has no visual effect; DevTools shows `filter` attribute present but computed `filter` is `none`.

### Pitfall 3: `import.meta.url` Unavailable in UMD Bundle

**What goes wrong:** Organ images 404 in the UMD bundle output — `import.meta.url` is `undefined`.
**Why it happens:** UMD format doesn't support ES module metadata.
**How to avoid:** Check `import.meta.url` availability; fall back to `asset-base` attribute for UMD consumers. See Pattern 3 code example above.
**Warning signs:** Images work in dev server but 404 after `npm run build` in UMD mode.

### Pitfall 4: Mutating a Set Does Not Trigger Lit Reactivity

**What goes wrong:** `this._selectedOrgans.add('brain')` — component doesn't re-render, no visual change.
**Why it happens:** Lit's change detection compares references. Mutating a Set doesn't change its reference.
**How to avoid:** Call `this.requestUpdate()` after mutating the Set, or replace the Set with a new one: `this._selectedOrgans = new Set([...this._selectedOrgans, 'brain'])`.
**Warning signs:** `console.log` shows Set has elements but template hasn't re-rendered.

### Pitfall 5: `pointer-events` Missing on Hit-Areas

**What goes wrong:** Clicking an organ triggers the event on the `<image>` element instead of the `.hit-area` path; or the hit-area has too small a click target.
**Why it happens:** SVG `<image>` elements are opaque to pointer events by default and can intercept clicks meant for the overlaid `.hit-area` path.
**How to avoid:** Set `pointer-events="none"` on `.part-image` elements and `pointer-events="all"` on `.hit-area` paths. CSS: `.part-image { pointer-events: none; } .hit-area { pointer-events: all; }`.
**Warning signs:** Click fires on `<image>` element; `e.target.closest('.body-part-group')` returns null.

### Pitfall 6: Missing Body Silhouette (Wave 0 Blocker)

**What goes wrong:** The SVG renders as an empty white rectangle with no body outline.
**Why it happens:** The `#base-body` background image (698x1698px body silhouette) was NOT extracted during Phase 1. Only the 19 individual organ WebPs exist in `public/assets/organs/`.
**How to avoid:** Wave 0 must extract the silhouette from `interactive-body-model.html` using the same extraction script pattern from Phase 1. Save as `public/assets/silhouette.webp` (or `public/assets/body-silhouette.webp` — naming is a Wave 0 decision).
**Warning signs:** This is a known gap, not a surprise — it will always happen until Wave 0 completes the extraction.

### Pitfall 7: Sections View — Paired Groups for Arms/Legs

**What goes wrong:** Selecting `upper_extremities` only highlights one arm/leg, not both.
**Why it happens:** In the source HTML, `upper_extremities` and `lower_extremities` each appear TWICE (left and right) as separate `<g>` elements with the same `data-part` attribute. Click handler must query `querySelectorAll('[data-part="${id}"]')` not `getElementById`.
**How to avoid:** In the section click handler, use `this.shadowRoot!.querySelectorAll(\`[data-part="${partId}"]\`)`to find all groups sharing the same`data-part`, and apply the `.selected` class to all of them.
**Warning signs:** Arms or legs partially highlight; selection state visually inconsistent.

---

## Code Examples

### Organ Group SVG Structure (from source lines 1384-1999)

```typescript
// Source: interactive-body-model.html lines 1384-1999, adapted for Lit
// Inside the svg`` template:
svg`
  <g id="group-${organ.id}"
     class="body-part-group ${this._selectedOrgans.has(organ.id) ? "selected" : ""} ${organ.isMaleRepro ? "male-repro" : ""} ${organ.isFemaleRepro ? "female-repro" : ""}"
     data-part="${organ.id}"
     data-name="${organ.name}">
    <image class="part-image"
      href="${this.organImageUrl(organ.id)}"
      x="0" y="0" width="698" height="1698"/>
    <path class="hit-area" d="${organ.hitAreaPath}"/>
  </g>
`;
```

### CSS Hover/Selection States (from source lines 150-168, 571-605)

```typescript
// Inside static styles = css``:
static styles = [designTokens, css`
  /* Organs view — blue theme */
  .hit-area {
    fill: transparent;
    pointer-events: all;
    transition: fill 0.2s ease, opacity 0.2s ease;
  }
  .hit-area:hover {
    fill: rgba(100, 180, 255, 0.35);
  }
  .body-part-group.selected .hit-area {
    fill: rgba(66, 145, 230, 0.45);
  }
  .body-part-group.selected:hover .hit-area {
    fill: rgba(66, 145, 230, 0.55);
  }
  .part-image {
    pointer-events: none;
  }
  .body-part-group:hover .part-image,
  .body-part-group.selected .part-image {
    filter: drop-shadow(0 0 6px rgba(66, 165, 245, 0.7));
  }

  /* Sections view — green theme */
  .section-hit-area {
    fill: transparent;
    pointer-events: all;
    transition: fill 0.2s ease, opacity 0.2s ease;
  }
  .section-hit-area:hover {
    fill: rgba(76, 175, 80, 0.35);
  }
  .body-section-group.selected .section-hit-area {
    fill: rgba(144, 238, 144, 0.45);
  }
  .body-section-group.selected:hover .section-hit-area {
    fill: rgba(144, 238, 144, 0.55);
  }

  /* Layer crossfade */
  #organs-layer, #sections-layer, #bp-highlight-layer {
    transition: opacity 0.35s ease-in-out;
  }

  /* Gender toggle visibility */
  .male-repro { display: block; }
  .female-repro { display: none; }
  :host([current-gender="female"]) .male-repro { display: none; }
  :host([current-gender="female"]) .female-repro { display: block; }
`];
```

### View Switching Logic (from source lines 4856-5003)

```typescript
// currentView drives layer opacity:
setView(view: 'organs' | 'organs2' | 'sections') {
  this.currentView = view;
  // Reactivity handles template re-render
  // 'organs' and 'organs2' both show the organs layer
  // 'sections' shows the sections layer
}

// In svg`` template — layer visibility:
svg`
  <g id="organs-layer"
     style="opacity: ${this.currentView !== 'sections' ? '1' : '0'}; pointer-events: ${this.currentView !== 'sections' ? 'auto' : 'none'}">
    ...
  </g>
  <g id="sections-layer"
     style="opacity: ${this.currentView === 'sections' ? '1' : '0'}; pointer-events: ${this.currentView === 'sections' ? 'auto' : 'none'}">
    ...
  </g>
`
```

---

## Runtime State Inventory

> Omitted — this is a greenfield implementation phase, not a rename/refactor/migration phase. No stored data, live service config, OS-registered state, secrets/env vars, or build artifacts are affected.

---

## Environment Availability

| Dependency          | Required By                  | Available | Version                         | Fallback                                           |
| ------------------- | ---------------------------- | --------- | ------------------------------- | -------------------------------------------------- |
| Node.js             | npm install, Vite build      | ✓         | Verify with `node --version`    | —                                                  |
| npm                 | Package installs             | ✓         | Verify with `npm --version`     | —                                                  |
| Vite (node_modules) | Dev server, build            | ✓         | ^6.0.0 (package.json)           | `npm install` if missing                           |
| Lit (node_modules)  | Component rendering          | ✓         | ^3.0.0 (package.json)           | `npm install` if missing                           |
| Vitest              | Test suite                   | ✗         | Not installed                   | `npm install -D vitest happy-dom` — Wave 0 install |
| Python 3            | Data extraction scripts only | Likely ✓  | Verify with `python3 --version` | Not required for Phase 2                           |

**Missing dependencies with no fallback:**

- None — Vitest is Wave 0 installable; all other deps present.

**Missing dependencies with fallback:**

- Vitest: install in Wave 0 with `npm install -D vitest happy-dom`

---

## Validation Architecture

### Test Framework

| Property           | Value                           |
| ------------------ | ------------------------------- |
| Framework          | Vitest (to be installed Wave 0) |
| Config file        | `vitest.config.ts` — see Wave 0 |
| Quick run command  | `npx vitest run src/`           |
| Full suite command | `npx vitest run`                |

Vitest is the natural choice here: Vite is already the build tool, Vitest shares the same config and transform pipeline. Happy-dom provides a browser-like environment for Shadow DOM testing without a real browser.

### Phase Requirements → Test Map

| Req ID   | Behavior                                                    | Test Type | Automated Command                           | File Exists? |
| -------- | ----------------------------------------------------------- | --------- | ------------------------------------------- | ------------ |
| MODEL-01 | `<body-map-model>` renders 20 organ groups                  | unit      | `npx vitest run src/body-map-model.test.ts` | ❌ Wave 0    |
| MODEL-02 | Hit-area paths have `pointer-events="all"`                  | unit      | `npx vitest run src/body-map-model.test.ts` | ❌ Wave 0    |
| MODEL-03 | Hover class applied to organ group                          | unit      | `npx vitest run src/body-map-model.test.ts` | ❌ Wave 0    |
| MODEL-04 | Click toggles `selected` class; multiple selections allowed | unit      | `npx vitest run src/body-map-model.test.ts` | ❌ Wave 0    |
| MODEL-05 | Gender toggle hides/shows reproductive organ groups         | unit      | `npx vitest run src/body-map-model.test.ts` | ❌ Wave 0    |
| MODEL-06 | View switching changes layer opacity                        | unit      | `npx vitest run src/body-map-model.test.ts` | ❌ Wave 0    |
| MODEL-07 | Organ `<image>` href is a URL string (not base64)           | unit      | `npx vitest run src/body-map-model.test.ts` | ❌ Wave 0    |

### Sampling Rate

- **Per task commit:** `npx vitest run src/body-map-model.test.ts`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `src/body-map-model.test.ts` — covers MODEL-01 through MODEL-07
- [ ] `vitest.config.ts` — environment: happy-dom, include: `src/**/*.test.ts`
- [ ] Framework install: `npm install -D vitest happy-dom`
- [ ] `public/assets/silhouette.webp` — body silhouette extraction from source HTML (BLOCKING)
- [ ] `src/data/organs.ts` — TypeScript data file with 19 organ definitions and hit-area paths
- [ ] `src/data/sections.ts` — TypeScript data file with 14 section definitions and hit-area paths

---

## Open Questions

1. **Body silhouette extraction filename convention**
   - What we know: The silhouette is the base body outline, not an organ. It is currently embedded as `#base-body` in the source SVG.
   - What's unclear: Should it be `public/assets/silhouette.webp`, `public/assets/body-silhouette.webp`, or `public/assets/systems/body.webp` (to match the system images pattern)?
   - Recommendation: Use `public/assets/silhouette.webp` — short, unambiguous, distinct from the `organs/` and `systems/` subdirectories.

2. **SVG filter browser compatibility for same-shadow-root `url()` references**
   - What we know: Chrome 100+, Firefox 100+, Safari 16.4+ all support this. The source HTML already uses these filters in non-Shadow DOM context.
   - What's unclear: Whether the specific `#bp-glow` filter (feGaussianBlur + feMerge composite) renders correctly inside Shadow DOM on Safari 15.x.
   - Recommendation: Implement as designed; add a Phase 2 browser smoke test on Safari. If it fails, fallback is to use `filter: drop-shadow()` CSS which has universal support.

3. **`#organs2-layer` ID in UI-SPEC vs source HTML**
   - What we know: Source HTML has no `#organs2-layer`. The UI-SPEC lists it as a "layer ID to preserve." Organs and organs2 share `#organs-layer`.
   - What's unclear: Whether the planner will try to create a physical DOM layer for organs2.
   - Recommendation: Do NOT create `#organs2-layer` as a separate DOM element. The planner should interpret the UI-SPEC's layer ID list as "the organs layer is used in both organs and organs2 views" — the distinction is click behavior only.

---

## State of the Art

| Old Approach                                      | Current Approach                           | When Changed | Impact                                                           |
| ------------------------------------------------- | ------------------------------------------ | ------------ | ---------------------------------------------------------------- |
| Manual `connectedCallback`/`disconnectedCallback` | `@customElement` + `@property` decorators  | Lit 2+       | Less boilerplate; decorators handle registration and reactivity  |
| `render()` with `html\`<svg>...\``                | `html\`...\``+`svg\`...\`` nested template | Lit 2+       | SVG namespace correctness; required for any SVG in Lit templates |
| `attributeChangedCallback` for reactive props     | `@property()` decorator                    | Lit 2+       | Automatic attribute reflection and change detection              |
| `ShadowRoot.innerHTML` for SVG                    | `svg\`\`` tagged template literal          | Lit 2+       | Lit diffing; no full re-render on small state changes            |

---

## Project Constraints (from CLAUDE.md)

The following CLAUDE.md directives apply to Phase 2 implementation:

| Directive                                                         | Impact on Phase 2                                                                                      |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| No build system in original app                                   | Phase 2 adds Lit/Vite — already introduced in Phase 1; constraint is historical context, not a blocker |
| Existing stack: Angular + MySQL + AWS on main site                | Phase 2 is a Web Component — no Angular dependency; deployed as separate static asset                  |
| `interactive-body-model.html` is 3.4MB — avoid reading in full    | Use targeted line-range reads (e.g., `sed -n '1384,1999p'`) when extracting organ data                 |
| GSD workflow enforcement: use `/gsd:execute-phase` for phase work | Phase 2 execution must go through GSD commands, not direct file edits                                  |
| Image loading: all images eagerly on mount (D-09)                 | No lazy loading, no intersection observers for organ images in Phase 2                                 |
| base64 images must NOT appear in JS bundle (assetsInlineLimit: 0) | Organ image URLs must be runtime strings, not Vite-processed imports                                   |

---

## Sources

### Primary (HIGH confidence)

- `interactive-body-model.html` lines 90-168, 571-605, 1330-2399, 4856-5110 — Source of truth for SVG structure, CSS states, interaction logic
- `src/body-map-explorer.ts`, `src/styles/tokens.css.ts` — Phase 1 deliverables confirming Lit patterns
- `vite.config.ts`, `tsconfig.json`, `package.json` — Build and TypeScript configuration confirmed
- `.planning/phases/02-core-svg-body-model/02-CONTEXT.md` — Locked implementation decisions D-01 through D-09
- `.planning/phases/02-core-svg-body-model/02-UI-SPEC.md` — Visual/interaction contract
- `.planning/research/PITFALLS.md` — Existing pitfall catalogue from Phase 1 research
- `.planning/research/WEB_COMPONENTS.md` — Lit + Shadow DOM patterns
- `.planning/research/SVG_OPTIMIZATION.md` — SVG layer architecture, event delegation

### Secondary (MEDIUM confidence)

- Lit v3 documentation (lit.dev) — `svg` tagged template, `@property`, lifecycle hooks (`firstUpdated`)
- MDN Web Docs — SVG namespace, `pointer-events` attribute, `feDropShadow` filter support

### Tertiary (LOW confidence)

- Browser compatibility for `url(#filter-id)` in Shadow DOM on Safari 15.x — needs verification via browser smoke test

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — Lit v3, Vite v6, TypeScript 5.5 confirmed in package.json and tsconfig
- Architecture: HIGH — SVG structure extracted directly from source HTML; Lit patterns verified against source code
- Pitfalls: HIGH — Most pitfalls confirmed from existing PITFALLS.md plus direct source code inspection; one (Safari filter compat) is MEDIUM
- Wave 0 gaps: HIGH — Silhouette absence confirmed by `find` against `public/assets/`; test infrastructure absence confirmed by file scan

**Research date:** 2026-03-29
**Valid until:** 2026-04-28 (stable stack; 30-day window)
