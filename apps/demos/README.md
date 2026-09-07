# DevExtreme Demos

This repository contains technical DevExtreme demos for Angular, React, Vue, and jQuery.

To run the demos on your machine, clone this repository, run `pnpm install`, and follow the instructions below.

## Prepare Demos for Development

### Run demos locally

From the monorepo root.

Build DevExtreme and pack the Angular/React/Vue wrappers:

```
pnpm run demos:prepare
```

Start the web server:

```
pnpm run demos:start
```

Navigate to http://localhost:8080/.

You can pass a port as an extra argument. That is useful when you need to switch the same demo between frameworks quickly.

Angular, React, and Vue demos are bundled on demand when you open a page. jQuery demos load `dx.all.js` from `devextreme-dist`.

### Demo render signal

Angular, React, and Vue demos are not bundled from their own entry point directly. `utils/server/demo-render-signal.js` generates a shim that becomes the bundle's entry point; the shim waits for `themes.initialized()` from `devextreme/ui/themes`, then imports the demo's entry (`index.tsx` / `index.ts` / `app/app.component.ts`), so nothing mounts before the theme CSS is applied. 

Once the demo has rendered, the shim posts one message to the embedding page:

```js
window.parent.postMessage({ type: 'demo-rendered' }, targetOrigin);
```

#### Allowed embedding origins

`targetOrigin` is never `'*'` — the runtime resolves the embedder's origin and posts only when it is trusted:

1. Not framed, or framed by a page on the demo's own origin — posts to the own origin. This covers local development and the visual tests, so `localhost` needs no configuration.
2. Framed cross-origin — the origin comes from `location.ancestorOrigins[0]`, falling back to the origin of `document.referrer` (Firefox has no `ancestorOrigins`), and must match the allowlist.
3. Origin not derivable (for example, an embedder sending `Referrer-Policy: no-referrer` on Firefox) or not on the allowlist — nothing is posted, and the demo logs a warning to the console.

The allowlist defaults to the sandboxes that embed the demos:

| Entry | Covers |
| --- | --- |
| `*.devexpress.com` | `js.devexpress.com`, `js-stage.devexpress.com`, `az-jsserver.corp.devexpress.com` |
| `js.devexpress.devx` | the internal dev host |
| `localhost` | the local site on any port, when it frames demos served from another port |

An entry is `[<scheme>://]<host>[:<port>]`, and an omitted part matches anything:

- **Host** — either an exact hostname or a `*.<suffix>` subdomain wildcard. The wildcard requires a dot before the suffix, so `*.devexpress.com` accepts `js.devexpress.com` and `az-jsserver.corp.devexpress.com` but rejects the `devexpress.com` apex and `evil-devexpress.com`.
- **Scheme** — omit it to accept both HTTP and HTTPS; write `https://js.devexpress.com` to accept only HTTPS.
- **Port** — omit it to accept any port; write `localhost:44332` to accept only that one. A pinned port must match the origin's explicit port, so `:443` will not match `https://host`.

Anything that is not a bare origin — a trailing slash or a path, for example — never matches and is silently ignored.

Override the list at build time with a comma-separated `DEMO_PARENT_ORIGINS`:

```
DEMO_PARENT_ORIGINS='https://js.devexpress.com,https://staging.example:8443' node utils/server/csp-bundle.js --framework=React
```

The list is baked into every demo bundle, so adding a sandbox origin means rebuilding the demos.

### Before Commiting Changes

Auto-fix lint errors:

```
pnpm run fix-lint
```

### Adding new demo

1. Run the following script to add a new demo:

    ```
    pnpm run add-demo
    ```

2. Use the built-in CLI to choose or enter the category, the demo name, and the technology for the new demo.

### TS React Infrastructure

After you make any changes in React TypeScript sources, run the following command:

```
pnpm run convert-to-js split
```

If you want to run this script on specific folder you can pass it to the arguments

```
pnpm run convert-to-js "JSDemos/Demos/Diagram/**/React"
```

The "Check generated JS demos" GitHub Action ensures that the React JavaScript and TypeScript sources remain in sync.
## See Also

- [Technical demos online](https://js.devexpress.com/Demos/)
- [Examples on GitHub](https://github.com/DevExpress/DevExtreme-examples)
