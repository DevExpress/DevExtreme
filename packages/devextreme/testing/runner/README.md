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
- Redirect the few artifact URLs that have a hand-written shim (themes) — see `handWrittenShims.ts`.

This module is the integration point: almost every special-case rewrite for QUnit ESM loading goes through `tryServeStatic`.

---

## `lib/cjsInterop.ts`

Serve-time **CJS → ESM** source rewrites for QUnit tests, helpers, and bundle templates.

`testing/tests/**` and `testing/helpers/**` are now fully native ESM (no `require()`/`module.exports`/AMD left) — the CJS/AMD rewrites below only still fire for `build/bundle-templates/**` (bundler-input sources, out of scope for the QUnit migration). CJS-style `import x from 'bare-specifier'` (bare default/named imports on modules with an imperfect export shape) is still common everywhere and always rewritten, except `jquery` — its shim has a real `export default $`, so it's excluded and loads natively.

**What it does:**

1. **`require('…')`** (bundle templates only) → hoisted `import * as __dxReq_N` plus `('default' in ns ? ns.default : { …ns })` at the call site (keeps explicit `default: null` for noJQuery/…; mutable shallow copy only when there is no default — needed when tests assign onto the module object).
2. **`module.exports` / `exports.*`** (bundle templates only) → wrap the file with a synthetic `module`/`exports` object and emit `export default` + named exports.
3. **Bare default / named imports** → namespace import + CJS default interop (`'default' in ns ? ns.default : …`, merge default object/function into named bindings when needed); `jquery` is excluded and passes through untouched.
4. **Plugin-style JSON** (`file.json!` / `file.json!json`, bundle templates only) → absolute URLs with `?esm-export=1`.
5. **`aspnet.js`** → dedicated UMD → ESM conversion (`rewriteAspnetArtifactToEsm`).

`esm-shims/` files are **excluded** from this pipeline (`isQunitTestOrHelperPath`) — they are already real ESM.

---

## Stubbing a module from a test

Modules are served as plain ESM artifacts. A module namespace object is frozen, so
`sinon.stub(module, 'name')` and `module.name = fn` both throw — the exporting module
is the only thing that can reassign its own binding.

The house pattern is a **`DEBUG_set_*` seam**: turn the export into a `let` and add a
setter inside a `/// #DEBUG` block, which `-c qunit` builds keep and production builds
strip.

```ts
export let Renderer = function (options) { /* … */ };

/// #DEBUG
export function DEBUG_set_Renderer(value: typeof Renderer): void {
  Renderer = value;
}
/// #ENDDEBUG
```

Product code that does `import { Renderer } from '…'` sees the new value, because ESM
named exports are live bindings.

In tests, drive the seam through [`testing/helpers/moduleSeam.js`](../helpers/moduleSeam.js),
which re-attaches the `.restore()` that an anonymous `sinon.stub()` lacks:

```js
import { stubSeam, spySeam } from '../../helpers/moduleSeam.js';

// was: sinon.stub(rendererModule, 'Renderer')
const stub = stubSeam(rendererModule, 'Renderer', 'DEBUG_set_Renderer');
// …
stub.restore();

// was: rendererModule.Renderer = fn;
rendererModule.DEBUG_set_Renderer(fn);
```

**Import the barrel that has a default export.** `cjsInterop` rewrites a default import
from a bare specifier to `('default' in ns ? ns.default : { ...ns })`. A barrel with no
default (`viz/core/utils.js`, `viz/core/renderers/renderer.js`) therefore hands the test
a dead **copy** — seams installed elsewhere stay invisible. Use the `_default` barrel
(`viz/core/utils_default`, `viz/core/renderers/renderer_default`), which is
`import * as X; export default X`.

Older sources use `exports.DEBUG_set_X = DEBUG_set_X` instead of `export function`;
`static.ts` rewrites that to a real ESM export at serve time, so both spellings work.

---

## `testing/helpers/esm-shims/`

Browser modules that the import map (and/or `static.ts` artifact redirects) substitute for real package / artifact specifiers during QUnit runs.

**Why they exist:**

- **Custom composition** — e.g. `themes.js`, which the import map and `static.ts` both point at. Stubbing is *not* a reason to add a shim; use a `DEBUG_set_*` seam instead.
- **Globals bridge** — e.g. `jquery.js` / `knockout.js` re-export the classic `<script>` globals after `noConflict()`.
- **CSS plugin imports** — suites still write `import 'fluent_blue_light.css!'`; `*.css.js` shims call `injectStylesheet.js` to append `<link>` tags.
- **Vendor / interop quirks** — thin adapters (`jspdf_autotable.js`, `tslib.js`, `zod.js`, …) when the stock ESM build is awkward for the runner.
- **Shared helpers** — `injectStylesheet.js` for theme CSS.

Do **not** put product fixes in these shims — they are test-runner adapters only.
