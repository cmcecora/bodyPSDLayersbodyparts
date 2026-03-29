# Coding Conventions

## File Naming

| Pattern                     | Examples                                                               | Notes                                     |
| --------------------------- | ---------------------------------------------------------------------- | ----------------------------------------- |
| Kebab-case HTML             | `interactive-body-model.html`                                          | Main application file                     |
| Kebab-case JS data files    | `diseases-data.js`, `symptoms-data.js`, `symptoms-by-bodypart-data.js` | External data loaded via `<script>` tags  |
| Snake_case test screenshots | `test_head_selected.png`, `test_all_57_parts.png`                      | Manual QA artifacts                       |
| Kebab-case test screenshots | `test-ellipses-head-v1.png`, `test-body-parts-fullview.png`            | Newer test screenshots (mixed convention) |
| PSD source files            | `blankaasd.psd`, `femaleBodygreen.psd`                                 | No consistent naming for source assets    |

## CSS Conventions

### Class Naming

- **Kebab-case** throughout: `.body-part-group`, `.systems-panel`, `.left-column`, `.symptom-modal-list`
- **BEM-like** in some areas but not strictly enforced: `.systems-list li a` (descendant selectors preferred over BEM modifiers)
- **Functional prefixes**: `.page-layout`, `.body-model-container`, `.tooltip-panel`

### CSS Organization (within `<style>` tag)

1. Reset / global styles (`*`, `body`)
2. Layout grid (`.page-layout`, column wrappers)
3. Component blocks (`.systems-panel`, `.body-parts-panel`, `.tooltip-panel`)
4. Element states (`:hover`, `.active`, `.selected`)
5. SVG-specific styles (`.body-part-group`, `.hit-area`, `.part-image`)
6. Responsive / animation rules

### Color System

- Background: `#f5f5f5` (page), `#fff` (panels)
- Headers: `#434448` background with `#fff` text
- Accent: `#6cb5f4` (blue border/highlight)
- Hover: `rgba(100, 180, 255, 0.35)` (blue overlay)
- Borders: `#e0e0e0` (panels), `#f0f0f0` (list dividers)
- Each body system has a dedicated color (e.g., cardiovascular: `#e87722`)

## HTML Conventions

### SVG Structure

- Body parts wrapped in `<g class="body-part-group" data-part="..." data-name="...">`
- Each group contains: `<image class="part-image">` (base64 PNG) + `<path class="hit-area">` (click target)
- Group IDs follow `group-{part_id}` pattern (e.g., `group-brain`, `group-heart`)
- Data attributes: `data-part` (snake_case ID), `data-name` (human-readable display name)

### ID Naming

- Panel IDs: camelCase (`systemsList`, `tooltipContent`, `tooltipProcesses`, `symptomModalList`)
- System list items: `system-{id}` (e.g., `system-cardiovascular`)
- SVG groups: `group-{part_id}` (e.g., `group-brain`)

## JavaScript Conventions

### Module Pattern

- Entire app wrapped in a single IIFE: `(function() { ... })()`
- No ES modules, no imports/exports
- Global functions exposed via `window.setView`, `window.setGender`, `window.rotateModel`

### Variable Naming

| Pattern            | Scope                      | Examples                                                                        |
| ------------------ | -------------------------- | ------------------------------------------------------------------------------- |
| `UPPER_SNAKE_CASE` | Constants/data             | `BODY_SYSTEMS`, `ORGAN_TO_SYSTEM`, `BODY_PARTS_DATA`, `SYSTEM_TO_BODY_PARTS`    |
| `camelCase`        | Local variables, functions | `activeSystem`, `selectedBodyParts`, `selectSystem()`, `renderSystemsSidebar()` |
| `var`              | Older code sections        | DOM element references in `selectSystem`/`deselectSystem`                       |
| `const`/`let`      | Newer code sections        | System-related logic, newer functions                                           |

### Function Style

- Named `function` declarations for top-level functions: `function selectSystem(systemId) { ... }`
- Anonymous `function` expressions for callbacks: `.forEach(function(item) { ... })`
- No arrow functions used anywhere in the codebase
- No async/await or Promises

### Data Structure Patterns

- Arrays of objects for ordered data: `BODY_SYSTEMS`, `BODY_PARTS_DATA`
- Plain objects for lookup maps: `ORGAN_TO_SYSTEM`, `SYSTEM_TO_BODY_PARTS`, `BP_TO_ORGAN2_KEY`
- `Set` for tracking selections: `selectedBodyParts`, `systemSelectedBodyParts`
- Linear `.find()` scans on arrays rather than Map/object lookups

### DOM Manipulation

- Direct DOM API: `document.getElementById()`, `document.createElement()`, `document.querySelectorAll()`
- No jQuery, no templating library
- Event listeners added via `addEventListener()` (not inline `onclick` attributes in HTML)
- SVG namespace creation: `document.createElementNS("http://www.w3.org/2000/svg", ...)`

### State Management

- Module-scoped mutable variables: `activeSystem`, `selectedBodyParts`, `currentView`, `currentGender`
- No state container, no pub/sub, no reactive system
- State changes trigger imperative DOM updates (manual add/remove classes, create/destroy elements)

## Comment Style

- Section-delimiting comments: `/* Four-column layout wrapper */`, `/* Body Systems sidebar */`
- Inline comments are sparse — code is mostly self-documenting by naming
- No JSDoc, no @param annotations, no type hints
- TODO/FIXME markers are rare to nonexistent
