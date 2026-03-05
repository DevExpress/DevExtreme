# DevExtreme Monorepo - Copilot Instructions

## Repository Overview

**DevExtreme** is an enterprise-ready suite of powerful UI components for Angular, React, Vue, and jQuery. This is a large-scale monorepo containing the core library, framework wrappers, demos, and extensive test suites.

**Repository Stats:**
- **Type:** Monorepo (pnpm workspaces + Nx)
- **Size:** Large (1000+ files across multiple packages)
- **Languages:** TypeScript, JavaScript, SCSS, C# (.NET for test runner)
- **Package Manager:** pnpm 9.15.4 (specified in package.json)
- **Node Version:** 20.x (required by CI)
- **Build System:** Gulp + Nx + custom build scripts + custom Nx executors (via `devextreme-nx-infra-plugin`)
- **Test Frameworks:** QUnit, Jest, TestCafe, Karma (Angular)

## Critical Setup Requirements

### Environment Prerequisites

**ALWAYS install dependencies with frozen lockfile:**
```bash
pnpm install --frozen-lockfile
```

**Node.js:** Version 20.x is required (CI uses Node 20)
**pnpm:** Version 9.15.4 (managed via packageManager field)
**.NET SDK:** Version 8.0.x required for building the test runner (packages/devextreme/testing/runner)

### First-Time Setup

1. **Install dependencies from repository root:**
   ```bash
   pnpm install --frozen-lockfile
   ```

2. **For development builds of devextreme package:**
   ```bash
   pnpx nx build:dev devextreme
   ```
   OR from monorepo root:
   ```bash
   pnpm run all:build-dev
   ```

3. **For production builds:**
   ```bash
   pnpm run all:build
   ```

## Repository Structure

### Key Directories

```
/packages/
  devextreme/              # Core library (main package)
    js/                    # JavaScript/TypeScript source code
      ui/                  # UI widgets
      viz/                 # Visualization components
      core/                # Core utilities
      data/                # Data layer
      renovation/          # Renovation components (new architecture)
    testing/               # QUnit tests
    build/                 # Build scripts and Gulp tasks
    artifacts/             # Build output (generated)
  devextreme-angular/      # Angular wrapper
  devextreme-react/        # React wrapper
  devextreme-vue/          # Vue wrapper
  devextreme-scss/         # SCSS themes and styles
  devextreme-themebuilder/ # Theme builder package
  devextreme-metadata/     # Metadata generation for wrappers
  devextreme-monorepo-tools/ # Internal tooling
  nx-infra-plugin/         # Custom Nx executors for build automation
  workflows/               # Cross-package NX build orchestration (all:build-dev, all:build-testing)
  testcafe-models/         # TestCafe page object models

/apps/
  demos/                   # Technical demos (Angular, React, Vue, jQuery)
  angular/                 # Angular playground
  react/                   # React playground
  vue/                     # Vue playground
  react-storybook/         # Storybook for React components

/e2e/
  testcafe-devextreme/     # TestCafe end-to-end tests
  wrappers/                # Wrapper integration tests
  bundlers/                # Bundler compatibility tests
  compilation-cases/       # TypeScript compilation tests

/tools/scripts/            # Build and utility scripts
```

### Configuration Files

- **Root:** `nx.json`, `pnpm-workspace.yaml`, `tsconfig.json`, `package.json`
- **Linting:** `.lintstagedrc`, `eslint.config.mjs` (per package)
- **Styles:** `.stylelintrc.json` (in devextreme-scss)
- **Git Hooks:** `.husky/pre-commit` (runs lint-staged)

## Build System

### Build Commands (from root)

**Development build (faster, for testing):**
```bash
pnpm run all:build-dev
```
- Sets `DEVEXTREME_TEST_CI=TRUE`
- Skips some production optimizations
- Builds all packages

**Production build (full):**
```bash
pnpm run all:build
```
- Includes documentation injection
- Creates minified bundles
- Generates all npm packages
- Takes significantly longer (~15-30 minutes)

**Build specific package:**
```bash
pnpx nx build devextreme
pnpx nx build devextreme-angular
pnpx nx build devextreme-react
pnpx nx build devextreme-vue
pnpx nx build devextreme-scss
pnpx nx build devextreme-themebuilder
```

**Build with Nx cache skip:**
```bash
pnpx nx build devextreme --skipNxCache
```

