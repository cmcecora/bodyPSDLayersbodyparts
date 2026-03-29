---
phase: 2
slug: core-svg-body-model
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-29
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                               |
| ---------------------- | ----------------------------------- |
| **Framework**          | vitest                              |
| **Config file**        | none — Wave 0 installs              |
| **Quick run command**  | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime**  | ~5 seconds                          |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement        | Test Type | Automated Command      | File Exists | Status     |
| -------- | ---- | ---- | ------------------ | --------- | ---------------------- | ----------- | ---------- |
| 02-01-01 | 01   | 0    | —                  | setup     | `npx vitest --version` | ❌ W0       | ⬜ pending |
| 02-01-02 | 01   | 1    | MODEL-01           | unit      | `npx vitest run`       | ❌ W0       | ⬜ pending |
| 02-01-03 | 01   | 1    | MODEL-02           | unit      | `npx vitest run`       | ❌ W0       | ⬜ pending |
| 02-01-04 | 01   | 1    | MODEL-03           | unit      | `npx vitest run`       | ❌ W0       | ⬜ pending |
| 02-01-05 | 01   | 2    | MODEL-04           | unit      | `npx vitest run`       | ❌ W0       | ⬜ pending |
| 02-01-06 | 01   | 2    | MODEL-05           | unit      | `npx vitest run`       | ❌ W0       | ⬜ pending |
| 02-01-07 | 01   | 2    | MODEL-06, MODEL-07 | unit      | `npx vitest run`       | ❌ W0       | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [ ] Install vitest + @vitest/browser (or jsdom) as dev dependency
- [ ] Create `vitest.config.ts` with Lit-compatible setup
- [ ] `src/__tests__/body-map-model.test.ts` — stubs for MODEL-01 through MODEL-07
- [ ] Extract silhouette image from source HTML to `public/assets/silhouette.webp`

_If none: "Existing infrastructure covers all phase requirements."_

---

## Manual-Only Verifications

| Behavior                                            | Requirement | Why Manual                                      | Test Instructions                                                   |
| --------------------------------------------------- | ----------- | ----------------------------------------------- | ------------------------------------------------------------------- |
| Visual hover highlight (blue overlay + drop-shadow) | MODEL-02    | CSS visual effect requires browser rendering    | Hover each organ, verify blue highlight appears and disappears      |
| Touch interaction on mobile                         | MODEL-02    | Requires physical touch device or emulator      | Test touchstart/touchend on organ groups in mobile viewport         |
| Gender toggle visual swap                           | MODEL-05    | Visual verification of correct organ visibility | Toggle male/female, verify only correct reproductive organs visible |

_If none: "All phase behaviors have automated verification."_

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
