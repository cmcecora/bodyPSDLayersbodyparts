# Technology Stack

**Project:** Body Map Explorer Web Component
**Researched:** 2026-03-29

## Recommended Stack

### Core Framework

| Technology | Version | Purpose                  | Why                                                                                                    |
| ---------- | ------- | ------------------------ | ------------------------------------------------------------------------------------------------------ |
| Lit        | ^3.0.0  | Web Component base class | ~5KB gzipped, reactive properties, efficient Shadow DOM templates, Google-backed, largest WC ecosystem |
| TypeScript | ^5.4    | Type safety              | Catch data shape errors at build time, Lit has first-class TS support via decorators                   |

### Build Tooling

| Technology        | Version   | Purpose                       | Why                                                                                 |
| ----------------- | --------- | ----------------------------- | ----------------------------------------------------------------------------------- |
| Vite              | ^6.0      | Dev server + production build | HMR for fast iteration, `build.lib` mode outputs ESM + UMD, built-in asset handling |
| Rollup (via Vite) | (bundled) | Production bundler            | Tree-shaking, code splitting, library output formats                                |

### Testing

| Technology       | Version | Purpose                      | Why                                                              |
| ---------------- | ------- | ---------------------------- | ---------------------------------------------------------------- |
| Vitest           | ^3.0    | Unit tests                   | Vite-native, fast, compatible with Lit component testing         |
| @open-wc/testing | ^4.0    | Web Component test utilities | Fixture rendering, Shadow DOM assertions, built for WC ecosystem |
| Playwright       | ^1.50   | E2E / visual regression      | Cross-browser SVG rendering verification, screenshot comparison  |

### Supporting Libraries

| Library                            | Version | Purpose                       | When to Use                                                     |
| ---------------------------------- | ------- | ----------------------------- | --------------------------------------------------------------- |
| @lit/context                       | ^1.0    | Cross-component state sharing | If prop drilling exceeds 3 levels between sub-components        |
| @custom-elements-manifest/analyzer | ^0.10   | API documentation generation  | Build step: auto-generates custom-elements.json for IDE support |
| sharp                              | ^0.33   | Image optimization (build)    | Build step: PNG to WebP conversion, resizing                    |

### Infrastructure

| Technology     | Purpose          | Why                                                        |
| -------------- | ---------------- | ---------------------------------------------------------- |
| npm            | Package registry | Standard, works with all consumers (Angular, Next.js, CDN) |
| GitHub Actions | CI/CD            | Build, test, publish to npm on release                     |

## Alternatives Considered

| Category     | Recommended         | Alternative         | Why Not                                                                  |
| ------------ | ------------------- | ------------------- | ------------------------------------------------------------------------ |
| WC framework | Lit                 | Stencil             | Larger runtime (~14KB), compiler complexity, JSX unfamiliar              |
| WC framework | Lit                 | Vanilla             | Too much boilerplate for 10+ state vars, 30+ functions, 5 sub-components |
| WC framework | Lit                 | FAST (Microsoft)    | Smaller community, less documentation, more opinionated                  |
| Build tool   | Vite                | Rollup (standalone) | No dev server, more config for same output                               |
| Build tool   | Vite                | esbuild             | No library mode, limited code splitting                                  |
| Build tool   | Vite                | Webpack             | Overkill config complexity, slower builds                                |
| Testing      | Vitest + Playwright | Jest + Cypress      | Vitest is Vite-native (zero config), Playwright better for SVG testing   |
| Language     | TypeScript          | JavaScript          | Data shapes (body parts, systems, diseases) benefit from type checking   |

## Installation

```bash
# Core
npm install lit

# Dev dependencies
npm install -D typescript vite vitest @open-wc/testing playwright @custom-elements-manifest/analyzer sharp
```

## Sources

- MDN Web Components: https://developer.mozilla.org/en-US/docs/Web/API/Web_components (verified)
- Lit documentation: https://lit.dev (training data)
- Vite documentation: https://vitejs.dev (training data)
- @open-wc/testing: https://open-wc.org/docs/testing/testing-package/ (training data)
