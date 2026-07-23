# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

DevExtreme is an enterprise UI component suite for Angular, React, Vue, and jQuery. This is a large-scale monorepo (pnpm workspaces + Nx 22) containing the core library, framework wrappers, demos, themes, and test suites.

**Required tooling:** Node.js 24.16.0, pnpm 11.9.0.

## Setup

```bash
pnpm install --frozen-lockfile
```

Always use `--frozen-lockfile`. CI enforces it.

## Build

The `dev` script is run manually in WebStorm (not by agents). It runs an Nx watch build with hot reload and starts the QUnit test server on port 20060:

```bash
# From packages/devextreme — run manually, not via agent
pnpm run dev
```

This is a long-running process. **Agents should not run it.** If a build is needed to verify a change, ask the developer to confirm when the dev build succeeds.

For a one-shot dev build (e.g., before running Jest tests in CI-like fashion):
```bash
pnpm nx build:dev devextreme
```

If builds behave unexpectedly, clear the Nx cache: `rm -rf .nx/cache`

## Tests

### Jest unit tests (from `packages/devextreme`)

```bash
pnpm run test-jest                                          # All JSDOM tests

# Single file/pattern — invoke Jest directly.
# Note: this repo currently uses Jest 29.x, where the flag is --testPathPattern (singular).
pnpm exec jest --no-coverage --runInBand --selectProjects jsdom-tests --testPathPattern "<pattern>"

# Watch mode for a single file/pattern:
pnpm exec jest --watch --no-coverage --selectProjects jsdom-tests --testPathPattern "<pattern>"
```

Example: `pnpm exec jest --no-coverage --runInBand --selectProjects jsdom-tests --testPathPattern "js/__internal/grids/data_grid/ai_assistant/commands/__tests__/summary.test.ts"`

Jest tests for grid components live under `js/__internal/grids/` — typically in `__tests__/` subdirectories alongside the source (in `grid_core/`, `data_grid/`, and `tree_list/`).

### QUnit tests (browser-based)

QUnit tests are browser-based. New QUnit tests are still written for most components. The exception is grid-based components (DataGrid, TreeList, etc.) and the Scheduler: 
do not write new QUnit tests for those — cover new code with Jest instead, and use the existing QUnit tests only to verify behavior after refactoring. 

To run QUnit tests:

1. Ensure `pnpm run dev` is running (started manually in WebStorm)
2. Open `http://localhost:20060/` in browser
3. Navigate to the relevant module (e.g., `DevExpress.ui.widgets.dataGrid`)
4. Run the tests — errors appear on the page

**Agents should not run QUnit tests.** Ask the developer to run the relevant module and report results.

## Lint Commands

**From `packages/devextreme`:**
```bash
pnpm run lint           # All linting
pnpm run lint-js        # JS only
pnpm run lint-ts        # TS only
pnpm run lint-dts       # .d.ts files

pnpm run lint-js -- --fix   # Auto-fix
pnpm run lint-ts -- --fix
```

Pre-commit hooks (Husky + lint-staged) run automatically on `git commit`.

## Architecture

### Package Layout

```
packages/
  devextreme/           # Core library — JS/TS source, QUnit tests, build scripts
    js/ui/              # Public entry points: .d.ts API definitions + reexports from __internal
    js/viz/             # Public entry points for visualizations
    js/core/            # Public entry points for core utilities
    js/data/            # Public entry points for data layer
    js/__internal/      # All implementation code lives here
      grids/            # Grid components (DataGrid, TreeList, etc.)
  devextreme-angular/   # Angular wrapper (GENERATED — do not edit src/)
  devextreme-react/     # React wrapper (GENERATED — do not edit src/)
  devextreme-vue/       # Vue wrapper (GENERATED — do not edit src/)
  devextreme-scss/      # SCSS themes
  devextreme-metadata/  # Metadata that drives wrapper generation
  testcafe-models/      # TestCafe page object models

apps/
  demos/                # Technical demos (Angular, React, Vue, jQuery)

e2e/
  testcafe-devextreme/  # E2E tests
```

The folders under `js/` (except `__internal/`) contain only the public API surface — `.d.ts` type definitions and reexports. All actual implementation is in `js/__internal/`.

### Framework Wrappers

Framework wrappers (`devextreme-angular/src/`, `devextreme-react/src/`, `devextreme-vue/src/`) are **entirely generated** — do not edit `src/` directly.

When updating public API in `js/ui/*.d.ts`, regenerate afterward:
```bash
pnpm run regenerate-all          # from repo root — requires .NET SDK 8.0.x
cd packages/devextreme
pnpm run update-ts-reexports
pnpm run update-ts-bundle
pnpm run lint-dts
```

Do not edit directly:
- `packages/devextreme-angular/src/**/*` (except templates)
- `packages/devextreme-react/src/**/*` (except templates)
- `packages/devextreme-vue/src/**/*` (except templates)
- `packages/devextreme/js/__internal/core/localization/default_messages.ts`
- `packages/devextreme/js/__internal/core/localization/cldr-data/**/*`

## Code Style Conventions

These rules apply to `packages/devextreme/js/**/*.d.ts` (see `.github/instructions/API_conventions.instructions.md`):

- **Acronym casing:** Treat acronyms as regular words — `parseHtml`, `testDom`, `createJsonParser`. Exception: `AI` is always fully capitalized (`AIIntegration`, `aiOptions`).
- **JSDoc @type:** Omit `@type` when the TypeScript annotation already declares the type.

Use comments sparingly. Only comment complex code.

## Localization Files

Files under `**/localization/messages/**/*.json` are managed by a dedicated team. **Never suggest translations, alternative phrasings, or language changes.** Only flag critical JSON syntax errors.

## CI Checks on PRs

| Workflow               | What it runs                                                          |
|------------------------|-----------------------------------------------------------------------|
| `default_workflow.yml` | `nx run-many -t lint,test` on most packages                           |
| `lint.yml`             | TS, JS, .d.ts, text linting; checks generated reexports are up-to-date |
| `build_all.yml`        | Full production build (requires .NET 8.0.x) — CI only                |
| `wrapper_tests.yml`    | Angular/React/Vue wrapper tests + regeneration check                  |
| `qunit_tests.yml`      | Legacy QUnit tests                                                    |
| `testcafe_tests.yml`   | E2E accessibility and component tests                                 |

**Common CI failure fixes:**
- *"Generated code is outdated"* → run `pnpm run regenerate-all` from repo root
- *"Reexports outdated"* → run `pnpm run update-ts-reexports` from `packages/devextreme`
- *Lint errors* → run `pnpm run lint-js -- --fix` or `pnpm run lint-ts -- --fix`
