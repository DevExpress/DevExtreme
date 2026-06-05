# Local Docker Common Screenshots

This runner is for local Playwright common screenshot checks in an environment close to the `devextreme-shr2` GitHub runner.

Run it from the repository root:

```bash
CONSTEL='jquery(1/3)' THEME='fluent.blue.light' PLAYWRIGHT_GREP='Accordion-Overview' \
  mise exec -- pnpm --dir apps/demos run test-playwright-common-screenshots:docker
```

The script builds a local runner image on top of `devextreme-shr2:ubuntu-20.04`, installs the CI-pinned Chrome version, runs `mise`, installs dependencies into Docker volumes, builds internal/testing DevExtreme artifacts, starts a repo-root web server, and runs the Nx Playwright target.

If the base `devextreme-shr2` image is not available locally, the script tries to build it from:

```text
https://github.com/DevExpress/devextreme-shr2.git#main:docker-image-ubuntu-20.04
```

If that repository is not reachable from Docker, build or pull the base image yourself and set:

```bash
DEVEXTREME_SHR2_IMAGE='your-devextreme-shr2-image:tag'
```

Useful variables:

- `CONSTEL`: defaults to `jquery(1/3)`.
- `THEME`: defaults to `fluent.blue.light`.
- `PLAYWRIGHT_GREP`: passes `--grep` to Playwright through Nx.
- `PLAYWRIGHT_DOCKER_BUILD=skip`: skips the DevExtreme testing build when artifacts are already prepared.
- `PLAYWRIGHT_DOCKER_INSTALL=false`: skips `pnpm install`.
- `PLAYWRIGHT_DOCKER_REBUILD_IMAGE=true`: rebuilds the local runner image.
- `PLAYWRIGHT_DOCKER_PLATFORM=linux/amd64`: overrides Docker platform. On Apple Silicon, `linux/amd64` is used by default for Chrome.

Outputs stay in the normal demo test folders:

```text
apps/demos/testing/screenshots
apps/demos/testing/artifacts/compared-screenshots
apps/demos/testing/artifacts/playwright-report
```

The runner mounts Docker named volumes over workspace `node_modules` folders so Linux dependencies do not overwrite local host dependencies.
