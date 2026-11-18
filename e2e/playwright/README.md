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
pnpm run test --componentFolder common/pivotGrid         # one component folder
pnpm run test --theme material.blue.light                # another theme
pnpm run test --indices 1/4 --concurrency 5              # one shard, five workers
pnpm run test --test "PivotGrid markup"                  # one test by name
```

The runner takes the flags the TestCafe one takes (`--componentFolder`, `--indices`, `--theme`,
`--concurrency`, `--test`) and passes everything else straight to `playwright test`, so
`pnpm run test --headed --repeat-each 3` works too. `--test` matches the name as a whole word, not
as a regular expression. The static server for the test page starts on its own.

## Screenshots

`testScreenshot` shoots the whole viewport unless the call names an `element`, the way the TestCafe
comparer did. Etalons live in `etalons/` next to the test and carry the theme in the file name —
`PivotGrid markup (fluent.blue.light).png` — the same convention the TestCafe run uses.

The pixel budget follows the renderer: the agent and the container draw the same pixels and are
both judged strictly (`maxDiffPixels` 0, `threshold` 0.1), the UI mode included: no pixel may drift
beyond the per-pixel threshold, which is what the TestCafe comparer enforced. A run on the host is
lenient (0.05 / 0.2) because its comparison is not trustworthy anyway — see below.

Run the screenshot tests in the container and nowhere else. The etalons are Linux renders, and a
macOS or Windows one differs in text metrics — the image comes out a different size, which no
tolerance can absorb. The same goes for writing them:

```bash
docker/run.sh                       # verify
docker/run.sh --update-snapshots    # rewrite the etalons of the tests that ran
```

### Etalons of a migrated test

The etalons here are recorded anew, not copied from `e2e/testcafe-devextreme`: the two runners
crop and render differently, so a TestCafe image is not a valid reference for this suite.

It is still the check of the port. Recording writes whatever the test reached, and a verify run
compares against that same file, so neither notices a test that shot the wrong state. Before
deleting the TestCafe etalon, compare the new one with it: the same picture, within the per-pixel
threshold. Three differences are expected:

- A scrollbar. This suite shows it, TestCafe cut it off, so a viewport shot of a page that
  overflows comes out up to 15 px larger, with the scrollbar in the extra strip.
- Anything under a TestCafe mask (`<name>_mask.png` next to the etalon, black where ignored).
- Single antialiased pixels on the edges of shapes that sit on fractional coordinates. The TestCafe
  comparer ignored antialiasing (looks-same, `ignoreAntialiasing`, tolerance 5), so its etalon
  could drift there unnoticed; this suite compares them strictly.

Anything else, a block of pixels or a moved edge, means the test reached a different state; find
out why rather than accept the image.

**Masks.** `testScreenshot` takes no mask, and the usual reason for one is gone:
`toHaveScreenshot` stops CSS animations (an infinite one at its first frame) and hides the caret.
Port a masked test without its mask, then run it strictly in the container a few times in a row
(`--repeat-each 10`). If it is stable, delete the mask with the TestCafe etalon. If it is not, make
the state deterministic (stop the animation, fix the data or the clock) rather than hide it.

Migrating a test means, in one PR: port the test, record its etalon here, and delete the TestCafe
test together with its etalon. The two sets must never cover the same case at once — a stale pair
left behind gets updated by whoever touches the component next and starts asserting a render
nobody checks.

### Record etalons on a Mac

The image is `linux/amd64`, the platform of the CI agent. On Apple Silicon it runs through Rosetta;
under QEMU emulation Chrome is several times slower. [Colima](https://github.com/abiosoft/colima)
gives the `docker` CLI a free runtime that uses Rosetta:

```bash
softwareupdate --install-rosetta --agree-to-license
brew install colima docker docker-buildx
colima start --vm-type vz --vz-rosetta --cpu 4 --memory 8
docker run --rm --platform linux/amd64 ubuntu:24.04 uname -m   # prints x86_64
```

4 CPUs and 8 GB are enough for a component folder: `docker/run.sh` takes half the cores, so two
workers. Give the VM more for a larger run (`colima stop`, then `colima start --cpu 8 --memory 12`).
After a reboot, `colima start` brings it back with the same settings.

The container uses the host's `node_modules` and DevExtreme build, so build first and rebuild after
a source change. Then, from `e2e/playwright`, record and verify the etalons of the folder in both
themes the CI jobs run:

```bash
pnpm exec nx build devextreme-scss              # from the repository root
pnpm exec nx build devextreme -c testing

