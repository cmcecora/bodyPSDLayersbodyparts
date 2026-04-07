---
phase: 4
slug: data-layer-disease-symptom-panels-modal
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-06
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value               |
| ---------------------- | ------------------- |
| **Framework**          | Vitest              |
| **Config file**        | `vite.config.ts`    |
| **Quick run command**  | `npm test -- --run` |
| **Full suite command** | `npm test -- --run` |
| **Estimated runtime**  | ~10 seconds         |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- --run`
- **After every plan wave:** Run `npm test -- --run`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement        | Threat Ref | Secure Behavior | Test Type | Automated Command   | File Exists | Status     |
| ------- | ---- | ---- | ------------------ | ---------- | --------------- | --------- | ------------------- | ----------- | ---------- |
| 4-01-01 | 01   | 0    | DATA-01            | —          | N/A             | unit      | `npm test -- --run` | ❌ W0       | ⬜ pending |
| 4-01-02 | 01   | 1    | DATA-01, DATA-02   | —          | N/A             | unit      | `npm test -- --run` | ❌ W0       | ⬜ pending |
| 4-01-03 | 01   | 1    | DATA-03            | —          | N/A             | unit      | `npm test -- --run` | ❌ W0       | ⬜ pending |
| 4-02-01 | 02   | 1    | DATA-04, DATA-05   | —          | N/A             | unit      | `npm test -- --run` | ❌ W0       | ⬜ pending |
| 4-02-02 | 02   | 2    | MODAL-01, MODAL-02 | —          | N/A             | unit      | `npm test -- --run` | ❌ W0       | ⬜ pending |
| 4-02-03 | 02   | 2    | MODAL-03, MODAL-04 | —          | N/A             | unit      | `npm test -- --run` | ❌ W0       | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [ ] `src/data-service.test.ts` — stubs for DATA-01 through DATA-05 (lazy load, caching, splitting)
- [ ] `src/body-map-data-panel.test.ts` — stubs for disease/symptom list + debounced search
- [ ] `src/body-map-modal.test.ts` — stubs for MODAL-01 through MODAL-04 (open/close/dismiss/skeleton)
- [ ] `scripts/split-body-part-data.test.ts` — stubs for data splitting script output validation

---

## Manual-Only Verifications

| Behavior                                                   | Requirement | Why Manual                                               | Test Instructions                                                           |
| ---------------------------------------------------------- | ----------- | -------------------------------------------------------- | --------------------------------------------------------------------------- |
| Modal positions correctly relative to clicked body section | MODAL-02    | Requires visual browser check of computed pixel position | Open app, click a body section, verify modal caret points to clicked region |
| Skeleton shimmer animation renders during load             | MODAL-01    | Animation timing requires visual observation             | Throttle network to Slow 3G, click section, verify shimmer appears          |
| Escape key dismisses modal                                 | MODAL-03    | Keyboard event in real DOM                               | Open modal, press Escape, verify modal closes                               |
| Click outside dismisses modal                              | MODAL-03    | Requires click outside shadow DOM                        | Open modal, click backdrop area, verify modal closes                        |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
