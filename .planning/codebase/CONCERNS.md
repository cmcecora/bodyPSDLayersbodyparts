# Codebase Concerns

**Analysis Date:** 2026-04-07

## Tech Debt

**Legacy and current implementations coexist in the same repo:**
- Issue: The shipped library lives under `src/`, `public/`, `vite.config.ts`, and `package.json`, but the repository also keeps the legacy single-file app and its data pipeline in `interactive-body-model.html`, `interactive-body-model-app.js`, `diseases-data.js`, `symptoms-data.js`, `symptoms-by-bodypart-data.js`, `malegreenfront.svg`, and `malegreenback.svg`.
- Files: `CLAUDE.md`, `interactive-body-model.html`, `interactive-body-model-app.js`, `diseases-data.js`, `symptoms-data.js`, `symptoms-by-bodypart-data.js`, `scripts/extract-base64.mjs`, `scripts/extract-silhouette.mjs`, `scripts/extract-sections-body.mjs`
- Impact: Contributors can edit the wrong source tree, and the extraction scripts still depend on legacy HTML markup rather than the Lit/Vite code that actually ships.
- Fix approach: Declare one authoritative source tree, move legacy runtime files into an archived location, and update `CLAUDE.md` plus the planning docs to point at `src/` and `public/`.

**Body-part metadata is hand-synchronized across many tables:**
- Issue: The same `bp_` catalog is maintained separately in `src/data/body-parts.ts`, `src/data/body-part-highlight-regions.ts`, `src/data/body-part-modal-anchor.ts`, `src/data/section-mapping.ts`, `src/data/systems.ts`, `public/data/diseases.json`, `public/data/diseases/*.json`, and `public/data/symptoms-by-part.json`.
- Files: `src/data/body-parts.ts`, `src/data/body-part-highlight-regions.ts`, `src/data/body-part-modal-anchor.ts`, `src/data/section-mapping.ts`, `src/data/systems.ts`, `scripts/validate-bp-coverage.js`
- Impact: Adding or renaming a body part requires coordinated edits across multiple files. `scripts/validate-bp-coverage.js` checks diseases and symptoms coverage, but it does not validate modal anchors or highlight regions.
- Fix approach: Promote one schema file as the source of truth and generate secondary maps from it, or extend validation to cover anchors, highlight regions, and asset references.

**Runtime assets include a large unused tail:**
- Issue: `src/data/body-parts.ts` references 52 unique body-part image files, while `public/assets/body-parts/` contains 77 files. Unused assets include imaging/test files such as `public/assets/body-parts/CT.webp`, `public/assets/body-parts/MRI.webp`, `public/assets/body-parts/x-ray.webp`, `public/assets/body-parts/ultrasound.webp`, and `public/assets/body-parts/wrist.webp`.
- Files: `src/data/body-parts.ts`, `public/assets/body-parts/CT.webp`, `public/assets/body-parts/MRI.webp`, `public/assets/body-parts/x-ray.webp`, `public/assets/body-parts/ultrasound.webp`, `public/assets/body-parts/wrist.webp`
- Impact: Asset review gets noisier, bundle/source directories are harder to audit, and it is unclear which files are still part of the supported product surface.
- Fix approach: Remove or relocate unused body-part assets, or record them in a separate raw/reference asset directory that is excluded from the runtime tree.

## Known Bugs

**Organs 2 falls back to the same modal anchor for 29 body parts:**
- Symptoms: Body parts that are absent from `BODY_PART_MODAL_COORDS` open their Organs 2 modal from the default `{ x: 349, y: 530 }`, which is visually centered around the abdomen instead of the selected anatomy.
- Files: `src/data/body-parts.ts`, `src/data/body-part-modal-anchor.ts`, `src/body-map-explorer.ts`
- Trigger: Selecting sidebar body parts such as `bp_blood_vessels`, `bp_nerves`, `bp_ovaries`, `bp_tongue`, `bp_toes`, `bp_vagina`, or `bp_white_blood_cells` while `currentView === "organs2"`.
- Workaround: None in the UI; the only fix is to add explicit anchors or derive modal positions from highlight regions.