docker/run.sh --update-snapshots tests/editors/selectBox/
THEME=fluent-next.blue.light docker/run.sh --update-snapshots tests/editors/selectBox/

docker/run.sh tests/editors/selectBox/
THEME=fluent-next.blue.light docker/run.sh tests/editors/selectBox/
```

The first run builds the image and takes a few minutes. Look through the new files before
committing them, as with etalons from CI.

### Etalons from CI

Without a container, CI records the etalons. A test whose etalon does not exist fails, and
Playwright writes what it rendered in the etalon's place; the workflow collects those files at
their repository paths into the `playwright-etalons` artifact:

```bash
gh run download <run-id> -n playwright-etalons -D ci-etalons
cp -R ci-etalons/. ../..                 # from e2e/playwright: the paths start at the repository root
```

Look through them before committing — a new etalon is only as right as the render it captured. On
the host, run such tests with `--ignore-snapshots`: a host run writes missing etalons too, and a
macOS or Windows render must not end up among them.

## Themes

A test runs in the default theme unless it says otherwise. The jobs that run the whole suite in
another theme (`generic`, `material`, `material - compact`) take only the tests tagged with that
theme — the same opt-in the TestCafe `meta.themes` gives:

```ts
test('PivotGrid renders its areas', { tag: ['@generic.light'] }, async ({ page }) => {
```

Tag a test when its result does not depend on the theme, or when it has an etalon for that theme.

Every folder job also runs in `fluent-next.blue.light` (the `- fluent-next` jobs). These take the
whole folder like the default jobs do, so a screenshot test needs a `(fluent-next.blue.light)` etalon
next to its `(fluent.blue.light)` one.

A tag opts a test into a themed job; it does not change the theme of a run. To pin the theme of one
test or one file, set the fixture option — the same way the browser size is set:

```ts
test.use({ theme: 'material.blue.light' });          // this file runs in Material
test.use({ browserSize: [900, 600] });               // and in a 900x600 window

test.describe('narrow layout', () => {
  test.use({ browserSize: [400, 800] });             // only this block
});
```

The options default to `fluent.blue.light` and `1200x800`, and `--theme` sets the default of the
whole run. An etalon is named after the theme in effect, so a test that pins its own theme keeps
its own etalons.

## Run in the CI environment

The container takes Node from `.node-version` and Chrome from the version the workflow installs;
dependencies and the DevExtreme build come from the host.

```bash
docker/run.sh                       # the whole suite, as CI runs it
docker/run.sh --ui                  # then open http://localhost:9323
docker/run.sh --workers=3           # the concurrency of a particular job
```

The screenshot budget is the strict one, but the run takes half the cores rather than the eight a
CI agent gets: that many browsers starve each other on a developer machine, and a timing-sensitive
test then fails for a reason that does not exist on CI.

Open the UI on `localhost` — the address Playwright prints, `0.0.0.0`, is not a secure origin and
its trace viewer will not load there.

## Read a failed CI run

```bash
gh run download <run-id> -n playwright-report-common -D ci-report
gh run download <run-id> -n playwright-traces-common -D ci-traces
pnpm exec playwright show-report ci-report
pnpm exec playwright show-trace ci-traces/<test-name>/trace.zip --port 0
```

The trace holds every action with the DOM before and after it, the network and the console, and a
failed screenshot comparison uploads its `-expected`, `-actual` and `-diff` images alongside, so a
failure that only happens on CI can be diagnosed without reproducing it.

On CI a failed test runs once more, in a new browser. A test that passes then does not fail the
job: the log lists it under "flaky", and the traces artifact keeps its failed run. A test that
wrote a missing etalon is the exception: its retry passes against that file, so the job fails on
the new etalon instead.

## Writing a test

```ts
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import PivotGrid from '../../../models/pivotGrid';

test('PivotGrid renders', async ({ page }) => {
    await createWidget(page, 'dxPivotGrid', { dataSource: { store: [] } });

    const pivotGrid = new PivotGrid(page, '#container');

    await expect(pivotGrid.element).toBeVisible();
    await testScreenshot(page, 'PivotGrid markup.png', { element: '#container' });
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
| `t.typeText`                    | `locator.pressSequentially`                   |
| `t.pressKey('ctrl+a')`          | `page.keyboard.press('Control+a')`            |
| `t.expect(selector.value)`      | `expect(locator).toHaveValue`                 |
| `t.expect(widget.option('x'))`  | `expect.poll(() => widget.option('x'))`       |
| `.before(...)` of a test        | the first lines of the test                   |
| `meta({ browserSize })`         | `test.use({ browserSize })`                   |
| `meta({ runInTheme })`          | `test.use({ theme })`                         |
| `meta({ themes })`              | `{ tag: ['@generic.light'] }`                 |

## Porting a TestCafe test

Port a test one to one: the same steps, the same checks, the same screenshot names. A title changes
only when it repeats in the file, which Playwright rejects: add the loop parameters to it.

**`runInTheme`.** In TestCafe it was a filter, not a setting: the test ran only in the job whose
theme matched — usually one of the whole-suite theme jobs — and the folder jobs skipped it.
`test.use({ theme })` instead runs the test in that theme in every job that takes its folder, the
default and the `- fluent-next` one. That is the port: the result does not depend on the job, and a
screenshot keeps one etalon named after the pinned theme. Do not add a theme tag on top of it: the
test would run once more in the tagged job.

**Typing.** `fill` sets the value at once and sends no key events, so masked, numeric and date
editors do not react to it. Type with `pressSequentially`, and press keys under their Playwright
names: `Enter`, `Escape`, `ArrowLeft`, `Control+a`.

**Checks.** TestCafe retried `t.expect(selector.value)`; here only `expect(locator)` and
`expect.poll` retry. `expect(await locator.inputValue()).toBe(x)` reads the value once and fails
whenever the page is a moment late.

**Waiting.** A step waits for the state it needs, never for time. `helpers/`, `models/` and the
test folders migrated under this rule (see `eslint.config.mjs`) may not use `waitForTimeout`,
`setTimeout`, `force: true`, `toPass`, a `timeout` option or a call that raises a timeout
(`test.setTimeout`, `page.setDefaultTimeout`).

**Clicks.** A click is a real one: it lands on the topmost element at that point and fails when
that is not the target. TestCafe delivered a click to a covered element anyway, so a test that
relied on it needs the target made reachable, not the check switched off.

**Scrolling before a click.** TestCafe scrolled the whole target into view before a click;
Playwright scrolls only as far as the click point. When the target is wider or taller than the
window, the focus then scrolls the page after the click, and a drop-down closes on that scroll —
sometimes before the next step, sometimes after it. Scroll the target into view first, as TestCafe
did: `element.scrollIntoView({ block: 'nearest', inline: 'nearest' })` in `locator.evaluate`.

**Page errors.** A test fails on an uncaught error in the page, as it did in TestCafe. A test whose
TestCafe version ended with `expect(true).ok()` checks exactly that and needs no assertion.

**Old models.** A model in `packages/testcafe-models` that the ported tests used goes in the same
PR, but only after a search proves nothing else uses it: grep all of `e2e/` and `packages/` for its
import path, since other tests and other models import models too. A model still in use stays.
