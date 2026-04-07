# Domain Pitfalls

**Domain:** Interactive medical body map Web Component refactor
**Researched:** 2026-03-29

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Base64 Images Leaking Into the JS Bundle

**What goes wrong:** During the Vite build, if organ PNGs are `import`ed in JavaScript (e.g., `import brainImg from './assets/organs/brain.png'`), Vite will either inline them as base64 data URLs (if below `assetsInlineLimit`) or process them as static assets with hashed filenames. If the inline limit is set too high, the entire component JS bundle inflates to multi-MB size, defeating the purpose of the refactor.

**Why it happens:** Vite's default `assetsInlineLimit` is 4096 bytes. Most organ PNGs are well above this, so they would be emitted as separate files. But if a developer raises the limit to "fix" a path resolution issue, or if thumbnails are small enough to inline, base64 creeps back in.

**Consequences:** The Web Component becomes a 3+ MB JavaScript file. NPM consumers get a massive dependency. CDN users face multi-second script parsing delays. The whole point of extracting images is lost.

**Prevention:** Never `import` image files in source code. Use SVG `<image href="...">` with runtime path resolution via `import.meta.url`. Set `assetsInlineLimit: 0` in the Vite config to prevent any accidental inlining. Keep images as static files copied to `dist/assets/` via a Vite plugin or build script.

**Detection:** Check `dist/body-map-explorer.es.js` file size after each build. If it exceeds 200 KB, something is wrong.

### Pitfall 2: Shadow DOM Breaking SVG Internal References

**What goes wrong:** SVG features that use internal ID references -- `<use href="#symbol-id">`, `url(#gradient-id)`, `url(#clipPath-id)`, `url(#filter-id)` -- resolve IDs against the document root, not the shadow root. Inside Shadow DOM, these references silently fail: gradients disappear, clip paths do not apply, filters have no effect.

**Why it happens:** SVG ID references predate Shadow DOM and were designed for a single-document model. The SVG spec resolves `url(#id)` against the document, not the local root.

**Consequences:** If the body map uses SVG `<defs>` with gradients, filters, or clip paths referenced by ID, they will not render inside Shadow DOM. The body silhouette might lose its gradient, highlights might lose their blur filter.

**Prevention:** Audit the current SVG for `url(#...)` references. For each one:

- If it is a CSS filter, replace with CSS `filter: drop-shadow(...)` or `filter: blur(...)` (these work in Shadow DOM since they are CSS, not SVG ID references).
- If it is an SVG gradient, inline the gradient definition inside each element that uses it (verbose but reliable), or use CSS gradients instead.
- If it is a `<use>` reference, replace with the actual SVG content (the hit-area paths are already inline, so this is mainly a risk if symbols are introduced during refactoring).

**Detection:** Visual inspection after moving SVG into Shadow DOM. Automated: Playwright screenshot comparison between old and new renders.

### Pitfall 3: import.meta.url Asset Resolution Failing in UMD Bundle

**What goes wrong:** `import.meta.url` is an ESM-only feature. The UMD bundle (for script-tag usage) does not support `import.meta`. If the component relies on `import.meta.url` for asset path resolution, the UMD version cannot find its images.

**Why it happens:** UMD is a legacy module format that predates ES modules. It has no equivalent of `import.meta`.

**Consequences:** The `<script src="body-map-explorer.umd.js">` usage pattern (important for simple HTML pages and Angular apps that do not use ESM imports) cannot resolve asset paths. All organ images show as broken.

**Prevention:** Provide a fallback path resolution strategy:

```typescript
private resolveAsset(path: string): string {
  // ESM: use import.meta.url
  if (typeof import.meta !== 'undefined' && import.meta.url) {
    return new URL(`./assets/${path}`, import.meta.url).href;
  }
  // UMD fallback: use a configurable base URL
  const base = this.getAttribute('asset-base') || '';
  return `${base}/assets/${path}`;
}
```

Document that UMD consumers must set the `asset-base` attribute:

```html
<body-map-explorer asset-base="/path/to/component"></body-map-explorer>
```

**Detection:** Test the UMD bundle in a plain HTML page with `<script>` tag (not `<script type="module">`).

### Pitfall 4: Losing Existing Functionality During Refactor

**What goes wrong:** The current 7K-line app has 30+ interactive functions, 3 view modes, 2 gender variants, front/back rotation, bidirectional system-organ linking, symptom modals, and disease/symptom search with debounced rendering. It is easy to miss edge cases during the refactor.

**Why it happens:** Single-file architecture means all behavior is tightly coupled. Extracting into components requires understanding every data flow and side effect.

**Consequences:** Users who depended on specific interactions (e.g., selecting a system pre-selects all its body parts AND highlights organs AND shows the detail panel) find that the refactored component is missing steps. The refactor ships as a regression.

**Prevention:**

1. Write Playwright E2E tests against the CURRENT app before starting the refactor. Capture screenshots for every state combination.
2. Run the same tests against the refactored component. Achieve visual parity before adding new features.
3. Use the detailed data flow documentation in `.planning/codebase/ARCHITECTURE.md` as a checklist.

**Detection:** Side-by-side comparison: old HTML file vs new component, same interactions, same results.

## Moderate Pitfalls

### Pitfall 5: CSS Specificity Issues in Shadow DOM