**Section and Organs 2 modals hide partial data failures as empty content:**
- Symptoms: A modal can show an incomplete or empty disease/symptom list without surfacing an error because per-body-part failures are individually converted to `[]`.
- Files: `src/body-map-explorer.ts`, `src/data/data-service.ts`
- Trigger: Missing `public/data/diseases/*.json` shards, invalid JSON responses, or incomplete host-provided `externalData` for one or more `bp_` keys.
- Workaround: Run `node scripts/validate-bp-coverage.js` and inspect the network/data layer manually; the UI does not distinguish “empty data” from “failed request” in these paths.

## Security Considerations

**Fetched and injected data is trusted without schema validation:**
- Risk: `externalData` is accepted as `any`, and fetched JSON is cached after minimal transformation. Malformed payloads, oversized arrays, or mixed key spaces can break rendering or create hard-to-debug state mismatches.
- Files: `src/body-map-explorer.ts`, `src/data/data-service.ts`
- Current mitigation: `src/body-map-modal.ts`, `src/body-map-detail-panel.ts`, and related Lit templates render strings through normal bindings, which keeps disease and symptom text auto-escaped instead of using raw HTML injection.
- Recommendations: Replace `externalData: any` with explicit unions, validate response shape at the fetch boundary, and normalize IDs before they enter component state.

**HTTP failures are not checked at the response boundary:**
- Risk: `fetchDiseases()` and `fetchSymptomsForPart()` call `.json()` without checking `response.ok`, so 404 and 500 responses fail later as opaque parse/runtime errors instead of structured data errors.
- Files: `src/data/data-service.ts`, `src/__tests__/data-service.test.ts`
- Current mitigation: Some callers catch failures and continue rendering.
- Recommendations: Check `response.ok`, throw typed errors with URL and status, and let UI code decide whether to show an error state or an empty state.

## Performance Bottlenecks

**Large section clicks fan out into many disease requests:**
- Problem: `midsection_lower_torso` expands to 27 `bp_` keys and `head_neck` expands to 18. `body-map-explorer` loads each section by calling `Promise.all(bpKeys.map(provider.fetchDiseases))`, which creates many parallel shard requests on a single click.
- Files: `src/data/section-mapping.ts`, `src/body-map-explorer.ts`, `public/data/diseases/*.json`
- Cause: Disease data is sharded by body part, and section aggregation happens on the client at interaction time.
- Improvement path: Precompute section aggregates, ship a manifest that batches section keys, or progressively stream section results with visible partial-loading/error UI.

**Repository size and binary churn slow local tooling:**
- Problem: The working tree is about 1.1 GB. Runtime assets under `public/` use about 20 MB, `bpart_images/` uses about 41 MB, and `docs/` uses about 25 MB. Large tracked artifacts include `tranparentbackview.psd`, `bodybackviewwoman.psd`, `malegreenfront.svg`, `malegreenback.svg`, and `docs/icd10cm_codes_2026.xlsx`.
- Files: `bpart_images/*`, `docs/body_parts_batches/*`, `docs/body_parts_results/*`, `docs/icd10cm_codes_2026.xlsx`, `tranparentbackview.psd`, `bodybackviewwoman.psd`, `malegreenfront.svg`, `malegreenback.svg`
- Cause: Raw artwork, research batches, screenshots, and reference exports live beside the shipping package.
- Improvement path: Move archival and research artifacts out of the main repo or onto Git LFS, and keep the runtime tree focused on files required by `src/`, `public/`, and the build scripts.

## Fragile Areas

