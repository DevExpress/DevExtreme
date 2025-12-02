# DevExtreme Demos

This repository contains technical DevExtreme demos for Angular, React, Vue, and jQuery.

To run the demos on your machine, clone this repository, run `pnpm install`, and follow the instructions below.

## Prepare Demos for Development

### Run demos locally

In `monorepo/root`

Build all dependencies and prepare systemJS configs by executing:
```
pnpm run demos:prepare
```

Start webserver:
```
pnpm run demos:start
```
Navigate to http://localhost:8080/.

You can pass additional parameter to specify port. It can be useful when you need to fast switching between one demo on different frameworks.


### Bundled mode

Angular, Vue, and React demos can use bundles instead of separate files from `node_modules`. With bundles, demos launch faster but become harder to debug. 

In `apps/demos`

Run the following command to create the bundles and replace the SystemJS configuration:

```
pnpm run prepare-bundles
```

To return to using separate files from `node_modules`, run:

```
pnpm run prepare-js
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
