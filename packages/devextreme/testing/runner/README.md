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
- Serve **generated** mutable facades for modules in `MUTABLE_MODULE_GROUPS` / viz namespace-reexports; redirect only special hand-written cases (e.g. themes).
- For pure `import * as X; export default X` viz reexports, generate facades on the fly via `autoMutableFacade.tryBuildAutoMutableFacade`.
- Support `?dx-original=1` so a shim can import the **real** artifact without being redirected back to itself.

This module is the integration point: almost every special-case rewrite for QUnit ESM loading goes through `tryServeStatic`.

---

## `lib/cjsInterop.ts`

Serve-time **CJS → ESM** source rewrites for QUnit tests, helpers, and bundle templates.

Legacy suites still use `require()`, `module.exports` / `exports.*`, AMD `define(function () { … })`, and CJS-style `import x from 'bare-specifier'`. Native ESM cannot load those as-is.

**What it does:**

1. **`require('…')`** → hoisted `import * as __dxReq_N` plus `('default' in ns ? ns.default : { …ns })` at the call site (keeps explicit `default: null` for noJQuery/…; mutable shallow copy only when there is no default — needed when tests assign onto the module object).
2. **`module.exports` / `exports.*`** → wrap the file with a synthetic `module`/`exports` object and emit `export default` + named exports.
3. **Bare default / named imports** → namespace import + CJS default interop (`'default' in ns ? ns.default : …`, merge default object/function into named bindings when needed).
4. **AMD `define(function () { … })`** → IIFE, with imports hoisted to file top (imports inside `if (define.amd)` are illegal in ESM).
5. **Plugin-style JSON** (`file.json!` / `file.json!json`) → absolute URLs with `?esm-export=1`.
6. **`aspnet.js`** → dedicated UMD → ESM conversion (`rewriteAspnetArtifactToEsm`).

`esm-shims/` files are **excluded** from this pipeline (`isQunitTestOrHelperPath`) — they are already real ESM.

---

## `lib/autoMutableFacade.ts`

Generates **mutable ESM facades** at request time so QUnit can `sinon.stub` module APIs without editing `packages/devextreme/js`.

**Two sources of facades:**

1. **`MUTABLE_MODULE_GROUPS`** ([`mutableModuleGroups.ts`](./lib/mutableModuleGroups.ts)) — explicit list of stub-able modules (animation frame, viz renderer, exporter, …). All aliases share one `globalThis` api; named exports use `wrapCtor` / live forwards. Import map points at the ESM artifact URL; `static.ts` serves the generated facade unless `?dx-original=1`. Codegen lives in `autoMutableFacade.ts`.
2. **Namespace-default reexports** (`import * as X; export default X`) under `viz/` — discovered automatically.

Hand-written files under `esm-shims/` remain only for **non-generic** cases (themes composition, CSS inject, jquery/knockout globals, vendor stubs).

Typical generated shape:

```js
import * as original from '.../module.js?dx-original=1';
import { createMutableApi, wrapCtor } from '.../mutable_facade.js';

const api = createMutableApi(original, '__dxAutoMutable_…');
export const Foo = wrapCtor(api, 'Foo');
export default api;
```

To stub a new module, add a group entry in [`mutableModuleGroups.ts`](./lib/mutableModuleGroups.ts):

```ts
{
  internal: '__internal/viz/core/title.js', // real module under esm/
  also: ['viz/core/title.js'],            // extra artifact URLs → same facade
  extraKeys: ['animation/frame'],         // optional bare import-map keys
  apiFromDefault: true,                   // when default export is the stub target
}
```

Import-map keys are derived as `strip(.js)` of `internal`/`also`, plus `extraKeys`. Prefer this over a new hand-written shim.
---

## `testing/helpers/esm-shims/`

Browser modules that the import map (and/or `static.ts` artifact redirects) substitute for real package / artifact specifiers during QUnit runs.

**Why they exist:**

- **Stubbing / mutation** — prefer `MUTABLE_MODULE_GROUPS` in `mutableModuleGroups.ts` (serve-time generated facades via `autoMutableFacade.ts`). Keep a hand-written shim only for custom composition (e.g. themes).
- **Globals bridge** — e.g. `jquery.js` / `knockout.js` re-export the classic `<script>` globals after `noConflict()`.
- **CSS plugin imports** — suites still write `import 'fluent_blue_light.css!'`; `*.css.js` shims call `injectStylesheet.js` to append `<link>` tags.
- **Vendor / interop quirks** — thin adapters (`jspdf_autotable.js`, `tslib.js`, `zod.js`, …) when the stock ESM build is awkward for the runner.
- **Shared helpers** — `mutable_facade.js` (`createMutableApi`, `wrapCtor`) used by generated and hand-written facades; `injectStylesheet.js` for theme CSS.

Do **not** put product fixes in these shims — they are test-runner adapters only. To stub a new module, add it to `MUTABLE_MODULE_GROUPS` first (`internal` / `also` / `extraKeys`).
