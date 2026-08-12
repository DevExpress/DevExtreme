#!/bin/bash
# Runs the wrappers e2e tests in a container that matches the CI environment.
# The repository is mounted as is, so dependencies must be installed and
# the app under test built on the host first:
#
#   pnpm install
#   pnpm nx all:build-testing workflows
#   cd e2e/wrappers && pnpm run build:react19
#
# Usage: docker/run.sh [react19|vue3|angular] [extra playwright args]

set -euo pipefail

FRAMEWORK="${1:-react19}"
shift || true

DOCKER_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$DOCKER_DIR/../../.." && pwd)"

# Google Chrome for Linux ships for amd64 only, so the platform is pinned as on CI.
PLATFORM=linux/amd64

docker build --platform "$PLATFORM" -t devextreme-wrappers-e2e "$DOCKER_DIR"

docker run --rm --ipc=host --platform "$PLATFORM" \
    -v "$REPO_ROOT:/repo" \
    -w /repo/e2e/wrappers \
    -e CI=true \
    -e "FRAMEWORK=$FRAMEWORK" \
    devextreme-wrappers-e2e \
    node_modules/.bin/playwright test "$@"
