# Testing Patterns

**Analysis Date:** 2026-04-07

## Test Framework

**Runner:**
- Vitest `4.1.2`
- Config: `vitest.config.ts`
- Environment: `happy-dom`
- Included files: `src/**/*.test.ts`

**Assertion Library:**
- Vitest `expect` with Jest-style matchers

**Run Commands:**
```bash
npm test                         # Run all configured tests
npx vitest                       # Watch mode via CLI; no package script
npx vitest run --coverage        # Coverage attempt; currently fails without @vitest/coverage-v8
```

## Test File Organization

**Location:**
- Tests are mostly centralized in `src/__tests__/`.
- One older explorer API suite is still co-located at `src/body-map-explorer.test.ts`.

**Naming:**
- Use `*.test.ts` for every suite.
- Use suite labels with scenario prefixes to group intent, such as `MODEL-01`, `EXPLORER-02`, `PANEL-05`, and `MODAL-07` in `src/__tests__/body-map-model.test.ts`, `src/__tests__/body-map-explorer.test.ts`, `src/__tests__/body-map-data-panel.test.ts`, and `src/__tests__/body-map-modal.test.ts`.

**Structure:**
```text
src/
├── __tests__/
│   ├── body-map-explorer.test.ts
│   ├── body-map-model.test.ts
│   ├── body-map-modal.test.ts
│   ├── body-map-data-panel.test.ts
│   ├── body-systems-panels.test.ts
│   ├── data-service.test.ts
│   ├── body-part-photos.test.ts
│   └── systems-data.test.ts
└── body-map-explorer.test.ts
```

## Test Structure

**Suite Organization:**
```typescript
async function createFixture(): Promise<BodyMapModel> {
  const el = document.createElement("body-map-model") as BodyMapModel;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("body-map-model", () => {
  let el: BodyMapModel;

  beforeEach(async () => {
    el = await createFixture();
  });

  afterEach(() => {
    el.remove();
    document.body.innerHTML = "";
  });
});
```

**Patterns:**
- Mount real custom elements into `document.body`, then wait for Lit to flush with `await el.updateComplete`. This is the default setup in `src/__tests__/body-map-model.test.ts`, `src/__tests__/body-map-modal.test.ts`, `src/__tests__/body-systems-panels.test.ts`, and `src/body-map-explorer.test.ts`.
- Query through `shadowRoot` and assert rendered DOM, attributes, and text rather than snapshotting markup. This is consistent across `src/__tests__/body-map-explorer.test.ts`, `src/__tests__/body-map-data-panel.test.ts`, and `src/__tests__/body-systems-panels.test.ts`.
- Dispatch real DOM events with `{ bubbles: true, composed: true }` for component interaction tests. Examples are widespread in `src/__tests__/body-map-model.test.ts` and `src/__tests__/body-map-explorer.test.ts`.
- Reset document state aggressively in teardown with `el.remove()` and `document.body.innerHTML = ""`. Tests that override globals also restore them explicitly, as in `src/__tests__/body-map-modal.test.ts`.

## Mocking

**Framework:** Vitest `vi`

**Patterns:**
```typescript
vi.mock("../data/data-service.js", () => ({
  fetchDiseases: vi.fn().mockResolvedValue([{ name: "Test Disease" }]),
  fetchSymptomsForPart: vi.fn().mockResolvedValue(["Test Symptom"]),
  clearCache: vi.fn(),
  ORGAN_TO_DATA_KEY: {},
}));

vi.stubGlobal("fetch", makeFetchMock(SAMPLE_SYMPTOMS_BY_PART));
```

**What to Mock:**
- Mock network boundaries and provider modules in integration-style component tests. `src/__tests__/body-map-explorer.test.ts` mocks `../data/data-service.js`, and `src/__tests__/data-service.test.ts` stubs global `fetch`.
- Mock reference datasets only when a component test needs tight isolation from the full production data tables. `src/__tests__/body-map-data-panel.test.ts` replaces `../data/organs.js` with a tiny fixture list.
- Override browser globals when layout calculations depend on viewport size, as in `src/__tests__/body-map-modal.test.ts` for `window.innerWidth` and `window.innerHeight`.

