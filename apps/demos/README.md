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

Every demo page is compared with an etalon in `testing/etalons` (`testing/common.spec.ts`), and the widget tests in `testing/widgets` click through some demos and compare the steps with their own etalons. Both run on [Playwright](https://playwright.dev/) for jQuery, React, Vue and Angular; the accessibility checks still run on TestCafe.

One etalon serves all four frameworks of a demo, and it is recorded from the jQuery demo. A framework that draws a demo differently is not given an etalon of its own: find out why it differs and make the demo the same in every framework.

### Run locally

Build DevExtreme first with the testing configuration, as CI does: `pnpm nx build devextreme -c testing` from the monorepo root. The jQuery demos need nothing else. `pnpm run demos:prepare` builds DevExtreme without it: the license check then warns (W0021) and the page renders differently, so every test fails. Run the testing build after it. The tests use the system Google Chrome and start their own web server.

The React, Vue and Angular demos run from bundles. Build them after DevExtreme, as the `build-demos` CI job does:

```
cd apps/demos
node utils/server/build-vendor-bundles.js                 # React and Vue share a vendor bundle
node utils/server/demo-bundle.js --framework=React        # likewise Vue

# Angular takes devextreme from packages/devextreme/artifacts/transpiled-esm-npm when it exists, and
# that folder has the real license check: every Angular test then fails on W0021. CI has no such
# folder, so move it aside for the Angular build.
mv ../../packages/devextreme/artifacts/transpiled-esm-npm ../../packages/devextreme/artifacts/transpiled-esm-npm.aside
node utils/server/demo-bundle.js --framework=Angular
mv ../../packages/devextreme/artifacts/transpiled-esm-npm.aside ../../packages/devextreme/artifacts/transpiled-esm-npm
```

Build all Angular demos at once: `DEMO_BUNDLE_FILTER` rebuilds some of them, and the chunks they share with the rest change, so the other demos stop loading. The bundler also rewrites each demo's `index.html`; commit only the pages your change is about.

```
cd apps/demos
pnpm run test-playwright --ignore-snapshots                # every jQuery demo, fluent.blue.light
pnpm run test-playwright --ignore-snapshots --grep DataGrid-   # demos of one component and their widget tests
THEME=material.blue.light pnpm run test-playwright --ignore-snapshots
CONSTEL="jquery(1/3)" CONCURRENCY=4 pnpm run test-playwright --ignore-snapshots   # one CI shard
CONSTEL=react pnpm run test-playwright --ignore-snapshots    # React demos; likewise vue, angular
```

Everything after the script name goes to `playwright test`, so `--headed`, `--ui` and `--repeat-each` work too.

A demo page test fails on a console error or warning outside `testing/known-warnings.js`; both demo page and widget tests fail on an uncaught error in the page.

The page is shot when it has settled: no request is pending, no script animation is running and no load panel is on screen. Charts, gauges and range selectors are drawn without their start-up animation: the tests switch it off through the default options of these widgets, so a demo that turns the animation on itself still animates. React and Vue demos expose no `window.DevExpress`, so the tests take the widget classes from the shared vendor bundle; an Angular demo bundle hands them over itself.

`Math.random()` returns the same numbers in every framework: each call site has its own sequence, so a demo that generates its data gets the same data whatever the framework and DevExtreme called before it.

The time zone is UTC for the page and for the mock data, whatever the machine is set to.

### Widget tests

A widget test opens a demo in the framework of the job and drives it the way a user would:

```ts
import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('SelectBox', 'Grouping', { width: 900, height: 600 }, () => {
  test('Grouping', async ({ page }) => {
    await page.locator('.dx-selectbox').nth(0).click();

    await testScreenshot(page, 'selectbox_groupeditems_first_opened.png');
  });
});
```

`describeManualTest` opens the demo before each test, as the demo page test does, in a window of the given size. `testScreenshot` waits for the page to settle and compares the viewport, or the element it is given, with `<name> (<theme>).png` in the `etalons` folder next to the test. `utils/visual-tests/playwright/manual-test.ts` also has `drag` and `dragToElement` (the mouse, in steps), `mockDate` and `waitForSettled`.

Playwright acts as soon as the element is ready, where TestCafe was slow enough for a widget to finish what the previous action started: wait for the state the next step needs (an element, a text, `waitForSettled`), not for a time. Playwright also refuses to click an element that something else covers; TestCafe clicked the point and hit whatever was on top. Pass `force: true` only where a test relies on that, with a comment why.

Select the widget tests by their file path: `--grep widgets/` runs them all, `--grep widgets/datagrid/` those of a component. A `<Product>-<Demo>` name selects the demo page test and the widget tests of that demo together.

### Etalons

The etalons are Linux renders, and on CI the comparison is exact: no pixel may differ. Text is drawn differently on macOS and Windows, so a run on your machine compares loosely and proves little: pass `--ignore-snapshots` and never commit an etalon written there.

### Record etalons on a Mac

A container draws what the CI agent draws: it has the same Ubuntu, Chrome and fonts. It is the image of the component tests, so the Docker setup is the one in "Record etalons on a Mac" of `e2e/playwright/README.md`.

The container uses your `node_modules` and DevExtreme build, so build first and rebuild after a source change. Then record the etalons of a demo in the three themes the CI jobs run, and verify them:

```
pnpm nx build devextreme -c testing      # from the repository root

cd apps/demos
for theme in fluent.blue.light material.blue.light fluent-next.blue.light; do
  THEME=$theme utils/visual-tests/playwright/docker/run.sh --update-snapshots --grep DataGrid-Overview
done

for theme in fluent.blue.light material.blue.light fluent-next.blue.light; do
  THEME=$theme utils/visual-tests/playwright/docker/run.sh --grep DataGrid-Overview
done
```

`--grep` takes test names, `<Product>-<Demo>`, which also select the widget tests of that demo; without it every jQuery demo and widget test runs, about ten minutes per theme. Record etalons from the jQuery demos only; check a framework against them with `CONSTEL=react` (or `vue`, `angular`) and without `--update-snapshots`. The first run builds the image and takes a few minutes more. The second loop compares as CI does: exactly.

The repository is mounted case-insensitively on macOS: a file that a demo requests in the wrong case loads in the container and is missing on CI.

### Etalons from CI

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
