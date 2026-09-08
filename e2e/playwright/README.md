# Component E2E tests (Playwright)

End-to-end tests for DevExtreme components. They run on [Playwright](https://playwright.dev/) and
use the system Google Chrome (`channel: 'chrome'`), so no browser download is needed.

While the migration is in progress, `e2e/testcafe-devextreme` stays the source of truth: this
package holds the tests that are already migrated, and its workflow runs the same matrix so both
runs stay comparable.

## Run locally

```bash
pnpm install --frozen-lockfile
pnpm exec nx build devextreme-scss
pnpm exec nx build devextreme -c testing

cd e2e/playwright
pnpm run test                                            # everything, fluent.blue.light
pnpm run test --componentFolder navigation               # one component folder
pnpm run test --theme material.blue.light                # another theme
pnpm run test --indices 1/4 --concurrency 5              # one shard, five workers
pnpm run test --test "Buttons, stylingMode=text"         # one test by name
```

The runner takes the flags the TestCafe one takes (`--componentFolder`, `--indices`, `--theme`,
`--concurrency`, `--test`) and passes everything else straight to `playwright test`, so
`pnpm run test --headed --repeat-each 3` works too. `--test` matches the name as a whole word, not
as a regular expression. The static server for the test page starts on its own.

## Screenshots

`testScreenshot` shoots the whole viewport unless the call names an `element`, the way the TestCafe
comparer did. Etalons live in `etalons/` next to the test and carry the theme in the file name —
`Buttons, stylingMode=text (fluent.blue.light).png` — the same convention the TestCafe run uses.

The pixel budget is asymmetric on purpose: **CI is the source of truth** (`maxDiffPixelRatio`
0.001, `threshold` 0.1) and a local run is a sanity check (0.05 / 0.2).

Run the screenshot tests in the container and nowhere else. The etalons are Linux renders, and a
macOS or Windows one differs in text metrics — the image comes out a different size, which no
tolerance can absorb. The same goes for writing them:

```bash
docker/run.sh                       # verify
docker/run.sh --update-snapshots    # rewrite the etalons of the tests that ran
```

## Themes

A test runs in the default theme unless it says otherwise. The jobs that run the whole suite in
another theme (`generic`, `material`, `material - compact`) take only the tests tagged with that
theme — the same opt-in the TestCafe `meta.themes` gives:

```ts
test('CheckBox switches its state on click', { tag: ['@generic.light'] }, async ({ page }) => {
```

Tag a test when its result does not depend on the theme, or when it has an etalon for that theme.

## Run in the CI environment

The container takes Node from `.node-version` and Chrome from the version the workflow installs;
dependencies and the DevExtreme build come from the host.

```bash
docker/run.sh                       # the whole suite, as CI runs it
docker/run.sh --ui                  # then open http://localhost:9323
THEME=generic.light docker/run.sh --grep @generic.light    # what the "generic" job runs
docker/run.sh tests/common/pivotGrid/ --workers=3          # one folder at its job's concurrency
```

The container runs on half the cores unless `--workers` says otherwise. A developer machine is
smaller than a CI agent, and the timing-sensitive tests — drag-n-drop above all — fail under
contention for no reason of their own. Reproducing a specific job means passing the concurrency its
matrix entry declares.

Open the UI on `localhost` — the address Playwright prints, `0.0.0.0`, is not a secure origin and
its trace viewer will not load there.

## Read a failed CI run

```bash
gh run download <run-id> -n playwright-report-navigation -D ci-report
gh run download <run-id> -n playwright-traces-navigation -D ci-traces
pnpm exec playwright show-report ci-report
pnpm exec playwright show-trace ci-traces/<test-name>/trace.zip --port 0
```

The trace holds every action with the DOM before and after it, the network and the console, and a
failed screenshot comparison uploads its `-expected`, `-actual` and `-diff` images alongside, so a
failure that only happens on CI can be diagnosed without reproducing it.

## Writing a test

```ts
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import Button from '../../../models/button';

test('Button reports its text', async ({ page }) => {
    await createWidget(page, 'dxButton', { text: 'Find' });

    const button = new Button(page, '#container .dx-button');

    await expect(button.text).toHaveText('Find');
    await testScreenshot(page, 'Button with text.png', { element: '#container' });
});
```

`page` arrives ready: the container page is open, the theme requested by `--theme` is applied, the
viewport is 1200×800 and the widgets of the previous test are disposed.

| TestCafe                        | here                                          |
|---------------------------------|-----------------------------------------------|
| `Selector`                      | `Locator` (`models/`)                         |
| `ClientFunction`                | `page.evaluate` / `locator.evaluate`          |
| `devextreme-screenshot-comparer`| `testScreenshot` on top of `toHaveScreenshot` |
| `RequestMock`                   | `mockApi` on top of `page.route`              |
| `mockdate`                      | `mockDate` on top of `page.clock`             |
| machine timezone on the agent   | `TIMEZONE` → the browser context              |
