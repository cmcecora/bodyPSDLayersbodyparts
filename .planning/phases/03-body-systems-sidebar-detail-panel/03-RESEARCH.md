# Phase 3: Body Systems Sidebar & Detail Panel - Research

**Researched:** 2026-03-29
**Domain:** Lit v3 Web Components + cross-component state orchestration + typed data modules
**Confidence:** HIGH for architecture and implementation shape, MEDIUM for browser-specific SVG behavior until re-verified in a real browser

## Summary

Phase 3 should be implemented as coordinated state flow in `<body-map-explorer>`, not as a store-driven or DOM-query-driven feature. The existing codebase already has the right foundation: a Lit/Vite/TypeScript library shell, a working `<body-map-model>` component, Vitest with `happy-dom`, canonical organ geometry modules, and extracted system thumbnails in `public/assets/systems/`.

The standard implementation path is:

1. Add a typed `src/data/systems.ts` module that contains the 11 systems, their colors, descriptions, thumbnail URLs, and mapped organ IDs, plus a reverse `ORGAN_TO_SYSTEM` lookup.
2. Add two new presentational components: `<body-map-sidebar>` and `<body-map-detail-panel>`.
3. Move cross-component state ownership into `<body-map-explorer>` using top-down reactive properties:
   - `activeSystemId: string | null`
   - `selectedOrganIds: string[]`
   - `systemHighlightOrganIds: string[]`
4. Extend `<body-map-model>` so it accepts external highlight/selection inputs and emits composed bubbling events upward, instead of being the long-term owner of all Phase 3 selection state.

**Primary recommendation:** Keep the current stack, add zero new runtime dependencies, use immutable arrays for public reactive state, and make `<body-map-explorer>` the single source of truth for sidebar selection, detail-panel state, and model highlighting.

**Important correction:** Official Lit docs say `svg\`\`` is for SVG fragments and the outer `<svg>` element belongs in an `html\`\`` template. The current `src/body-map-model.ts` returns the outer `<svg>` from a `svg\`\`` template. Because the component already exists, treat this as a verification item while editing Phase 3, not as a blind refactor disconnected from browser validation.

## Phase Requirements

| ID | Description | Research Support |
| --- | --- | --- |
| SYSTEM-01 | Left sidebar displays all 11 body systems with color dots and thumbnails | `src/data/systems.ts` + `<body-map-sidebar>` rendering from typed data |
| SYSTEM-02 | Clicking a system highlights all mapped organs in the body model | `<body-map-explorer>` derives `systemHighlightOrganIds` from selected system and passes them into `<body-map-model>` |
| SYSTEM-03 | Clicking an organ activates the corresponding system in the sidebar | `<body-map-model>` emits event, explorer looks up first matching system via `ORGAN_TO_SYSTEM`, sidebar receives `activeSystemId` |
| SYSTEM-04 | Right detail panel shows selected system description and thumbnail | `<body-map-detail-panel>` gets `system: BodySystemDefinition | null` from explorer |
| SYSTEM-05 | Deselecting a system clears all system-driven highlights | explorer clears `activeSystemId` and resets `systemHighlightOrganIds` without mutating unrelated organ-selection state |

## Standard Stack

### Core

| Library | Repo-pinned version | Purpose | Recommendation |
| --- | --- | --- | --- |
| `lit` | `^3.0.0` | Component model, reactive properties, templating, custom events | Keep as-is; no state library needed |
| `typescript` | `^5.5.0` | Typed system/organ data, safe component APIs | Keep as-is; use interfaces for systems and mappings |
| `vite` | `^6.0.0` | Library build and dev server | Keep current library mode config |
| `vitest` | `^4.1.2` | Unit testing for coordinator logic and child-component rendering | Keep current setup |
| `happy-dom` | `^20.8.9` | Fast DOM-like test environment for Lit components | Keep for unit tests; add browser verification only where SVG behavior is suspect |

### Supporting

| Tool / pattern | Use | Why |
| --- | --- | --- |
| Existing `public/assets/systems/*.webp` assets | Sidebar thumbnails and detail panel images | Already extracted; no new asset pipeline required |
| Existing `src/data/organs.ts` | Canonical organ IDs | Prevents duplicate organ naming and bad mappings |
| Existing `src/styles/tokens.css.ts` | Shared tokens | Sidebar/detail panel should inherit current visual language |

### Prescriptive stack call

- Do not add Redux, Zustand, MobX, `@lit/context`, RxJS, or a custom event bus for Phase 3.
- Do not upgrade the core toolchain during Phase 3 unless a specific compatibility problem forces it.
- Keep Vite library mode and TypeScript declaration output exactly as the baseline packaging path.

## Architecture Patterns

### Pattern 1: Explorer Owns Cross-Component State

**What:** `<body-map-explorer>` becomes the coordinator for all Phase 3 state shared between the sidebar, the body model, and the detail panel.

