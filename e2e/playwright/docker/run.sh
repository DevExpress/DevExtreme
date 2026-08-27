#!/bin/bash
# Usage: docker/run.sh [--ui] [playwright args]
set -euo pipefail

UI_PORT=9323
UI=false

if [ "${1:-}" = "--ui" ]; then
    UI=true
    shift
fi

REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
NODE_VERSION="$(cat "$REPO_ROOT/.node-version")"
CHROME_VERSION="$(grep -m1 "chrome-version:" "$REPO_ROOT/.github/workflows/playwright_tests.yml" | cut -d: -f2 | tr -d " '\"")"

echo "Node $NODE_VERSION, Google Chrome $CHROME_VERSION"

docker build --platform linux/amd64 \
    --build-arg "NODE_VERSION=$NODE_VERSION" \
    --build-arg "CHROME_VERSION=$CHROME_VERSION" \
    -t devextreme-playwright-e2e "$REPO_ROOT/e2e/playwright/docker"

# THEME and TIMEZONE are what the matrix varies, so they are handed to the container as they are.
RUN=(docker run --rm --platform linux/amd64 --shm-size=2gb --security-opt seccomp=unconfined
    -e "THEME=${THEME:-}" -e "TIMEZONE=${TIMEZONE:-}"
    -v "$REPO_ROOT:/repo" -w /repo/e2e/playwright)

if [ "$UI" = true ]; then
    echo "UI mode: open http://localhost:$UI_PORT"
    exec "${RUN[@]}" -p "$UI_PORT:$UI_PORT" devextreme-playwright-e2e \
        node_modules/.bin/playwright test --ui-host=0.0.0.0 --ui-port="$UI_PORT" "$@"
fi

exec "${RUN[@]}" -e CI=true devextreme-playwright-e2e node_modules/.bin/playwright test "$@"