### DevExtreme Package Build Details

**From packages/devextreme directory:**

```bash
# Development build
pnpm run build:dev

# Production build
pnpm run build

# Build for TestCafe tests
pnpm run build:testcafe

# Clean build artifacts
pnpm run clean
```

**Build process includes:**
1. Localization generation (via `devextreme-nx-infra-plugin:localization` executor)
2. Component generation (Renovation architecture)
3. Transpilation (via native NX executors: `babel-transform` for JS, `build-typescript` for TS)
4. Bundle creation (Webpack via `devextreme-nx-infra-plugin:bundle` executor) - `bundle:debug` and `bundle:prod` targets
5. TypeScript declarations - `build:declarations` target
6. SCSS compilation (from devextreme-scss)
7. NPM package preparation - `build:npm` target

**Granular Nx build targets (can be run individually):**
```bash
pnpx nx build:localization devextreme  # Generate localization files
pnpx nx build:transpile devextreme     # Transpile source code
pnpx nx bundle:debug devextreme        # Create debug bundle
pnpx nx bundle:prod devextreme         # Create production bundle
pnpx nx build:npm devextreme           # Prepare NPM packages
```

**Build with testing configuration (for CI):**
```bash
pnpx nx build devextreme -c=testing
```

**Important environment variables:**
- `DEVEXTREME_TEST_CI=true` - Enables test mode (skips building npm package)
- `BUILD_ESM_PACKAGE=true` - Builds ESM modules (skips building npm package)
- `BUILD_TESTCAFE=true` - Builds for TestCafe tests
- `BUILD_TEST_INTERNAL_PACKAGE=true` - Builds internal test package

## Custom Nx Executors (nx-infra-plugin)

The `packages/nx-infra-plugin` provides custom Nx executors for build automation:

| Executor | Description |
|----------|-------------|
| `add-license-headers` | Adds DevExtreme license headers to compiled files with version information |
| `babel-transform` | Transforms JS/TS files using Babel with configurable presets, debug block removal, and extension renaming |
| `build-angular-library` | Builds Angular libraries using ng-packagr programmatically |
| `build-typescript` | Compiles TypeScript to CJS or ESM modules with configurable output format, tsconfig, and path alias resolution |
| `bundle` | Bundles JavaScript files using webpack with debug or production mode, supporting multiple entry points and license validation |
| `clean` | Removes directories and files with support for exclusion patterns |
| `concatenate-files` | Concatenates files with optional content extraction via regex, header/footer, and find/replace transforms |
| `copy-files` | Copies files and directories to specified destinations with glob pattern support |
| `create-dual-mode-manifest` | Generates package.json files for dual-mode (ESM + CJS) support with main, module, typings, and sideEffects |
| `generate-component-names` | Generates TypeScript file with component name constants for test automation |
| `generate-components` | Generates framework components (React/Vue/Angular) from DevExtreme metadata |
| `karma-multi-env` | Runs Karma tests across multiple Angular environments (client, server, hydration) |
| `localization` | Generates CLDR data and compiles localization message files from JSON to JavaScript |
| `pack-npm` | Creates npm packages using `pnpm pack` for distribution |
| `prepare-package-json` | Creates distribution-ready package.json with cleaned dependencies for npm publishing |
| `prepare-submodules` | Creates package.json entry points for submodule exports |

**Example executor usage in project.json:**
```json
{
  "build:localization:generate": {
    "executor": "devextreme-nx-infra-plugin:localization",
    "options": {
      "messagesDir": "./js/localization/messages",
      "cldrDataOutputDir": "./js/__internal/core/localization/cldr-data"
    }
  }
}
```

## Testing

### Test Types and Commands

**1. Lint (ALWAYS run before committing):**
```bash
# From root - runs lint on all packages
pnpx nx run-many -t lint,test --exclude devextreme devextreme-themebuilder devextreme-angular devextreme-react devextreme-vue devextreme-react-storybook devextreme-angular-playground devextreme-testcafe-tests devextreme-demos devextreme-react-playground devextreme-vue-playground

# From packages/devextreme
pnpm run lint              # All linting
pnpm run lint-js           # JavaScript only
pnpm run lint-ts           # TypeScript only
pnpm run lint-dts          # .d.ts files only
pnpm run lint-texts        # Non-Latin symbols validation
```

