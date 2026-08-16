#!/bin/bash
# Runs the wrappers e2e tests in a container that matches the CI environment: the OS, Node and
# Google Chrome are the ones the tests get on CI. The repository is mounted as is, so
# dependencies must be installed and the app under test built on the host first:
#
#   pnpm install --frozen-lockfile
#   pnpm nx all:build-testing workflows
#   cd e2e/wrappers && pnpm run build:react19
#
# Usage:
#   docker/run.sh [react19|vue3|angular] [extra playwright args]
#   docker/run.sh --ui [react19|vue3|angular]    open the UI mode at http://localhost:9323

set -euo pipefail

UI_PORT=9323
UI=false

if [ "${1:-}" = "--ui" ]; then
    UI=true
    shift
fi

FRAMEWORK="${1:-react19}"
shift || true

DOCKER_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$DOCKER_DIR/../../.." && pwd)"
WORKFLOW="$REPO_ROOT/.github/workflows/wrapper_tests_e2e.yml"

NODE_VERSION="$(cat "$REPO_ROOT/.node-version")"
CHROME_VERSION="$(grep -m1 'chrome-version:' "$WORKFLOW" | cut -d: -f2 | tr -d " '\"")"

if [ -z "$NODE_VERSION" ] || [ -z "$CHROME_VERSION" ]; then
    echo "❌ Cannot read the Node version from .node-version or the Chrome version from $WORKFLOW." >&2
    exit 1
fi

echo "Node $NODE_VERSION, Google Chrome $CHROME_VERSION"

# Google Chrome for Linux ships for amd64 only, so the platform is pinned as on CI.
PLATFORM=linux/amd64

docker build --platform "$PLATFORM" \
    --build-arg "NODE_VERSION=$NODE_VERSION" \
    --build-arg "CHROME_VERSION=$CHROME_VERSION" \
    -t devextreme-wrappers-e2e "$DOCKER_DIR"

# Shared memory and seccomp are set as the CI runner container gets them.
DOCKER_ARGS=(
    --rm
    --platform "$PLATFORM"
    --shm-size=2gb
    --security-opt seccomp=unconfined
    -v "$REPO_ROOT:/repo"
    -w /repo/e2e/wrappers
    -e "FRAMEWORK=$FRAMEWORK"
)
PLAYWRIGHT_ARGS=(test)

if [ "$UI" = true ]; then
    DOCKER_ARGS+=(-p "$UI_PORT:$UI_PORT")
    PLAYWRIGHT_ARGS+=(--ui-host=0.0.0.0 "--ui-port=$UI_PORT")
    echo "UI mode for $FRAMEWORK: open http://localhost:$UI_PORT"
else
    DOCKER_ARGS+=(-e CI=true)
    PLAYWRIGHT_ARGS+=("$@")
fi

docker run "${DOCKER_ARGS[@]}" devextreme-wrappers-e2e node_modules/.bin/playwright "${PLAYWRIGHT_ARGS[@]}"