**Why:** Lit's guidance is to treat public reactive properties as input. Shared UI state is simpler and safer when one component owns it and children receive it via properties plus events.

**State split to use:**

- `activeSystemId: string | null`
- `selectedOrganIds: string[]`
- `systemHighlightOrganIds: string[]`

**Key rule:** `selectedOrganIds` and `systemHighlightOrganIds` are not the same thing. One represents direct organ selection, the other represents transient system-driven highlighting. Keep them separate.

### Pattern 2: Typed `systems.ts` Data Module

**What:** Add `src/data/systems.ts` as the single source of truth for:

- system id
- display title
- accent color
- description
- thumbnail path
- mapped organ IDs

Also export a reverse lookup:

- `ORGAN_TO_SYSTEM: Record<string, string[]>`

**Why:** The mappings already exist conceptually in the legacy three-column design doc and the old HTML, but Phase 3 should not parse legacy markup at runtime. A typed module is the stable middle layer between the extracted assets and the new components.

### Pattern 3: Presentational Sidebar and Detail Panel Components

**What:** Implement:

- `src/body-map-sidebar.ts`
- `src/body-map-detail-panel.ts`

Both should be dumb renderers with small public APIs and event outputs.

**Sidebar API shape:**

- `systems: BodySystemDefinition[]`
- `activeSystemId: string | null`

**Sidebar event:**

- `system-toggle-request`

**Detail panel API shape:**

- `system: BodySystemDefinition | null`

**Why:** This keeps the state transitions in one place and makes the new components testable without rendering the full explorer.

### Pattern 4: Controlled Inputs Into `<body-map-model>`

**What:** Extend the existing model so it renders based on external properties and emits events upward.

Recommended new public properties:

- `selectedOrganIds: string[]`
- `systemHighlightOrganIds: string[]`

Recommended event detail additions:

- preserve `organ-selection-change`
- include `lastToggled` or equivalent metadata if useful for the parent

**Why:** A cross-component feature should not require the parent to query into shadow DOM or imperatively toggle CSS classes on child internals.

### Pattern 5: Top-Down Immutable Updates

**What:** When the explorer updates selection arrays, replace them with new arrays instead of mutating shared objects in place.

**Why:** Lit's default change detection uses strict inequality and does not treat in-place object or array mutation as a change. Immutable updates avoid partial re-render bugs across sibling components.

### Pattern 6: Keep Testing Split Simple

**Unit/component tests in Vitest + happy-dom:**

- sidebar renders 11 systems
- clicking sidebar emits the expected system id
- detail panel shows empty state vs selected system state
- explorer coordination updates model props and detail-panel props correctly
- organ-click event activates the mapped system
- deselection clears system highlights

**Browser verification:**

- verify real-browser rendering of the body model after touching `src/body-map-model.ts`
- specifically check system highlight classes on SVG groups and detail-panel collapse behavior

Use browser verification as a focused supplement, not a new browser-test framework for this phase.

## Don't Hand-Roll

### 1. Do not introduce a global store or context layer

`@lit/context` is intended for data consumed by a wide variety and large number of components. Phase 3 only coordinates three close siblings, so direct property flow from explorer is the standard approach.

### 2. Do not query child shadow DOM from the parent to synchronize state

No `this.renderRoot.querySelector('body-map-model')?.shadowRoot?...classList...`.

The parent should pass reactive properties into children. The model should compute its own classes from those inputs.

### 3. Do not parse `interactive-body-model.html` at runtime

Use it as a reference source only. The typed modules in `src/data/` should remain the canonical runtime data source.

### 4. Do not collapse organ selection and system highlighting into one bucket

If one shared Set drives both behaviors, deselecting a system will accidentally destroy unrelated user-driven organ state and make later pill-list/modal work harder.

### 5. Do not expose Sets as shared public reactive API

Sets are fine for internal implementation details, but cross-component public state should be arrays or ids replaced immutably so Lit can propagate updates cleanly.

### 6. Do not add runtime thumbnail fallback logic

Choose one canonical thumbnail filename per system inside `systems.ts`. If an asset needs renaming later, fix the data file or asset, not the runtime rendering logic.

## Common Pitfalls

### 1. SVG template namespace mismatch

Lit's docs say the outer `<svg>` should live in an `html\`\`` template and `svg\`\`` should be used for SVG fragments. The current model does the opposite. Because Phase 3 touches the same component, verify this carefully in a real browser before assuming the current pattern is safe long-term.

### 2. Events that do not escape Shadow DOM

Cross-component coordination requires events to bubble and cross shadow boundaries. Keep `bubbles: true` and `composed: true` on model and sidebar events.

### 3. In-place mutation causing stale child renders

If the explorer mutates arrays/Sets in place, sibling components may not update because Lit compares by reference by default.

### 4. Missing gender-aware reproductive behavior

The reproductive system maps to both `male_reproductive` and `female_reproductive`, but the visible organ set depends on `currentGender`. Phase 3 must verify that system selection never highlights a hidden reproductive organ as the visible active target.

