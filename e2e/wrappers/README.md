# Wrappers E2E tests

End-to-end tests that check DevExtreme components inside the React, Vue and Angular wrappers.
The tests are written with [Playwright](https://playwright.dev/) and use the system Google Chrome
(`channel: 'chrome'`), so no browser download is needed.

## Layout

| Path                   | Purpose                                                              |
|------------------------|----------------------------------------------------------------------|
| `builders/*`           | Host applications that render the examples for each framework        |
| `examples/*`           | Examples under test, one folder per scenario and framework           |
| `tests/*.spec.ts`      | Playwright specs                                                     |
| `fixtures.ts`          | `test`/`expect` with the `framework` option added                    |
| `playwright.config.ts` | Per-framework port, base URL and dev server                          |
| `serve.js`             | Static server for a built application                                |
| `docker/`              | Container that matches the CI environment                            |

## Run locally

```bash
pnpm install --frozen-lockfile
pnpm nx all:build-testing workflows

cd e2e/wrappers
pnpm run build:react19    # or build:vue3 / build:angular / build:all

pnpm run test:react19     # or test:vue3 / test:angular
```

`playwright test` starts `serve.js` on its own, so no separate server is needed.
Useful flags: `--headed`, `--debug`, `--ui`, `--reporter=html`.

Examples that exist for a single framework only (Chat, Gantt) are skipped in the other frameworks.

## Run in the CI environment

The container mirrors the OS, Node and Google Chrome the tests get on CI. Dependencies and
application builds are taken from the host:

```bash
cd e2e/wrappers
docker/run.sh react19
```

The browser runs in the container while you watch and re-run the tests from the browser on your
machine — start the UI mode and open `http://localhost:9323`:

```bash
docker/run.sh --ui react19
```

The repository is mounted, so edits made on the host are picked up and the watch mode re-runs
the affected tests. Plain `playwright test --ui` is not used on purpose: it opens the interface
in the bundled Chromium, which is deliberately not installed.

## Investigate a failed CI run

The `Wrappers E2E Tests` workflow uploads two artifacts per framework when tests fail: the HTML
report and the traces. Download them and open with the tools Playwright ships:

```bash
gh run download <run-id> -n playwright-report-react19 -D ci-report
gh run download <run-id> -n playwright-traces-react19 -D ci-traces

pnpm exec playwright show-report ci-report
pnpm exec playwright show-trace ci-traces/<test-name>/trace.zip --port 0
```

The trace is a step-by-step timeline: the DOM before and after every action, network, console
output and the error, so a failure that only happens on CI can be inspected without reproducing
it. To reproduce it anyway, run the same test in the container — the environment matches.

## Rendering

The default Chrome scrollbars must stay visible: they take layout space, so a page rendered
without them differs from what a user sees and from the etalons the TestCafe tests produce.
Playwright hides scrollbars in headless mode by default, so `--hide-scrollbars` is removed in
`playwright.config.ts`. Measured in the CI-like container, the scrollbar is 15px wide both here
and in TestCafe.
