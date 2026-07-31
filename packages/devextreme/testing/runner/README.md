# QUnit test runner (native ESM)

Developer notes for the Node HTTP runner that serves QUnit suites with **native ESM + import maps** (no SystemJS).

Related layout:

| Path | Role |
| --- | --- |
| `testing/runner/lib/` | Server-side request handling, source rewrites, import-map build |
| `testing/helpers/esm-shims/` | Browser-side shim modules wired through the import map / static redirects |

After changing TypeScript under `testing/runner/`, recompile (`tsc -p testing/runner/tsconfig.json`) and **restart** the process on port `20060` — templates and rewrite logic are loaded at process start.

---

## `lib/static.ts`

HTTP static file server for the QUnit runner.

**Responsibilities:**

- Resolve and serve workspace files (tests, helpers, artifacts, vendors) with correct content types and cache headers.
- Apply **serve-time transforms** so the browser receives valid ESM:
  - QUnit tests/helpers → `cjsInterop.rewriteQunitTestHelperSource`
  - `aspnet.js` UMD artifact → `cjsInterop.rewriteAspnetArtifactToEsm`
  - Vendor / Globalize / Intl / VectorMap bundles → wrap as ESM modules
  - JSON (`?esm-export=1`) → `export default …`
- Redirect selected ESM artifact URLs to **hand-written** mutable facades under `testing/helpers/esm-shims/` (see `MUTABLE_FACADE_GROUPS`).
- For pure `import * as X; export default X` viz reexports, generate facades on the fly via `autoMutableFacade.tryBuildAutoMutableFacade`.
- Support `?dx-original=1` so a shim can import the **real** artifact without being redirected back to itself.

This module is the integration point: almost every special-case rewrite for QUnit ESM loading goes through `tryServeStatic`.

---

## `lib/cjsInterop.ts`

Serve-time **CJS → ESM** source rewrites for QUnit tests, helpers, and bundle templates.

Legacy suites still use `require()`, `module.exports` / `exports.*`, AMD `define(function () { … })`, and CJS-style `import x from 'bare-specifier'`. Native ESM cannot load those as-is.

**What it does:**

1. **`require('…')`** → hoisted `import * as __dxReq_N` plus `(ns.default ?? { …ns })` at the call site (mutable shallow copy when there is no default — needed when tests assign onto the module object).
2. **`module.exports` / `exports.*`** → wrap the file with a synthetic `module`/`exports` object and emit `export default` + named exports.
3. **Bare default / named imports** → namespace import + CJS default interop (`ns.default ?? …`, merge default object/function into named bindings when needed).
4. **AMD `define(function () { … })`** → IIFE, with imports hoisted to file top (imports inside `if (define.amd)` are illegal in ESM).
5. **Plugin-style JSON** (`file.json!` / `file.json!json`) → absolute URLs with `?esm-export=1`.
6. **`aspnet.js`** → dedicated UMD → ESM conversion (`rewriteAspnetArtifactToEsm`).

`esm-shims/` files are **excluded** from this pipeline (`isQunitTestOrHelperPath`) — they are already real ESM.

---

## `lib/autoMutableFacade.ts`

Generates **mutable ESM facades** at request time for modules that are pure namespace reexports:

```js
import * as X from './internal/…';
export default X;
```

ESM named exports are live bindings but the **export binding itself** is not assignable, and a frozen namespace object cannot be stubbed the way QUnit historically stubbed CJS `module.exports`. Tests need a single mutable `api` object (and wrapable constructors) shared across import-map and artifact URLs.

**Flow:**

1. Detect a pure namespace-default reexport.
2. Resolve the internal module, classify exports (`wrapCtor` for classes/functions vs live value forwards / `DEBUG_set_*`).
3. Emit a facade that uses `testing/helpers/esm-shims/mutable_facade.js` (`createMutableApi`, `wrapCtor`) and imports the real module with `?dx-original=1`.
4. `static.ts` serves that generated source instead of the original reexport file.

Hand-written shims in `esm-shims/` cover cases that need custom composition (animation frame, themes, CSS injectors, etc.). Prefer auto-generation for simple reexports; add a hand-written shim only when the auto facade is not enough.

---

## `testing/helpers/esm-shims/`

Browser modules that the import map (and/or `static.ts` artifact redirects) substitute for real package / artifact specifiers during QUnit runs.

**Why they exist:**

- **Stubbing / mutation** — provide a mutable default `api` (and wrapped constructors) so sinon/`stubClass` can replace implementations without editing `packages/devextreme/js`.
- **Globals bridge** — e.g. `jquery.js` / `knockout.js` re-export the classic `<script>` globals after `noConflict()`.
- **CSS plugin imports** — suites still write `import 'fluent_blue_light.css!'`; `*.css.js` shims call `injectStylesheet.js` to append `<link>` tags.
- **Vendor / interop quirks** — thin adapters (`jspdf_autotable.js`, `tslib.js`, `zod.js`, …) when the stock ESM build is awkward for the runner.
- **Shared helpers** — `mutable_facade.js` (`createMutableApi`, `wrapCtor`) used by both hand-written and auto-generated facades; `injectStylesheet.js` for theme CSS.

Typical mutable-shim pattern:

1. `import * as original from '…/artifact.js?dx-original=1'`
2. Put a mutable `api` on `globalThis` (one instance for all URL aliases)
3. `export default api` and forward / wrap named exports

Do **not** put product fixes in these shims — they are test-runner adapters only. Prefer extending `autoMutableFacade` for simple reexport cases before adding a new hand-written file.
