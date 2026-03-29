# Architecture

**Analysis Date:** 2026-03-29

## Pattern Overview

**Overall:** Single-file monolithic web application with inline CSS, SVG, and JavaScript, supplemented by three external data-only JS files.

**Key Characteristics:**

- Zero build system -- the entire app runs by opening `interactive-body-model.html` in a browser
- All presentation logic (CSS), markup (HTML/SVG), and behavior (JS) coexist in one ~7000-line file
- External data is loaded via `<script src="...">` tags that assign global `window.*` variables
- All JavaScript is wrapped in a single IIFE `(function () { ... })()` to avoid polluting global scope, with explicit `window.*` assignments for functions called from inline `onclick` handlers
- DOM manipulation is imperative -- no framework, no virtual DOM, no templating engine

## Layers

**Presentation Layer (CSS):**

- Purpose: All visual styling, layout, animations, and responsive breakpoints
- Location: `interactive-body-model.html` lines 7-1277 (inline `<style>` block)
- Contains: Grid layout, component styles, hover/selected states, keyframe animations, responsive media queries
- Depends on: Nothing external
- Used by: HTML markup and dynamically created DOM elements

**Markup Layer (HTML + SVG):**

- Purpose: Page structure, interactive body model with two SVGs (front view + back view)
- Location: `interactive-body-model.html` lines 1279-2573
- Contains: Four-column grid layout, left sidebar panels, center body model with layered SVG, right detail panel, column 4 disease/symptom sections, symptom selection modal
- Depends on: CSS styles
- Used by: JavaScript event handlers and DOM queries

**Data Layer (Constants + External Files):**

- Purpose: All medical/anatomical data -- body systems, organ mappings, body parts, symptoms, diseases
- Location: Inline constants at `interactive-body-model.html` lines 2579-4745, plus three external files:
  - `symptoms-data.js` (~440KB, assigns `window.SYMPTOMS_DATA` -- array of ~18K symptom strings)
  - `diseases-data.js` (~7.6MB, assigns `window.DISEASES_BY_BODY_PART` -- object keyed by body part ID)
  - `symptoms-by-bodypart-data.js` (~100KB, assigns `window.SYMPTOMS_BY_BODY_PART` -- object keyed by body part ID)
- Contains: `BODY_SYSTEMS` array (11 systems with base64 thumbnails), `ORGAN_TO_SYSTEM` reverse lookup, `SYSTEM_TO_BODY_PARTS` mapping, `BODY_PARTS_DATA` (57 body parts), `SECTION_SYMPTOMS`, `ORGAN2_SYMPTOMS`, various coordinate/region lookup tables
- Depends on: Nothing
- Used by: Behavior layer functions

**Behavior Layer (JavaScript):**

- Purpose: All interactivity -- event handling, state management, DOM rendering, view switching
- Location: `interactive-body-model.html` lines 2577-7009 (inline `<script>` block)
- Contains: State variables, rendering functions, event listeners, view/gender/rotation logic
- Depends on: Data layer, Markup layer (DOM queries by ID and class selectors)
- Used by: Inline `onclick` handlers in HTML, and self-registered event listeners

## Data Flow

**System Selection Flow:**

1. User clicks a system in the left sidebar (`.systems-list li a`)
2. `selectSystem(systemId)` is called
3. Previous system is deselected (organ highlights removed, body part ellipses cleaned up)
4. `activeSystem` state variable is set
5. Organs mapped to the system are highlighted via `.selected` CSS class on `<g>` groups
6. Body parts mapped via `SYSTEM_TO_BODY_PARTS` are added to `selectedBodyParts` Set and `systemSelectedBodyParts` Set
7. SVG ellipse highlights are drawn in `bp-highlight-layer` for sections view
8. `showTooltip(systemId)` populates the right-column detail panel
9. `renderBodyPartsNavPanel()` updates the left-column body parts list
10. `renderBodyPartCards()` updates column 4 body part cards
11. `renderSpanningSections()` shows column 4 disease/symptom panels

**Organ Click Flow (Organs/Organs2 View):**

1. User clicks a hit-area `<path>` inside a `body-part-group` `<g>`
2. Event listener on `.body-part-group .hit-area` fires
3. In Organs view: toggles organ in `selectedOrgans` Set, adds/removes `.selected` class
4. `syncBodyPartsFromOrgan(organId, isSelected)` updates `selectedBodyParts` based on `BODY_PARTS_DATA[].organIds` mapping
5. `renderSelectedList()`, `renderBodyPartsNavPanel()`, `renderBodyPartCards()` update UI
6. In Organs2 view: opens symptom modal instead of toggling selection

**Section Click Flow (Sections View):**

1. User clicks a `section-hit-area` inside a `body-section-group`
2. Toggles section in `selectedSections` Set
3. Opens `symptomModal` positioned near click point via `positionModal(e)`
4. User can search/select symptoms within the modal

**Body Part Toggle Flow (Nav Panel):**

1. User clicks a body part in the left-column Body Parts nav list
2. `window.toggleBodyPart(bpId)` is called
3. In Sections view: toggles body part in `selectedBodyParts` Set, creates/removes SVG ellipse highlights in `bp-highlight-layer`
4. In Organs2 view: opens organ2 symptom modal
5. In Organs view: toggles body part in `selectedBodyParts`, highlights/unhighlights mapped organs
6. `renderBodyPartsNavPanel()` and `renderBodyPartCards()` update UI
7. `renderSpanningSections()` shows/hides column 4 disease/symptom data

**State Management:**

