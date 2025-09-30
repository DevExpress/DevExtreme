# DevExtreme Demos

This repository contains technical DevExtreme demos for Angular, React, Vue, jQuery, ASP.NET MVC, and ASP.NET Core.

To run the demos on your machine, clone this repository, run `pnpm install`, and follow the instructions below.

## Prepare Demos for Development
Before running you need execute in `monorepo/root`:

```
pnpm run all:build-dev
```

To prepare demos for development:

```
pnpm run prepare-js
```

Angular, Vue, and React demos can use bundles instead of separate files from `node_modules`. With bundles, demos launch faster but become harder to debug. Run the following command to create the bundles and replace the SystemJS configuration:

```
pnpm run prepare-bundles
```

To return to using separate files from `node_modules`, run `pnpm run prepare-js`.


### Launch

#### Option 1
```
pnpm run launch-demo
```

#### Option 2
1. Run ```pnpm run webserver ``` from `monorepo/root`
2. Navigate to http://localhost:8080/apps/demos.

You can pass additional parameter to specify port. It can be useful when you need to fast switching between one demo on different frameworks:

### Before Commiting Сhanges

For fix autofixed errors:

```
pnpm run fix-lint
```

### Development

1. Run the following script to add a new demo:

    ```
    pnpm run add-demo
    ```

1. Use the built-in CLI to choose or enter the category, the demo name, and the technology for the new demo.

### TS React Infrastructure

1. After you make any changes in React TypeScript sources, run the following command:

```
pnpm run convert-to-js split
```

If you want to run this script on specific folder you can pass it to the arguments

```
pnpm run convert-to-js "JSDemos/Demos/Diagram/**/React"
```

1. To ensure that React JavaScript and TypeScript sources are always in sync, the following GitHub action is used: "Check generated JS demos".


## See Also

- [Technical demos online](https://js.devexpress.com/Demos/)
- [Examples on GitHub](https://github.com/DevExpress/DevExtreme-examples)
