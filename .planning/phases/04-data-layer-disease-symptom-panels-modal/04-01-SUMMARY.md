---
phase: 04-data-layer-disease-symptom-panels-modal
plan: 01
subsystem: data
tags: [typescript, vitest, fetch, cache, data-service, json-splitting]

# Dependency graph
requires: []
provides:
  - DataService singleton with fetchDiseases, fetchSymptomsForPart, clearCache
  - Section-to-body-part key mapping for modal data lookups
  - split-diseases Node.js script generating 83 per-body-part JSON files
  - 8 DataService unit tests covering fetch, cache, bp_ prefix, and error paths
affects:
  - 04-03-data-panel (consumes fetchDiseases, fetchSymptomsForPart)
  - 04-04-modal (consumes fetchDiseases, fetchSymptomsForPart, SECTION_TO_BP_KEYS)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Module-level singleton with Map cache and in-flight deduplication via Promise
    - bp_ prefix applied internally — consumers pass un-prefixed organ IDs

key-files:
  created:
    - src/data/data-service.ts
    - src/data/section-mapping.ts
    - scripts/split-diseases.js
    - src/__tests__/data-service.test.ts
  modified:
    - package.json
    - .gitignore

key-decisions:
  - "Strip ICD-10-CM codes at fetch boundary — DiseaseEntry only carries name (D-04)"
  - "Single bulk symptoms fetch shared across all body parts — prevents N requests (D-06)"
  - "generated public/data/diseases/ added to .gitignore — output of split-diseases script"

patterns-established:
  - "DataService pattern: module-level singleton state, Map cache, in-flight dedup via shared Promise"
  - "bp_ prefix applied internally — all callers pass bare organ IDs like 'brain', not 'bp_brain'"

requirements-completed: [DATA-04, DATA-05]

# Metrics
duration: 20min
completed: 2026-04-06
---

# Plan 04-01: DataService, Split Script, Section Mapping Summary

**DataService singleton with Map cache and bp\_ prefix mapping, 83 split disease JSON files, and section-to-body-part key map for modal lookups**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-04-06
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- `fetchDiseases` fetches per-body-part disease files with bp\_ prefix mapping and Map cache (no duplicate requests)
- `fetchSymptomsForPart` loads all symptoms from a single bulk JSON and serves from cache
- `clearCache` resets all module-level state for test isolation
- `split-diseases.js` splits `public/data/diseases.json` into 83 per-body-part files with ICD codes stripped
- `SECTION_TO_BP_KEYS` maps the 5 front section IDs to their relevant bp\_ data keys
- 65/65 tests passing (8 new DataService tests)

## Task Commits

1. **Task 1 (RED): DataService tests** — `e35a6f9` (test)
2. **Task 1 (GREEN): DataService implementation** — `178cd79` (feat)
3. **Task 2: Split script, section mapping, npm script** — `bb69016` (feat)

## Files Created/Modified

- `src/data/data-service.ts` — DataService singleton (fetchDiseases, fetchSymptomsForPart, clearCache)
- `src/data/section-mapping.ts` — SECTION_TO_BP_KEYS mapping for 5 front sections
- `scripts/split-diseases.js` — ESM Node.js script splitting diseases.json into 83 files
- `src/__tests__/data-service.test.ts` — 8 unit tests for cache, fetch, and error paths
- `package.json` — added `"split-diseases": "node scripts/split-diseases.js"` script
- `.gitignore` — added `public/data/diseases/` (generated files)

## Decisions Made

- Stripped ICD codes at the fetch boundary per D-04; `DiseaseEntry` only exposes `name`
- Single bulk fetch for symptoms shared across all body parts to prevent N network requests (D-06)
- `assetBase` parameter added to both fetch functions for flexible deployment path configuration
- `public/data/diseases/` excluded from git — generated output, not source

## Deviations from Plan

**Note:** The worktree executor agent completed Task 1 but the agent was cut off before completing Task 2. Files were recovered from the worktree and committed cleanly to the main branch, skipping the corrupted worktree branch (which had accidentally staged deletions of .planning/ files).

None in terms of logic — all plan specifications followed exactly.

## Issues Encountered

- Worktree agent (abbc708a) stopped before finishing Task 2 and creating SUMMARY.md
- The test commit in the worktree accidentally staged deletions of .planning/ files (git add -A in worktree without those files in the working directory)
- Recovery: extracted code from worktree working directory, applied to main branch with clean commits

## Next Phase Readiness

- DataService and section mapping ready for Plan 04-03 (data panel) and Plan 04-04 (modal)
- 83 disease JSON files in `public/data/diseases/` — run `npm run split-diseases` after checkout to regenerate

---

_Phase: 04-data-layer-disease-symptom-panels-modal_
_Completed: 2026-04-06_
