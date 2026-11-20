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

For Angular demos, follow [Writing Angular demos](../../.github/instructions/demos-angular.instructions.md).

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
## Screenshot Tests

Every demo page is compared with an etalon in `testing/etalons`. jQuery demos run on [Playwright](https://playwright.dev/) (`testing/common.spec.ts`); React, Vue and Angular demos, the manual widget tests (`testing/widgets`) and the accessibility checks still run on TestCafe.

### Run locally

Build DevExtreme first (`pnpm run demos:prepare` from the monorepo root). The tests use the system Google Chrome and start their own web server.

```
cd apps/demos
pnpm run test-playwright --ignore-snapshots                # every jQuery demo, fluent.blue.light
pnpm run test-playwright --ignore-snapshots --grep DataGrid-   # demos of one component
THEME=material.blue.light pnpm run test-playwright --ignore-snapshots
CONSTEL="jquery(1/3)" CONCURRENCY=4 pnpm run test-playwright --ignore-snapshots   # one CI shard
```

Everything after the script name goes to `playwright test`, so `--headed`, `--ui` and `--repeat-each` work too.

A test fails on a console error or warning outside `testing/known-warnings.js` and on an uncaught error in the page.

The page is shot when it has settled: no request is pending, no script animation is running and no load panel is on screen. Charts, gauges and range selectors are drawn without their start-up animation: the tests switch it off through the default options of these widgets, so a demo that turns the animation on itself still animates.

The time zone is UTC for the page and for the mock data, whatever the machine is set to.

### Etalons

The etalons are Linux renders, and on CI the comparison is exact: no pixel may differ. Text is drawn differently on macOS and Windows, so a run on your machine compares loosely and proves little: pass `--ignore-snapshots` and never commit an etalon written there.

A container draws what the CI agent draws: it has the same Ubuntu, Chrome and fonts. It is the image of the component tests; see "Record etalons on a Mac" in `e2e/playwright/README.md` for the Docker setup. The container uses your `node_modules` and DevExtreme build:

```
utils/visual-tests/playwright/docker/run.sh --grep DataGrid-                       # compare as CI does
THEME=material.blue.light utils/visual-tests/playwright/docker/run.sh --grep DataGrid-
utils/visual-tests/playwright/docker/run.sh --update-snapshots --grep DataGrid-    # record etalons
```

On macOS the repository is mounted case-insensitively: a file that a demo requests in the wrong case loads in the container and is missing on CI.

Without a container CI records the etalon: delete the file and push. The job fails on the missing etalon and uploads what it rendered:

```
gh run download <run-id> -n playwright-etalons -D ci-etalons
cp -R ci-etalons/. ../..                 # from apps/demos: the paths start at the repository root
```

Look at the image before you commit it. One etalon serves all frameworks of a demo.

### Files next to a demo

| File | Purpose |
|---|---|
| `client-script.js` | runs in the page before the demo, for example to fix the current date with `MockDate` |
| `test-code.js` | runs in the page after it loads; a returned promise is awaited |
| `test-styles.css` | styles added for the test only |
| `playwright-test-code.js` | steps that need real input, as a function of the Playwright `page` |
| `visualtestrc.json` | `ignore` switches the demo off on CI, for all frameworks or for one |

### Read a failed CI run

```
gh run download <run-id> -n playwright-report -D ci-report
gh run download <run-id> -n playwright-traces -D ci-traces
pnpm exec playwright show-report ci-report
```

A failed comparison uploads its `-expected`, `-actual` and `-diff` images with the trace. On CI a failed test runs once more; a test that passes then is listed under "flaky" and does not fail the job.

## See Also

- [Technical demos online](https://js.devexpress.com/Demos/)
- [Examples on GitHub](https://github.com/DevExpress/DevExtreme-examples)
