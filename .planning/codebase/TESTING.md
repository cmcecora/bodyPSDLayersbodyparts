# Testing

## Current State: No Automated Testing

This project has **zero automated tests** — no test framework, no test runner, no CI/CD pipeline.

## Manual QA Approach

### Visual Screenshot Verification

Testing is done by manually opening `interactive-body-model.html` in a browser and capturing screenshots to verify visual correctness. Approximately 15+ test screenshots exist in the project root:

| Screenshot                          | Purpose                                     |
| ----------------------------------- | ------------------------------------------- |
| `test_initial.png`                  | Baseline: app loads correctly               |
| `test_head_selected.png`            | Head body part selection highlight          |
| `test_head_deselected.png`          | Head deselection clears highlight           |
| `test_head_eyes_selected.png`       | Multiple sub-part selection                 |
| `test_head_eyes_heart.png`          | Cross-region multi-selection                |
| `test_multiple_parts.png`           | Multiple body parts selected simultaneously |
| `test_many_highlights.png`          | Stress test: many highlights active         |
| `test_all_57_parts.png`             | All body parts highlighted                  |
| `test_with_feet.png`                | Feet body part rendering                    |
| `test_restore_after_tab_switch.png` | State preservation across views             |
| `test-body-parts-fullview.png`      | Full body model overview                    |
| `test-ellipses-head-v1/v2/v3.png`   | Ellipse highlight iteration                 |

### Playwright MCP Browser Automation

A `.playwright-mcp/` directory exists with a console log file (`console-2026-03-23T03-46-02-313Z.log`), indicating that Playwright MCP was used for browser-based interactive testing. This appears to be ad-hoc rather than scripted test suites.

## What Should Be Tested

### Critical Paths (no automated coverage)

1. **Body part selection/deselection** — click toggles, multi-selection, pill list sync
2. **Body system selection** — system click highlights mapped organs, tooltip updates
3. **Bidirectional sync** — organ click activates system, system deselect clears organs
4. **Gender toggle** — reproductive organs swap correctly, existing selections preserved
5. **View switching** — organs/sections tabs, state preservation across views
6. **Symptom modal** — opens on section click, displays correct symptoms/diseases

### Data Integrity (no validation)

- All body parts in `BODY_PARTS_DATA` have corresponding SVG groups
- All organ IDs in `BODY_SYSTEMS` map to valid SVG elements
- `ORGAN_TO_SYSTEM` reverse lookup is consistent with `BODY_SYSTEMS.organs`
- `SYSTEM_TO_BODY_PARTS` maps all system IDs to valid body part IDs

## Recommended Test Strategy (Future)

### Tier 1: Data Validation (easiest to add)

- Node.js script to validate cross-references between data structures
- Can run without a browser — pure JS assertions

### Tier 2: DOM Integration Tests

- Playwright or Puppeteer tests against the static HTML file
- Verify click handlers, visual states, element visibility

### Tier 3: Visual Regression

- Screenshot comparison (e.g., Playwright `toHaveScreenshot()`)
- Baseline already exists as `test_*.png` files