**The external data contract mixes organ IDs and `bp_` IDs:**
- Files: `src/body-map-explorer.ts`, `src/data/data-service.ts`, `src/body-map-explorer.test.ts`
- Why fragile: `_loadOrganData()` calls providers with unprefixed organ IDs such as `heart`, while section and body-part paths use `bp_` IDs such as `bp_head`. The static object form of `externalData` does not normalize either form, so host applications must guess which key namespace to supply for each interaction path.
- Safe modification: Introduce one canonical identifier type for component state, normalize at the boundary, and update the provider interface to accept only that canonical form.
- Test coverage: `src/body-map-explorer.test.ts` covers a few happy paths for `heart` and `bp_head`, but it does not exercise the full mixed-key surface across all body-part and system-detail flows.

**The test suite is split and allows unexpected network-style noise:**
- Files: `src/body-map-explorer.test.ts`, `src/__tests__/body-map-explorer.test.ts`, `vitest.config.ts`
- Why fragile: Both explorer suites run under the same `src/**/*.test.ts` include pattern, but they use different setup styles. `npm test` passes with repeated `connect EPERM ::1:3000` / `127.0.0.1:3000` errors in the output, which means real regressions can be buried inside noisy green runs.
- Safe modification: Consolidate on one explorer suite, add a shared test setup that stubs fetch and rejects unexpected network/asset access, and fail the run on leaked requests.
- Test coverage: The suite has broad behavior checks, but there is no CI config in `.github/` and no coverage threshold enforcing which scenarios must remain tested.

## Scaling Limits

**Unused duplicate data formats increase content surface area without helping the runtime:**
- Current capacity: The runtime uses sharded disease files in `public/data/diseases/*.json` plus `public/data/symptoms-by-part.json`. The repository still tracks `public/data/diseases.json` at 7,633,459 bytes and `public/data/symptoms.json` at 421,504 bytes, even though the shipped `src/` code does not read them.
- Limit: As the medical dataset grows, every additional format multiplies storage, review noise, and regeneration time.
- Scaling path: Keep one shipped format, regenerate non-shipping source files outside the runtime tree, and document which format is canonical for authoring versus delivery.

## Dependencies at Risk

**Not detected:**
- Risk: No direct package deprecation or unsupported runtime dependency is surfaced from `package.json`.
- Impact: Not applicable from repository metadata alone.
- Migration plan: Reassess when dependency automation or CI is added.

## Missing Critical Features

**Automated enforcement exists only as local scripts:**
- Problem: The repo has useful checks in `npm test`, `npm run build`, `npm run check:budget`, and `node scripts/validate-bp-coverage.js`, but there is no CI configuration under `.github/` to run them on every change.
- Blocks: Reliable regression prevention for data integrity, bundle size, and test failures before merge.

## Test Coverage Gaps

**Organs 2 anchoring completeness is untested:**
- What's not tested: Full coverage of `BODY_PART_MODAL_COORDS` against the 86 body-part IDs in `BODY_PARTS`.
- Files: `src/data/body-part-modal-anchor.ts`, `src/data/body-parts.ts`
- Risk: New or already-missing body parts silently fall back to the abdomen-centered default anchor, producing incorrect modal placement without a failing test.
- Priority: High

**Full body-part asset usage is untested:**
- What's not tested: The entire body-part catalog in `BODY_PARTS`; `src/__tests__/body-part-photos.test.ts` only guarantees asset existence for `LEGACY_REFERENCE_ORGAN_IDS`.
- Files: `src/data/body-parts.ts`, `src/__tests__/body-part-photos.test.ts`, `public/assets/body-parts/*`
- Risk: A body part outside the legacy subset can reference a missing or stale image file without detection until manual QA.
- Priority: Medium

**Non-2xx fetch semantics and leaked network access are untested:**
- What's not tested: Behavior when `fetch()` resolves with `ok === false`, and a hard failure when tests attempt unexpected localhost or asset requests.
- Files: `src/data/data-service.ts`, `src/__tests__/data-service.test.ts`, `src/body-map-explorer.test.ts`
- Risk: Broken CDN/server responses surface as opaque runtime errors, and noisy green tests mask the difference between expected mocks and accidental live requests.
- Priority: Medium

---

*Concerns audit: 2026-04-07*