**What goes wrong:** The current CSS uses low-specificity selectors (`h2`, `li a`, `p`) that work fine in a single-document context. Inside Shadow DOM, these still work but can cause unexpected behavior if the component uses `<slot>` to project external content -- slotted content is styled by the host page, not the component's shadow styles.

**Prevention:** Prefix all internal selectors with component-specific classes (e.g., `.bm-systems-list li` instead of `.systems-list li`). Use `:host` for top-level styling. Never rely on element-only selectors (`h2`, `p`) without a class qualifier.

### Pitfall 6: SVG Viewbox Coordinate Mismatch After Resize

**What goes wrong:** The SVG viewBox is `0 0 698 1698`. When the component is rendered at a different size (smaller on mobile, larger on wide screens), SVG coordinate math for modal positioning (`svgCoordsToScreen()`) breaks because the client rect and SVG viewBox are no longer 1:1.

**Prevention:** The current `svgCoordsToScreen()` function already handles this transformation. Ensure it is preserved and tested at multiple viewport sizes. Use `getBoundingClientRect()` on the SVG element and compute the scale ratio.

### Pitfall 7: Touch Event Handling Gaps

**What goes wrong:** The current app has `touchstart`/`touchend` handlers but they appear incomplete (noted in CONCERNS.md). On mobile, long-press triggers context menu instead of selection, double-tap triggers zoom instead of click, and there is no gesture handling for pinch-zoom on the body model.

**Prevention:** Use `pointer events` API (unifies mouse + touch + pen) instead of separate `mousedown`/`touchstart` handlers. Add `touch-action: manipulation` CSS to prevent double-tap zoom on the SVG.

### Pitfall 8: Data File Size Exceeding CDN Limits

**What goes wrong:** The 7.6 MB `diseases-data.js` file may exceed CDN per-file size limits (some CDNs limit to 5 MB per file), or trigger timeout errors on slow connections when loaded as a single fetch.

**Prevention:** Split into per-body-part JSON files (57 files, ~100-200 KB each). Even if loaded from the same CDN, smaller files benefit from parallel downloading and individual caching.

### Pitfall 9: Custom Element Name Collision

**What goes wrong:** If the host page (or another library on the same page) registers a custom element with the same name (e.g., `body-map-sidebar`), the `customElements.define()` call throws an error and the component breaks.

**Prevention:** Use a unique prefix for all internal sub-component names: `bm-sidebar`, `bm-model`, `bm-detail`, etc. The public element `body-map-explorer` should be unique enough (check npm/custom-elements registry). Document the full list of registered element names so consumers can verify no conflicts.

## Minor Pitfalls

### Pitfall 10: Missing Font Stack Inside Shadow DOM

**What goes wrong:** The component uses the system font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`). This is defined in the `:host` styles and works correctly. But if the host page loads a custom web font and expects the component to use it, the component ignores it because Shadow DOM blocks external stylesheets.

**Prevention:** Expose `--bm-font-family` CSS custom property. Document that hosts should set this property to override the default font.

### Pitfall 11: Keyboard Focus Trapping in Modal

**What goes wrong:** The symptom selection modal opens as an overlay but does not trap keyboard focus. Tab key moves focus behind the modal to invisible elements.

**Prevention:** Implement focus trap in `body-map-modal`: on open, store the previously focused element, move focus to the first interactive element in the modal, and trap Tab/Shift+Tab within the modal. On close, restore focus to the stored element.

### Pitfall 12: Memory Leak from Unremoved Event Listeners

**What goes wrong:** If the component is added and removed from the DOM repeatedly (e.g., in a SPA with route changes), event listeners attached in `connectedCallback` accumulate if not removed in `disconnectedCallback`.

**Prevention:** Use Lit's declarative event listeners (`@click=${this.handler}`) in templates -- Lit automatically cleans these up. For imperative listeners (e.g., the SVG event delegation), store the listener reference and remove it in `disconnectedCallback()`.

## Phase-Specific Warnings

| Phase Topic          | Likely Pitfall                          | Mitigation                                             |
| -------------------- | --------------------------------------- | ------------------------------------------------------ |
| Asset extraction     | Base64 leaking back into JS bundle (#1) | Set assetsInlineLimit: 0, check dist size              |
| SVG component        | Shadow DOM breaking SVG ID refs (#2)    | Audit url(#) references before moving to Shadow DOM    |
| SVG component        | ViewBox coordinate mismatch (#6)        | Preserve and test svgCoordsToScreen at multiple sizes  |
| Build / distribution | import.meta.url failing in UMD (#3)     | Provide asset-base attribute fallback                  |
| Component API        | Custom element name collision (#9)      | Use bm- prefix for all internal elements               |
| Data integration     | Data file exceeding CDN limits (#8)     | Split into per-body-part JSON files                    |
| Full refactor        | Losing functionality (#4)               | Write E2E tests against current app BEFORE refactoring |
| Polish               | Touch event gaps (#7)                   | Use pointer events API, add touch-action CSS           |
| Polish               | Modal focus trap (#11)                  | Implement focus management in body-map-modal           |

## Sources

- MDN Shadow DOM: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM (verified)
- MDN Custom Elements: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements (verified)
- Codebase analysis: `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/CONCERNS.md` (primary sources)
- Training data on SVG-in-Shadow-DOM edge cases, Vite asset handling