**What NOT to Mock:**
- Do not mock Lit rendering or custom-element registration. Tests mount real elements from `src/body-map-model.ts`, `src/body-map-sidebar.ts`, `src/body-map-detail-panel.ts`, and `src/body-map-modal.ts`.
- Keep real typed data modules for integrity checks when the goal is coverage or lookup validation. `src/__tests__/systems-data.test.ts` and `src/__tests__/body-part-photos.test.ts` intentionally use the live exports from `src/data/`.
- Avoid snapshots. The existing suite asserts DOM semantics, event payloads, and derived data explicitly.

## Fixtures and Factories

**Test Data:**
```typescript
function makeFetchMock(jsonData: unknown, ok = true): ReturnType<typeof vi.fn> {
  return vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 404,
    json: () => Promise.resolve(jsonData),
  } as unknown as Response);
}
```

**Location:**
- Fixtures are defined inline at the top of each suite file rather than in a shared helper package.
- Common patterns are `createFixture()` in `src/__tests__/body-map-model.test.ts`, `createPanel()` in `src/__tests__/body-map-data-panel.test.ts`, `createSidebar()` / `createDetailPanel()` in `src/__tests__/body-systems-panels.test.ts`, and `makeFetchMock()` in `src/__tests__/data-service.test.ts`.

## Coverage

**Requirements:** None enforced
- No coverage thresholds or reporter settings are configured in `vitest.config.ts`.
- Coverage support is incomplete. `npx vitest run --coverage` currently fails because `@vitest/coverage-v8` is not installed.
- The effective test emphasis is concentrated in the two largest integration suites: `src/__tests__/body-map-model.test.ts` and `src/__tests__/body-map-explorer.test.ts`. The full configured suite currently spans 9 files and 162 tests.

**View Coverage:**
```bash
npx vitest run --coverage
```

## Test Types

**Unit Tests:**
- Pure data and helper coverage lives in `src/__tests__/data-service.test.ts`, `src/__tests__/systems-data.test.ts`, and `src/__tests__/body-part-photos.test.ts`.
- These tests validate mapping rules, asset URL construction, caching behavior, and dataset consistency without mounting the whole app.

**Integration Tests:**
- Integration-style DOM tests dominate the suite. `src/__tests__/body-map-explorer.test.ts`, `src/__tests__/body-map-model.test.ts`, `src/__tests__/body-map-modal.test.ts`, and `src/__tests__/body-systems-panels.test.ts` mount real Lit elements and verify cross-component event contracts.
- The co-located suite in `src/body-map-explorer.test.ts` acts as an additional API-contract layer for the explorer custom element.

**E2E Tests:**
- Not used
- No Playwright or Cypress config was detected in the repository root.

## Verification Workflow

**Local Workflow:**
- Run `npm test` first. This is the only scripted automated test command in `package.json`.
- Run `npm run build` to verify the distributable library build from `vite.config.ts`.
- Run `npm run check:budget` after a build to enforce the payload budget defined in `scripts/check-build-budget.js`.
- Run `node scripts/validate-bp-coverage.js` when changing `bp_*` mappings or source data in `src/data/` and `public/data/`.

**Current State:**
- `npm test` passes with 162 tests in 9 files on 2026-04-07.
- In the current sandbox, `npm test` emits repeated `EPERM` connection attempts to `localhost:3000` before reporting success. The suite still passes, so treat those messages as environment noise unless a test starts failing.
- `npm run build`, `npm run check:budget`, and `node scripts/validate-bp-coverage.js` all pass in the current repository state.
- No CI configuration was detected in the repo root, so the workflow is currently local and script-driven.

## Common Patterns

**Async Testing:**
```typescript
el.currentView = "organs";
await el.updateComplete;

hitArea?.dispatchEvent(
  new MouseEvent("click", { bubbles: true, composed: true }),
);
await el.updateComplete;

expect(
  hitArea?.closest(".body-part-group")?.classList.contains("selected"),
).toBe(true);
```

**Error Testing:**
```typescript
vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

await expect(fetchDiseases("brain")).rejects.toThrow(
  /data\/diseases\/bp_brain\.json/,
);
```

---

*Testing analysis: 2026-04-07*
