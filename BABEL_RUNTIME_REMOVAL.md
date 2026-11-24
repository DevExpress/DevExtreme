# Findings: `@babel/runtime` usage

DevExtreme declares `@babel/runtime` in [packages/devextreme/package.json](packages/devextreme/package.json) because its generated ESM code imports Babel helper functions from that package.

In the transpiled artifacts currently on disk, there are **38 imports**, all referencing:

```js
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
```

See the transpiled ESM output: [relative path](packages/devextreme/artifacts/transpiled-esm-npm/esm/) · [GitHub URL](https://github.com/DevExpress/DevExtreme/tree/main/packages/devextreme/artifacts/transpiled-esm-npm/esm/).

Example, `pagination_wrapper.js`: [relative path](packages/devextreme/artifacts/transpiled-esm-npm/esm/__internal/pagination/wrappers/pagination_wrapper.js) · [GitHub URL](https://github.com/DevExpress/DevExtreme/blob/main/packages/devextreme/artifacts/transpiled-esm-npm/esm/__internal/pagination/wrappers/pagination_wrapper.js).

These are local generated artifacts; the relative links require a build that produces them. The GitHub URLs use the `main` branch, but these artifacts are not tracked in Git, so the GitHub URLs will not resolve unless the artifacts are committed and pushed.

This helper implements object rest destructuring, such as:

```js
const { excluded, ...rest } = source;
```

The [ESM build configuration](packages/devextreme/build/transpile-config.js) enables `@babel/plugin-transform-runtime` with `useESModules: true`. The plugin replaces inline helpers with imports from `@babel/runtime`, reducing duplication across compiled files. The runtime package supplies those helpers; it does not create ESM modules. The separate `modules: false` setting preserves `import` and `export` syntax.

The plugin is a build dependency, while the runtime is a production dependency because published code imports it. See the [Babel documentation](https://babeljs.io/docs/babel-plugin-transform-runtime).

# Removal strategy

The smallest change is to let Babel embed helpers in each compiled file. Component source code does not need rewriting.

1. In [transpile-config.js](packages/devextreme/build/transpile-config.js), remove `@babel/plugin-transform-runtime` from the `esm` configuration:

   ```js
   esm: Object.assign({}, common, {
       presets: [['@babel/preset-env', { targets, modules: false }]],
   })
   ```

   The common plugins remain inherited, including the object rest/spread transform. Keeping `modules: false` preserves ESM output. Babel will emit local helpers instead of runtime imports.

2. Remove `@babel/runtime` from `dependencies` in [packages/devextreme/package.json](packages/devextreme/package.json).

3. Remove `@babel/plugin-transform-runtime` from that package's `devDependencies` if no other build in the package needs it. Other workspace packages have their own references; assess those separately.

4. Update the lockfile and regenerate the npm artifacts, including both public and internal ESM output. Use a clean rebuild so stale output does not affect verification.

5. Search the generated ESM and CJS JavaScript for remaining `@babel/runtime` references, inspect the generated package metadata, and run the relevant ESM, CJS, and bundler checks. Compare output and bundle sizes to quantify helper duplication.

The tradeoff is duplicated helper code: each affected compiled file can contain its own helper. This removes DevExtreme's direct runtime dependency while preserving the existing syntax transforms and browser targets.

If duplication is unacceptable, an alternative is to ship a shared helper inside DevExtreme and configure the build to import it. That requires additional build maintenance and validation of helper behavior; inlining is the simpler change.

Keep the runtime mappings in [the test runner import map](packages/devextreme/testing/runner/lib/importMap.ts) until their remaining consumers are checked. Its comments identify `jspdf` as another runtime consumer. Removing DevExtreme's direct dependency does not guarantee that `@babel/runtime` disappears from the complete dependency tree.

This document records findings and a proposed strategy; no build configuration or dependencies have been changed.

---
---

# Review, implementation and proof (2026-11-23)

Everything below was checked against clean builds of `main`, before and after the change.

## Verdict on the findings above

| Claim above | Verdict | Notes |
|---|---|---|
| ESM output imports `objectWithoutPropertiesLoose` from `@babel/runtime` | **Correct, count stale** | A clean build of current `main` gives **39** files, not 38. The 38 came from stale local artifacts. It is still the only helper imported. |
| Only the `esm` Babel config uses `transform-runtime` | **Correct** | `cjs` and `tsCjs` never used it. |
| Removal steps 1–3 | **Correct** | They are sufficient for the build. |
| "Keep the runtime mappings in the test runner import map" | **Wrong: removal breaks QUnit** | See [Missing 1](#missing-1-qunit-import-map). |
| Step 5: "compare output and bundle sizes" | **Not proven** | No pass/fail criteria were defined. They are defined and run below. |
| Tradeoff: duplicated helper code | **Quantified** | ESM grows by **+3,861 bytes** across 39 files (about +100 B per file: a 190 B helper line replaces a 90 B import line). CJS and the `dx.*.js` bundles do not change. |

## What was missing

### Missing 1: QUnit import map
[importMap.ts](packages/devextreme/testing/runner/lib/importMap.ts) mapped `@babel/runtime/*` to `/packages/devextreme/node_modules/@babel/runtime/…`. Under pnpm, that symlink exists **only because of the dependency being removed**.

jspdf 4.2.1's ESM build (`jspdf.es.min.js`) imports `@babel/runtime/helpers/typeof` and `@babel/runtime/helpers/slicedToArray`. Without the symlink, every QUnit page that imports `jspdf` would get a 404. Those pages include `DevExpress.exporter/jspdf.dataGrid_autotable.tests.js` and the suites under `jspdfParts/`.

CI's QUnit job is affected too. It builds ESM (`build:transpile -c ci`) and loads it through this import map.

The fix has to resolve **jspdf's own copy** of `@babel/runtime`. A name scan of the pnpm store, the way `fflate` is resolved, does not work: the store holds `7.29.2`, `7.29.7`, `7.29.15` and `8.0.5`. Reverse sorting picks `8.0.5`, and Babel 8's runtime has no `helpers/esm/` folder.

### Missing 2: the CJS build already inlines the same helper
The CJS build **already inlines exactly this helper** in the same 39 modules. After the change, ESM matches what CJS users and `dx.all.js` users have always received. Every inlined helper line was checked to be byte-identical to the one in the module's CJS build (C3). It is also identical, ignoring whitespace, to `@babel/runtime@7.29.2/helpers/esm/objectWithoutPropertiesLoose.js`, the code consumers resolve today (C4).

### Missing 3: other facts not covered above
- **Bundles are unaffected.** `dx.all.js`, `dx.web.js`, `dx.viz.js` and the others are built by webpack from `artifacts/transpiled-renovation-npm`, which is CJS. C2 shows these inputs are byte-identical.
- **The published `package.json` updates itself.** `build:npm:root-package-json` generates it from `packages/devextreme/package.json` and strips only `devDependencies`, `publishConfig` and `scripts`. The same applies to `devextreme-internal`. C6 confirms it.
- **Dropping the `@babel/plugin-transform-runtime` devDependency is safe.** `nx-infra-plugin` declared it as an optional peer only because devextreme's config used it. That peer is removed too (see below), and the plugin's `babel-transform` spec passes. `e2e/testcafe-devextreme` declares its own copy, and TestCafe brings its own (`7.23.3`) for compiling tests. That is unrelated to devextreme's output, so it is left as is.
- **Consumers no longer get it transitively.** None of devextreme's production dependencies depend on `@babel/runtime` (`pnpm why @babel/runtime --prod`). After the change, `npm i devextreme` does not install it at all.
- **Nx cache can fake a "no diff".** Babel outputs can be restored from cache. Comparisons must run with `NX_SKIP_NX_CACHE=true` and start from cleaned output folders.
- **`NOTICE.txt` listed "Babel (@babel/runtime)".** Babel helper code is still shipped, now inlined, as it always was in CJS. The inlined code comes from `@babel/helpers`, so the entry now reads **"Babel (@babel/helpers)"** with the same license, copyright and URL. If legal prefers, the entry can be removed instead.
- **`e2e/wrappers/package.json` declared `@babel/runtime`.** Its `node_modules/devextreme` links to `packages/devextreme/artifacts/npm/devextreme`, and the Angular build uses `preserveSymlinks: true`. So devextreme's bare imports resolve from the wrappers app's own `node_modules`, which is why its `dependencies` copy devextreme's. ESM no longer imports `@babel/runtime`, so the entry is removed there too.

## Changes

| File | Change |
|---|---|
| [transpile-config.js](packages/devextreme/build/transpile-config.js) | Removed `@babel/plugin-transform-runtime` from `esm`. `common.plugins` are still inherited through `Object.assign`. |
| [package.json](packages/devextreme/package.json) | Removed `dependencies["@babel/runtime"]` and `devDependencies["@babel/plugin-transform-runtime"]`. |
| [importMap.ts](packages/devextreme/testing/runner/lib/importMap.ts) | New `resolvePackageDependencyUrl('jspdf', '@babel/runtime')` resolves the copy jspdf depends on (`/node_modules/.pnpm/@babel+runtime@7.29.2/…`). It falls back to the old path. The now-unused `helpers/esm/` entry is gone, because nothing imports it any more. |
| [NOTICE.txt](NOTICE.txt) | "Babel (@babel/runtime)" is now "Babel (@babel/helpers)". |
| [e2e/wrappers/package.json](e2e/wrappers/package.json) | Removed `@babel/runtime`. |
| [nx-infra-plugin/package.json](packages/nx-infra-plugin/package.json) | Removed the optional peer `@babel/plugin-transform-runtime` from `peerDependencies` and `peerDependenciesMeta`. |
| [executor.e2e.spec.ts](packages/nx-infra-plugin/src/executors/babel-transform/executor.e2e.spec.ts) | The fixture copy of `transpile-config.js` now matches the real config. Its assertions never depended on the plugin. |
| `pnpm-lock.yaml` | Only four `importers` entries are removed: `@babel/runtime` from devextreme and from wrappers-testing, and `@babel/plugin-transform-runtime` from devextreme and from nx-infra-plugin. The packages stay in the lockfile because other consumers (jspdf, canvg, Angular, TestCafe) still use them. `pnpm install --frozen-lockfile` passes. |

Intentionally unchanged:
- `e2e/testcafe-devextreme`'s `@babel/plugin-transform-runtime`. It belongs to the TestCafe test toolchain, not to devextreme's output.
- The `@babel/runtime` entries in the import map. jspdf still needs them.

After all of the edits above, a rebuild is **byte-identical** to the verified "after" snapshot (10,319 files). The `babel-transform` spec passes (8/8), prettier is clean, and `pnpm peers check` reports nothing about Babel's runtime.

## Acceptance criteria

The checks are automated in [BABEL_RUNTIME_REMOVAL.check.mjs](BABEL_RUNTIME_REMOVAL.check.mjs). A snapshot is the contents of `artifacts/transpiled`, `artifacts/transpiled-renovation-npm`, `artifacts/transpiled-esm-npm` and `artifacts/npm/devextreme/package.json`.

| # | Criterion | Why it matters |
|---|---|---|
| C0 | Two clean builds of the baseline are byte-identical. | Without this, any diff could be noise. |
| C1 | Before and after have the same set of files. | No module appears or disappears. |
| C2 | Everything outside `transpiled-esm-npm/esm/` is **byte-identical**: CJS, production CJS, npm `cjs/`, `bundles/`, dual-mode `package.json` files. | CJS consumers and the webpack bundle inputs are untouched. |
| C3 | In ESM, files without a runtime import are byte-identical. Files with one differ **only** by the import line being replaced with a single inlined helper declaration of the same name, and that line equals the helper in the module's CJS build. | No other codegen change slipped in. |
| C4 | There is exactly one text variant per helper, and it equals the `@babel/runtime` helper consumers resolve today (ignoring whitespace). | Runtime behaviour is unchanged. |
| C5 | No `@babel/runtime` string remains in any output file or in the published `package.json`. | The dependency is fully removed. |
| C6 | The published `package.json` differs only by the removed `dependencies["@babel/runtime"]`. | The package metadata change is exact. |
| C7 | The set of bare imports in `esm/` and `cjs/` equals the old set minus `@babel/runtime`, and no new import is missing from `dependencies` or `peerDependencies`. | Nothing still needs the removed package. |

The script was also run on an **unchanged** pair of snapshots (baseline vs. baseline). C3–C7 fail there, which shows the checks are not vacuous.

### Results

```
CONTROL C0: before == before2 (byte-identical, 10319 files)

PASS C1 Same file set (10318 files)
PASS C2 Non-ESM output byte-identical (... 7882 files)
PASS C3 ESM: 2397 files byte-identical, 39 files differ only by "import helper from @babel/runtime" -> inlined helper (same text as in their CJS build)
PASS C4 Inlined helpers: one variant per helper, identical to the @babel/runtime helper consumers get today
       objectWithoutPropertiesLoose: function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
PASS C5 No "@babel/runtime" string left in any output file or the published package.json
PASS C6 Published package.json: only "dependencies.@babel/runtime" removed
PASS C7 Imported packages (esm/ + cjs/): same set minus @babel/runtime; no new undeclared imports
INFO ESM size: 12801205 -> 12805066 bytes (+3861) over 39 affected files

QUnit import map (compiled runner, evaluated from packages/devextreme and from the repo root):
  @babel/runtime/helpers/typeof        -> /node_modules/.pnpm/@babel+runtime@7.29.2/.../helpers/esm/typeof        EXISTS
  @babel/runtime/helpers/slicedToArray -> /node_modules/.pnpm/@babel+runtime@7.29.2/.../helpers/esm/slicedToArray EXISTS
  old target packages/devextreme/node_modules/@babel/runtime/...                                                 MISSING (as expected)
```

A typical ESM diff (`esm/__internal/ui/validator.js`) looks like this:

```diff
-import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
 ...
+function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
```

The 39 affected modules are all under `__internal/`: `grids/new` (10), `ui/check_box` (4), `scheduler/r1` (4), `scheduler/workspaces` (3), `scheduler/view_model` (2), `grids/grid_core` (2), `core/r1` (2), and one each in `viz/core`, `ui/validator`, `ui/load_panel`, `ui/html_editor`, `ui/hierarchical_collection`, `ui/chat`, `ui/button`, `scheduler/appointment_popup`, `pagination/wrappers`, `integration/knockout`, `filter_builder`, `exporter/jspdf`.

### How to reproduce

```bash
# 1. On a clean main (before the change), from packages/devextreme:
rm -rf artifacts/transpiled artifacts/transpiled-esm-npm artifacts/transpiled-renovation-npm
NX_SKIP_NX_CACHE=true NX_DAEMON=false pnpm nx build:transpile devextreme
NX_SKIP_NX_CACHE=true pnpm nx build:npm:root-package-json devextreme
mkdir -p /tmp/snap/before && cp -R artifacts/transpiled artifacts/transpiled-esm-npm artifacts/transpiled-renovation-npm /tmp/snap/before/ \
  && cp artifacts/npm/devextreme/package.json /tmp/snap/before/npm-package.json
# (repeat into /tmp/snap/before2 and run `diff -rq` against before for C0)

# 2. Apply the change, run `pnpm install`, then repeat step 1 into /tmp/snap/after

# 3. From the repo root:
node BABEL_RUNTIME_REMOVAL.check.mjs /tmp/snap/before /tmp/snap/after \
  node_modules/.pnpm/@babel+runtime@7.29.2/node_modules/@babel/runtime/helpers/esm
```

Each `build:transpile` takes about 1–2 minutes.

## Still to verify (dev server or CI)

1. **QUnit in a browser.** Start `pnpm run dev` and open:
   - The jspdf suites, which exercise the import-map fix: `http://localhost:20060/run/DevExpress.exporter/jspdf.dataGrid_autotable.tests.js?notimers=true&nojquery=true&nocsp=true`
   - Suites that cover modules with the inlined helper, as a sanity check: `DevExpress.ui.widgets.editors/validator.tests.js`, `DevExpress.ui.widgets.editors/checkbox.tests.js`, `DevExpress.ui.widgets/button.tests.js`, `DevExpress.ui.widgets/loadPanel.tests.js`
2. **CI on the PR:** `build_all.yml` (production build plus `verify:licenses`), `qunit_tests.yml`, `wrapper_tests.yml` and `testcafe_tests.yml`.
3. **Not needed:** Jest. It runs on TS sources and never used this Babel config.

## Side finding (unrelated to Babel)

[js/viz/core/renderers/animation.js](packages/devextreme/js/viz/core/renderers/animation.js) imports `'__internal/viz/core/renderers/animation'` as a bare specifier. The file ships in npm `esm/` and `cjs/`, but that path does not resolve for consumers. Today only QUnit imports it, through the import map, so nothing is broken in practice. The fix is a relative import, in a separate PR.