- `selectedOrgans` (Set): Currently selected organ IDs in organs view
- `selectedSections` (Set): Currently selected section IDs in sections view
- `selectedSymptoms` (Map): Key is `"sectionId::symptomName"`, value is `{ section, symptom, sectionName }`
- `selectedBodyParts` (Set): Currently selected body part IDs (from nav panel or system selection)
- `systemSelectedBodyParts` (Set): Body parts auto-added by system selection (tracked separately for cleanup)
- `activeSystem` (string|null): Currently active body system ID
- `currentView` (string): `'organs'`, `'organs2'`, or `'sections'`
- `currentGender` (string): `'male'` or `'female'`
- `isFlipped` (boolean): Whether the model is showing the back view
- `organ2HighlightedGroup` (Element|null): Tracks temporarily highlighted organ in organs2 mode
- `currentModalContext` (object|null): `{ type: 'section'|'organ2', key, name }` for open symptom modal

All state is held in plain JavaScript variables within the IIFE closure. There is no centralized state store or reactive binding system. UI updates are triggered manually by calling render functions after state changes.

## Key Abstractions

**Body Part Group (`body-part-group`):**

- Purpose: Represents a single interactive organ in the SVG (organs view)
- Examples: `<g id="group-brain" class="body-part-group" data-part="brain" data-name="Brain">`
- Pattern: Each group contains a `<image class="part-image">` with base64 PNG and a `<path class="hit-area">` defining the clickable polygon
- 20 organ groups total (lines 1374-2031)

**Body Section Group (`body-section-group`):**

- Purpose: Represents a clickable body region in the SVG (sections view)
- Examples: `<g class="body-section-group" data-part="head_neck" data-name="Head / Neck">`
- Pattern: Each group contains a `<path class="section-hit-area">` with a large polygon covering a body zone
- 7 front sections, 7 back sections (some paired for arms/legs)

**Body Part Data Entry (`BODY_PARTS_DATA[]`):**

- Purpose: Represents a selectable body part in the nav panel (57 total)
- Examples: `{ id: "bp_head", name: "Head", image: "bpart_images/head.png", organIds: [], description: "..." }`
- Pattern: Each entry has an `id`, display `name`, thumbnail `image` path, array of linked `organIds`, and a medical `description`
- Location: `interactive-body-model.html` lines 5694-6383

**Body System (`BODY_SYSTEMS[]`):**

- Purpose: Represents one of 11 body systems with metadata
- Examples: `{ id: "cardiovascular", title: "Cardiovascular", color: "#e87722", thumbnail: "data:image/png;base64,...", description: "...", organs: ["heart"], keyParts: "Heart, Blood Vessels, Blood", processes: [...] }`
- Location: `interactive-body-model.html` lines 2579-3225

**Highlight Region (`BODY_PART_HIGHLIGHT_REGIONS`):**

- Purpose: Maps body part IDs to SVG ellipse coordinates for overlay highlights in sections view
- Pattern: `{ bp_head: { cx: 348, cy: 110, rx: 50, ry: 55 }, bp_ears: [{ cx: 305, cy: 115, rx: 12, ry: 18 }, { cx: 392, cy: 115, rx: 12, ry: 18 }] }`
- Location: `interactive-body-model.html` lines 4556-4744

## Entry Points

**Page Load:**

- Location: `interactive-body-model.html` (open in browser)
- Triggers: Browser loads HTML, parses CSS, renders SVG, executes inline script IIFE
- Responsibilities: Builds sidebar, registers event listeners, calls `setView("sections")` as default, triggers entrance animations

**View Toggle Buttons:**

- Location: `interactive-body-model.html` lines 1316-1326 (HTML), line 4856 (`window.setView`)
- Triggers: `onclick="setView('organs')"`, `onclick="setView('organs2')"`, `onclick="setView('sections')"`
- Responsibilities: Crossfade SVG layers, update button active state, manage highlight overlays

**Gender Toggle Buttons:**

- Location: `interactive-body-model.html` lines 2404-2410 (HTML), line 5004 (`window.setGender`)
- Triggers: `onclick="setGender('male')"` / `onclick="setGender('female')"`
- Responsibilities: Show/hide reproductive organ layers, swap body parts if reproductive system active

**Rotate Link:**

- Location: `interactive-body-model.html` lines 2413-2421 (HTML), line 5101 (`window.rotateModel`)
- Triggers: `onclick="rotateModel()"`
- Responsibilities: CSS 3D flip via `.flipped` class, swap front/back section layers

## Error Handling

**Strategy:** Minimal -- defensive null checks but no structured error handling

**Patterns:**

- Null/undefined guards: `if (!bp) return;`, `if (!sys) return;`
- Graceful image fallback: `onerror="this.style.display='none'"` on body part thumbnails
- Optional data: `window.SYMPTOMS_DATA || null` for external data that may not load
- No try/catch blocks, no error boundaries, no user-facing error messages

## Cross-Cutting Concerns

**Logging:** None. No `console.log` statements or logging framework.

**Validation:** None. No input validation beyond null checks on DOM elements.

**Authentication:** Not applicable. This is a static client-side application with no auth.

**Animation:** CSS transitions for hover/select states (`transition: fill 0.2s ease`), CSS 3D transforms for rotation (`transform: rotateY(180deg)`), opacity crossfade for view switching (`transition: opacity 0.35s ease-in-out`), keyframe animations for entrance effects (`slideDownBounce`, `dropDownJerk`, `slideFromRight`).

**Responsive Design:** Single `@media (max-width: 900px)` breakpoint collapses the four-column grid to single-column layout. Defined at `interactive-body-model.html` lines 607-650.

---

_Architecture analysis: 2026-03-29_