### 5. Using anchors instead of buttons in the sidebar

This makes toggle behavior, keyboard activation, and ARIA state harder than necessary. Render each system row as a real `<button type="button">`.

### 6. Forgetting the empty detail-panel state

The right panel must explicitly support `null` system state and render a collapsed or placeholder view. Do not leave stale content visible after deselection.

### 7. Rebuilding mappings from DOM instead of data

The reverse lookup should be generated once from `systems.ts`, not inferred by scanning rendered rows or SVG nodes.

## Code Examples

### Example 1: Typed systems data module

```ts
// src/data/systems.ts
export interface BodySystemDefinition {
  id:
    | "cardiovascular"
    | "digestive"
    | "endocrine"
    | "immune"
    | "integumentary"
    | "muscular"
    | "nervous"
    | "reproductive"
    | "respiratory"
    | "skeletal"
    | "urinary";
  title: string;
  color: string;
  description: string;
  thumbnail: string;
  organIds: string[];
}

export const BODY_SYSTEMS: BodySystemDefinition[] = [
  {
    id: "cardiovascular",
    title: "Cardiovascular",
    color: "#e87722",
    description: "...",
    thumbnail: "/assets/systems/cardiovascular.webp",
    organIds: ["heart"],
  },
  // ...
];

export const ORGAN_TO_SYSTEM = BODY_SYSTEMS.reduce<Record<string, string[]>>(
  (lookup, system) => {
    for (const organId of system.organIds) {
      lookup[organId] ??= [];
      lookup[organId].push(system.id);
    }
    return lookup;
  },
  {},
);
```

### Example 2: Explorer as the coordinator

```ts
// src/body-map-explorer.ts
@state() private _activeSystemId: string | null = null;
@state() private _selectedOrganIds: string[] = [];

private get _systemHighlightOrganIds(): string[] {
  const system = BODY_SYSTEMS.find((entry) => entry.id === this._activeSystemId);
  return system ? system.organIds : [];
}

private _handleSystemToggle(event: CustomEvent<{ systemId: string }>) {
  const nextSystemId =
    this._activeSystemId === event.detail.systemId ? null : event.detail.systemId;
  this._activeSystemId = nextSystemId;
}

private _handleOrganSelectionChange(
  event: CustomEvent<{ selected: string[]; lastToggled?: string }>,
) {
  this._selectedOrganIds = event.detail.selected;

  const toggled = event.detail.lastToggled;
  if (!toggled) return;

  const systems = ORGAN_TO_SYSTEM[toggled] ?? [];
  this._activeSystemId = systems[0] ?? null;
}
```

### Example 3: Controlled model inputs

```ts
// src/body-map-model.ts
@property({ attribute: false }) selectedOrganIds: string[] = [];
@property({ attribute: false }) systemHighlightOrganIds: string[] = [];

private _emitOrganSelection(partId: string) {
  const selected = this.selectedOrganIds.includes(partId)
    ? this.selectedOrganIds.filter((id) => id !== partId)
    : [...this.selectedOrganIds, partId];

  this.dispatchEvent(
    new CustomEvent("organ-selection-change", {
      detail: { selected, lastToggled: partId },
      bubbles: true,
      composed: true,
    }),
  );
}

private _isSystemHighlighted(partId: string) {
  return this.systemHighlightOrganIds.includes(partId);
}
```

### Example 4: Sidebar rendering

```ts
// src/body-map-sidebar.ts
render() {
  return html`
    <ul class="systems-list">
      ${this.systems.map(
        (system) => html`
          <li>
            <button
              type="button"
              class=${system.id === this.activeSystemId ? "active" : ""}
              @click=${() => this._emitToggle(system.id)}
            >
              <span class="system-dot" style=${`background:${system.color}`}></span>
              <img src=${system.thumbnail} alt="" />
              <span>${system.title}</span>
            </button>
          </li>
        `,
      )}
    </ul>
  `;
}
```

## References

- Lit reactive properties: https://lit.dev/docs/components/properties/
- Lit events: https://lit.dev/docs/components/events/
- Lit context: https://lit.dev/docs/data/context/
- Lit lists and `repeat`: https://lit.dev/docs/templates/lists/
- Lit template API `svg` details: https://lit.dev/docs/api/templates/
- Vite library mode and build docs: https://vite.dev/guide/build.html
- Vitest config and environment docs: https://vitest.dev/config/
- TypeScript declaration output: https://www.typescriptlang.org/tsconfig/declaration.html

## Bottom Line

Use the existing stack. Put all shared Phase 3 state in `<body-map-explorer>`. Build a typed `systems.ts` module, two presentational child components, and controlled highlight inputs for `<body-map-model>`. Keep selection state and system-highlight state separate, avoid global state tooling, and perform one real-browser verification pass on the SVG model while making the Phase 3 changes.
