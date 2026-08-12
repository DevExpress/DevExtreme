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

The container pins Node and Google Chrome to the versions used by the `Wrappers E2E Tests`
workflow. Dependencies and application builds are taken from the host:

```bash
cd e2e/wrappers
docker/run.sh react19
```