**2. Jest Tests (Unit tests):**
```bash
# From packages/devextreme
pnpm run test-jest         # JSDOM tests only
pnpm run test-jest:node    # Node tests only
pnpm run test-jest:all     # Both JSDOM and Node tests
```

**3. QUnit Tests (Legacy unit tests):**
```bash
# Requires build first
pnpx nx build:dev devextreme

# Run from packages/devextreme
pnpm run test-env          # Launches test runner
```

**4. TestCafe Tests (E2E):**
```bash
# From e2e/testcafe-devextreme
pnpx nx run testcafe-devextreme:test
```

**5. Wrapper Tests:**
```bash
pnpx nx test devextreme-angular
pnpx nx test devextreme-react
pnpx nx test devextreme-vue
```

### Pre-commit Checks

**Husky pre-commit hook runs:**
```bash
npm run lint-staged
```

**lint-staged configuration:**
- Root: `**/*.{css,scss}` → stylelint
- devextreme: `**/*.{js,ts,tsx}` → eslint --quiet

## Validation Pipeline (CI Checks)

### What Gets Checked on PRs

**1. Default Workflow (`.github/workflows/default_workflow.yml`):**
- Runs `pnpx nx run-many -t lint,test` on most packages
- Timeout: 30 minutes
- Node: 20.x

**2. Lint Workflow (`.github/workflows/lint.yml`):**
- **TS Lint:** TypeScript files, .d.ts files, TestCafe tests
- **JS Lint:** JavaScript files
- **Texts:** Non-Latin symbol validation
- **Component Exports:** Checks generated reexports are up-to-date
- **Wrappers:** Lints Angular, React, Vue wrappers
- Timeout: 60 minutes per job

**3. Build All (`.github/workflows/build_all.yml`):**
- Runs `pnpm run all:build`
- Tests custom bundle creation
- Requires .NET 8.0.x
- Timeout: varies

**4. Wrapper Tests (`.github/workflows/wrapper_tests.yml`):**
- Builds devextreme with `BUILD_TEST_INTERNAL_PACKAGE=true`
- Tests Angular (Ubuntu), React, Vue (devextreme-shr2)
- Checks wrapper regeneration is up-to-date
- Timeout: 20 minutes

**5. QUnit Tests (`.github/workflows/qunit_tests.yml`):**
- Builds with `DEVEXTREME_TEST_CI=true`
- Runs tests in parallel across multiple constellations
- Timeout: 20 minutes

**6. TestCafe Tests (`.github/workflows/testcafe_tests.yml`):**
- Accessibility tests across multiple themes
- Component-specific tests
- Timeout: varies by test suite

### Common CI Failures and Fixes

**"Generated code is outdated":**
```bash
# For wrappers
pnpm run regenerate-all

# For component reexports (devextreme)
cd packages/devextreme
pnpm run update-ts-reexports
```

**"Lint errors":**
```bash
# Auto-fix where possible
pnpm run lint-js -- --fix
pnpm run lint-ts -- --fix
```

**"Build timeout":**
- Use `pnpm run all:build-dev` for faster builds during development
- CI uses caching for pnpm store and Nx cache

## Making Changes

### Workflow for Code Changes

1. **Install dependencies (if not done):**
   ```bash
   pnpm install --frozen-lockfile
   ```

2. **Make your changes in appropriate package:**
   - Core library: `packages/devextreme/js/`
   - Styles: `packages/devextreme-scss/scss/`
   - Wrappers: `packages/devextreme-{angular,react,vue}/src/`

3. **Build the affected package:**
   ```bash
   pnpx nx build:dev devextreme  # For core changes
   ```

4. **Run tests:**
   ```bash
   pnpm run test-jest            # Unit tests
   pnpm run lint                 # Linting
   ```

5. **If you modified wrapper sources, regenerate:**
   ```bash
   pnpm run regenerate-all       # Regenerates all wrappers
   # OR specific wrapper:
   pnpm run angular:regenerate
   pnpm run react:regenerate
   pnpm run vue:regenerate
   ```

6. **If you modified TypeScript declarations or devextreme-internal-tools:**
   ```bash
   cd packages/devextreme
   pnpm run regenerate-all
   pnpm run update-ts-reexports
   pnpm run update-ts-bundle
   ```

