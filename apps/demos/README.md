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
window.parent.postMessage({ type: 'demo-rendered' }, '*');
```


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
