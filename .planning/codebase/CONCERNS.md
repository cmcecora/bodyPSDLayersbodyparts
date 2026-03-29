# Concerns & Technical Debt

## Severity Legend

- **CRITICAL** - Blocks scaling or causes user-facing issues
- **HIGH** - Significant maintenance burden or performance risk
- **MEDIUM** - Worth addressing during related work
- **LOW** - Minor, opportunistic fixes

---

## 1. Architecture & Scalability

### Monolithic Single-File Architecture (HIGH)

- `interactive-body-model.html` is 7,011 lines / 3.87 MB — all CSS, SVG, HTML, and JS inline
- Every change touches the same file, increasing merge conflict risk
- No module system: all functions and data share a single global IIFE scope
- Three external data files (`diseases-data.js` at 7.6 MB, `symptoms-data.js` at 440 KB, `symptoms-by-bodypart-data.js`) are loaded via `<script>` tags with no lazy loading

### Base64-Encoded Images in HTML (HIGH)

- Body part PNGs and 11 system thumbnails are base64-encoded directly in `<image>` tags within the SVG
- Inflates the HTML file size (~3.87 MB) — base64 is ~33% larger than raw binary
- Cannot be independently cached by browsers (everything loads as one document)
- PSD source files (`blankaasd.psd`, `bodybackviewwoman.psd`, `femaleBodygreen.psd`, etc.) are also tracked in git, bloating the repository

### Hardcoded Data Model (MEDIUM)

- Body parts, body systems, organ mappings, highlight regions, symptoms, and diseases are all hardcoded in JS data structures
- Adding a new body part requires editing multiple data arrays (`BODY_PARTS_DATA`, `BODY_PART_HIGHLIGHT_REGIONS`, `BP_TO_ORGAN2_KEY`, `ORGAN_TO_SYSTEM`, `SYSTEM_TO_BODY_PARTS`, etc.)
- No schema validation — data consistency depends on manual correctness

---

## 2. Performance

### Large Initial Page Load (CRITICAL)

- Total page weight: ~3.87 MB (HTML) + ~8 MB (JS data files) = **~12 MB** before rendering
- No code splitting, lazy loading, or progressive rendering
- All 7,011 lines of CSS/JS parsed synchronously on load

### Uncached DOM Queries (HIGH)

- ~91 `getElementById()` calls and ~37 `querySelectorAll()` calls, many repeated inside event handlers and render loops
- Functions like `selectSystem()`, `deselectSystem()`, and `updateSystemFromOrgan()` re-query DOM elements on every invocation
- `BODY_SYSTEMS.find()` linear scans repeated frequently instead of using a lookup map

### Full Re-renders (MEDIUM)

- Body part card list, symptom lists, and system sidebar are fully rebuilt on state changes
- No virtual DOM or diffing — entire sections cleared via `innerHTML = ""` and rebuilt

---

## 3. Code Quality

### Mixed Variable Declarations (LOW)

- Codebase uses a mix of `var`, `const`, and `let` — no consistent standard
- Older sections use `var` (function-scoped), newer additions use `const`/`let` (block-scoped)

### Empty/Stub Functions (LOW)

- Some touch event handlers reference functions that may be stubs
- `touchstart` handlers at lines ~5651-5663 without corresponding `touchend` logic visible

### Duplicated Logic (MEDIUM)

- `selectSystem()` and `deselectSystem()` share significant overlapping logic for managing SVG group highlights, ellipse creation, and pill list updates
- Ellipse creation for body part highlights is duplicated across `selectSystem()` and `setGender()`

---

## 4. Security

### innerHTML Usage (MEDIUM)

- 2 uses of `innerHTML` — while the data is hardcoded (not user-supplied), this pattern is a risk if data sources change
- No Content Security Policy (CSP) headers possible (static HTML file)

### No Input Sanitization Boundary (LOW)

- Currently safe because all data is hardcoded, but if search/filter inputs are added (symptom filter exists), any future connection to external data should sanitize inputs

---

## 5. Accessibility

### Minimal ARIA Support (HIGH)

- Only 2 `aria-` or `role=` attributes in the entire 7,011-line file
- SVG body parts are not keyboard-navigable
- No screen reader labels on interactive organ regions
- No focus management for modal overlays (symptom modal)
- No skip-navigation links or landmark regions

### No Color-Blind Support (MEDIUM)

- Organ highlights rely on color alone (blue hover, green selection, system-specific colors)
- No alternative indicators (patterns, icons, or text labels) for color-blind users

---

## 6. Missing Features / Placeholders

### Back View is Placeholder (MEDIUM)

- Rotate button exists but back view has no actual body part artwork — displays placeholder
- No back-view PSD has been created yet

### No State Persistence (MEDIUM)

- Selected body parts, active system, and gender are lost on page refresh
- No localStorage, URL hash, or session state mechanism

### No Responsive/Tablet Breakpoint (MEDIUM)

- Four-column grid layout (`240px minmax(0, 380px) 340px minmax(300px, 1fr)`) assumes wide desktop viewport
- No media queries for tablet or mobile layouts
- Sticky columns may overlap on narrow screens

---

## 7. Repository Hygiene

### Large Binary Assets in Git (HIGH)

- Multiple PSD files (2-5 MB each), PNG screenshots, and an 12 MB Excel file tracked in git history
- Repository will grow continuously as these binaries are updated
- No `.gitattributes` with LFS configuration

### Uninformative Commit Messages (LOW)

- Recent commits: "updating again", "another one", "cleaning up"
- Makes git bisect and blame less useful for debugging

---

## 8. Testing

### Zero Automated Tests (HIGH)

- No test framework, no test files, no CI pipeline
- All testing is manual browser verification
- No regression safety net for the complex bidirectional selection logic
- No visual regression testing for SVG/CSS rendering
