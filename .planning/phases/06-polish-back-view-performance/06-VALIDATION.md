---
phase: 6
slug: polish-back-view-performance
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-07
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | `vite.config.ts` |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 6-01-01 | 01 | 1 | UX-03, UX-04 | T-06-01 | Keyboard focus stays on intended organ/system targets only | unit | `npm test` | ✅ | ✅ green |
| 6-01-02 | 01 | 1 | UX-05 | T-06-02 | Live region announces only user-visible selections | unit | `npm test` | ✅ | ✅ green |
| 6-02-01 | 02 | 1 | UX-01, UX-02 | — | Responsive layout changes remain within component container | unit | `npm test` | ✅ | ✅ green |
| 6-03-01 | 03 | 2 | BACK-01, BACK-02, BACK-03 | T-06-03 | Hidden face cannot receive focus/clicks during flip | unit + browser | `npm test` | ✅ | ✅ green |
| 6-04-01 | 04 | 2 | PERF-01, PERF-02, PERF-03 | — | Deferred assets are absent from initial render path | build + unit | `npm run build` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `src/__tests__/body-map-model.test.ts` — keyboard and back-view assertions cover UX-03/BACK-01/BACK-03
- [x] `src/__tests__/body-map-explorer.test.ts` — live-region, responsive, and performance orchestration assertions cover UX-02/UX-05/PERF-02
- [x] Existing suites remained broad enough; no extra focused a11y file was required
- [x] `scripts/check-build-budget.js` captures bundle + critical first-paint asset budget for PERF-01/PERF-03

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Container-query layout behaves correctly at arbitrary embed widths | UX-02 | Requires real browser resizing at host/container level | Run `npm run dev`, resize the component container through wide/tablet/narrow widths, verify layout reflows without viewport media queries. |
| Screen reader announces selected body part and system correctly | UX-05 | Requires assistive-tech verification | Use VoiceOver/NVDA, select organs and systems, verify announcement text is accurate and not repeated excessively. |
| 3D front/back flip feels correct and only active face is interactive | BACK-03 | Visual and interaction integrity need browser validation | In sections view, toggle front/back repeatedly for male and female, verify the visible face flips cleanly and the hidden face cannot be clicked/tabbed. |
| Initial network requests stay within the critical asset budget | PERF-01 / PERF-03 | Requires network panel confirmation | Open the component fresh in the browser, inspect initial requests, verify deferred assets are not fetched until their mode/view is activated. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** complete