7. **Commit (pre-commit hook will run automatically):**
   ```bash
   git add .
   git commit -m "Your message"
   ```

### Common Pitfalls

**✅ DO:**
- Always use `pnpm install --frozen-lockfile`
- Build before testing: `pnpx nx build:dev devextreme`
- Run `pnpm run regenerate-all` after modifying wrapper generators, TypeScript declarations, or devextreme-internal-tools (may affect code generators and/or metadata generators)
- Use Nx commands for better caching: `pnpx nx build devextreme`
- Check CI workflows to understand what will be validated

### File Modification Guidelines

**Generated files (DO NOT EDIT DIRECTLY):**
- `packages/devextreme-angular/src/**/*` (except templates)
- `packages/devextreme-react/src/**/*` (except templates)
- `packages/devextreme-vue/src/**/*` (except templates)
- `packages/devextreme/js/renovation/**/*.j.tsx`
- `packages/devextreme/js/__internal/core/localization/default_messages.ts`
- `packages/devextreme/js/__internal/core/localization/cldr-data/**/*`

**Source files (EDIT THESE):**
- `packages/devextreme/js/**/*.js` (core logic)
- `packages/devextreme/js/**/*.ts` (TypeScript sources)
- `packages/devextreme-scss/scss/**/*.scss` (styles)
- `packages/devextreme-metadata/**/*` (metadata for wrappers)

## Debugging Tips

**Build issues:**
- Check Node version: `node --version` (should be 20.x)
- Check pnpm version: `pnpm --version` (should be 9.15.x)
- Clear Nx cache: `rm -rf .nx/cache`
- Clean and rebuild: `pnpm run clean && pnpm run build:dev`

**Test failures:**
- Ensure build is up-to-date: `pnpx nx build:dev devextreme`
- Check if test requires specific environment variables
- Review test logs in `packages/devextreme/testing/` directory

**Lint failures:**
- Run with `--fix` flag: `pnpm run lint-js -- --fix`
- Check `.eslintrc` or `eslint.config.mjs` for rules
- Verify file is not in ignore patterns

## Key Facts

- **Nx is used for task orchestration** - prefer `pnpx nx` commands over direct npm scripts
- **Custom Nx executors** - `devextreme-nx-infra-plugin` provides specialized executors for localization, file operations, and build tasks
- **Frozen lockfile is mandatory** - CI will fail without it
- **Build artifacts are in gitignore** - never commit `artifacts/` directories
- **Wrappers are generated** - modify generators, not generated code
- **Multiple test frameworks** - QUnit (legacy), Jest (new), TestCafe (E2E)
- **Monorepo uses pnpm workspaces** - dependencies are hoisted
- **CI uses custom runners** - `devextreme-shr2` for most jobs, `ubuntu-latest` for some
- **Timeouts are strict** - optimize for speed, use caching
- **Granular build caching** - individual build steps have proper Nx caching for faster rebuilds

## Quick Reference

```bash
# Setup
pnpm install --frozen-lockfile

# Build (dev)
pnpm run all:build-dev

# Build (prod)
pnpm run all:build

# Build with testing configuration (for CI)
pnpx nx build devextreme -c=testing

# Build specific targets
pnpx nx build:localization devextreme
pnpx nx build:transpile devextreme
pnpx nx bundle:debug devextreme

# Test
pnpx nx run-many -t test
pnpm run test-jest          # From devextreme package

# Lint
pnpx nx run-many -t lint
pnpm run lint               # From devextreme package

# Regenerate wrappers
pnpm run regenerate-all

# Clean
pnpm run clean              # From devextreme package
pnpx nx clean:artifacts devextreme  # Clean build artifacts only

# Run demos
pnpm run webserver          # From root, then visit localhost:8080
```

## Code Style and Conventions

**IMPORTANT:** All code contributions must follow the rules defined in `.github/instructions/`.

Before making any changes, always check `.github/instructions/` directory for file-specific or pattern-specific coding conventions and rules that apply to the files you're modifying.

## Trust These Instructions

These instructions are based on actual repository analysis including:
- Package.json scripts and configurations
- GitHub Actions workflows
- Build system files (gulpfile.js, nx.json)
- Project structure and file organization
- CI/CD pipeline requirements

**When in doubt, refer to these instructions first before exploring.** They represent the validated, working approach to building and testing this repository.
