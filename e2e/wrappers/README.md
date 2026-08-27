# Wrappers E2E tests

End-to-end tests that check DevExtreme components inside the React, Vue and Angular wrappers.
They run on [Playwright](https://playwright.dev/) and use the system Google Chrome
(`channel: 'chrome'`), so no browser download is needed.

## Run locally

```bash
pnpm install --frozen-lockfile
pnpm nx all:build-testing workflows

cd e2e/wrappers
pnpm run build:react19    # or build:vue3 / build:angular / build:all
pnpm run test:react19     # or test:vue3 / test:angular
```

`playwright test` starts the server for the built application itself. The Chat and Gantt examples
exist for React only, so they are reported as skipped for the other frameworks.

## Run in the CI environment

The container takes Node from `.node-version` and Chrome from the version the workflow installs;
dependencies and application builds come from the host.

```bash
docker/run.sh react19
docker/run.sh --ui react19    # then open http://localhost:9323
```

Open the UI on `localhost` — the address Playwright prints, `0.0.0.0`, is not a secure origin and
its trace viewer will not load there.

## Read a failed CI run

```bash
gh run download <run-id> -n playwright-report-react19 -D ci-report
gh run download <run-id> -n playwright-traces-react19 -D ci-traces

pnpm exec playwright show-report ci-report
pnpm exec playwright show-trace ci-traces/<test-name>/trace.zip --port 0
```

The trace holds every action with the DOM before and after it, the network and the console, so a
failure that only happens on CI can be diagnosed without reproducing it.
