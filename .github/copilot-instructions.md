# DevExtreme Monorepo

DevExtreme is an enterprise-ready suite of UI components for Angular, React, Vue, and jQuery, distributed as a pnpm/Nx monorepo containing the core library, framework wrappers, themes, themebuilder, and test suites. Stack: TypeScript, JavaScript, SCSS, pnpm + Nx, Node, Gulp + custom Nx executors (`devextreme-nx-infra-plugin`). The .NET SDK is required for `devextreme-internal-tools` code generation.

## Commands

```bash
# Install (frozen lockfile is mandatory; CI fails otherwise)
pnpm install --frozen-lockfile

# Build
pnpm run all:build-dev                    # all packages, dev mode (DEVEXTREME_TEST_CI=true)
pnpm run all:build                        # full production build
pnpm nx build:dev devextreme              # single package, dev mode
pnpm nx build devextreme -c=testing       # CI testing configuration
pnpm nx build:transpile devextreme        # transpile only (babel-transform / build-typescript)
pnpm nx bundle:debug devextreme           # debug bundle (Webpack via nx-infra-plugin)
pnpm nx bundle:prod devextreme            # production bundle
pnpm nx build:localization devextreme     # localization files only
pnpm nx build:npm devextreme              # npm package preparation

# Test
pnpm nx run-many -t test                  # all packages
pnpm run test-jest                        # jest jsdom (from packages/devextreme)
pnpm run test-jest:all                    # jest jsdom + node
pnpm nx test devextreme-testcafe-tests    # TestCafe e2e
pnpm nx test devextreme-angular           # wrapper tests (also -react, -vue)

# Lint
pnpm nx run-many -t lint                  # all packages
pnpm run lint                             # devextreme package: js, ts, dts, texts
pnpm run lint-js -- --fix                 # auto-fix JS

# Regenerate (after changes to generators, TS declarations, or devextreme-internal-tools)
pnpm run regenerate-all
pnpm run update-ts-reexports              # from packages/devextreme
pnpm run update-ts-bundle                 # from packages/devextreme

# Clean
pnpm run clean                            # from packages/devextreme
pnpm nx clean:artifacts devextreme        # build artifacts only
```

## Structure

```
packages/
  devextreme/                       # core library: ui/, viz/, core/, data/, renovation/
  devextreme-{angular,react,vue}/   # framework wrappers (generated)
  devextreme-scss/                  # SCSS themes
  devextreme-themebuilder/          # theme builder
  devextreme-metadata/              # metadata for wrapper generation
  devextreme-monorepo-tools/        # internal tooling
  nx-infra-plugin/                  # custom Nx executors
  workflows/                        # cross-package Nx orchestration (all:build-dev, all:build-testing)
  testcafe-models/                  # TestCafe page object models
apps/                               # demos and per-framework playgrounds (+ react-storybook)
e2e/testcafe-devextreme/            # TestCafe e2e suite
e2e/{wrappers,bundlers,compilation-cases}/   # integration / bundler / TS compilation tests
tools/scripts/                      # build and utility scripts
```

For the full executor catalogue, conventions, and refactoring guidance, see @packages/nx-infra-plugin/AGENTS.md. File-specific coding rules live under @.github/instructions/.

## Build Pipeline

clean (`devextreme-nx-infra-plugin:clean` preserving CSS and npm metadata) → localization → component generation (Renovation) → transpile (`babel-transform` for JS, `build-typescript` for TS) → bundle (Webpack via `devextreme-nx-infra-plugin:bundle`, debug + prod targets) → TypeScript declarations → SCSS compile (`devextreme-scss`) → npm package preparation. Task orchestration goes through Nx; cross-package builds (`all:build-dev`, `all:build`) live in the `workflows` package. The `gulpfile.js` clean task is a thin delegate to `pnpm nx clean:artifacts devextreme`. Pre-commit hook runs `lint-staged` (stylelint + eslint --quiet).

## Conventions

**IMPORTANT:** All code contributions must follow the rules defined in @.github/instructions/. Before making any changes, check that directory for file-specific or pattern-specific coding conventions that apply to the files you're modifying.

- Use `pnpm nx <target> <project>` rather than raw npm scripts so Nx caching and the dependency graph stay correct.
- Build before testing: `pnpm nx build:dev devextreme`; QUnit and TestCafe both require an up-to-date build.
- Run `pnpm run regenerate-all` after editing wrapper generators, TypeScript declarations, or `devextreme-internal-tools`.
- Edit source files only under `packages/devextreme/js/**`, `packages/devextreme-scss/scss/**`, and `packages/devextreme-metadata/**`.
- Match the Node and pnpm versions declared in `package.json` (`engines`, `packageManager`); mismatched versions cause CI failure.
- Set `DEVEXTREME_TEST_CI=true` for test-mode builds and `BUILD_TEST_INTERNAL_PACKAGE=true` for wrapper test prep.

## Constraints

- NEVER edit generated wrappers under `packages/devextreme-{angular,react,vue}/src/` (templates excepted); update the generators and run `pnpm run regenerate-all` instead.
- NEVER hand-edit `packages/devextreme/js/renovation/**/*.j.tsx` or `packages/devextreme/js/__internal/core/localization/{default_messages.ts,cldr-data/**}`; regenerate via the localization / component executors.
- NEVER run `pnpm install` without `--frozen-lockfile`; use `pnpm install --frozen-lockfile` to match CI.

## Compact Instructions

- Always install with `pnpm install --frozen-lockfile`; never plain `pnpm install`.
- Build before test: `pnpm nx build:dev devextreme`.
- Generated wrappers under `packages/devextreme-{angular,react,vue}/src/` are read-only — modify generators and run `pnpm run regenerate-all`.
- Prefer `pnpm nx <target>` over direct npm scripts for caching.
- Consult @.github/instructions/ for file-specific coding rules before editing.

## Trust These Instructions

These instructions are based on actual repository analysis including:
- Package.json scripts and configurations
- GitHub Actions workflows
- Build system files (gulpfile.js, nx.json)
- Project structure and file organization
- CI/CD pipeline requirements

**When in doubt, refer to these instructions first before exploring.** They represent the validated, working approach to building and testing this repository.
