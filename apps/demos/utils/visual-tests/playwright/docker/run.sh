#!/bin/bash
# Usage: utils/visual-tests/playwright/docker/run.sh [playwright args]
# Runs the screenshot tests in the image of the component tests (e2e/playwright/docker), which
# mirrors the CI agent. THEME and CONSTEL select the job, as in the workflow.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../../../../../.." && pwd)"
WORKFLOW="$REPO_ROOT/.github/workflows/visual-tests-demos.yml"

read_workflow_value() {
    grep -m1 "$1:" "$WORKFLOW" | cut -d: -f2 | tr -d " '\""
}

NODE_VERSION="$(cat "$REPO_ROOT/.node-version")"
CHROME_VERSION="$(read_workflow_value chrome-version)"

echo "Node $NODE_VERSION, Google Chrome $CHROME_VERSION"

docker build --platform linux/amd64 \
    --build-arg "NODE_VERSION=$NODE_VERSION" \
    --build-arg "CHROME_VERSION=$CHROME_VERSION" \
    -t devextreme-playwright-e2e "$REPO_ROOT/e2e/playwright/docker"

# CI installs Roboto on the agent for the Material jobs. The container takes the same file, checked
# the same way, and keeps it in the ignored artifacts folder between runs.
SETUP=true
if [[ "${THEME:-}" == material* ]]; then
    FONT="testing/artifacts/fonts/Roboto.ttf"
    FONT_URL="https://raw.githubusercontent.com/google/fonts/$(read_workflow_value GOOGLE_FONTS_COMMIT)/ofl/roboto/Roboto%5Bwdth%2Cwght%5D.ttf"
    SETUP="mkdir -p testing/artifacts/fonts /usr/local/share/fonts/roboto \
        && { [ -f $FONT ] || curl -fsSL '$FONT_URL' -o $FONT; } \
        && echo '$(read_workflow_value ROBOTO_SHA256)  $FONT' | sha256sum -c - \
        && cp $FONT /usr/local/share/fonts/roboto/ && fc-cache -f"
fi

# CI=true keeps the retry and the reporters of a CI job, but its worker count is sized for the
# agent. Half the cores unless the caller says otherwise.
WORKERS=--workers=50%
for arg in "$@"; do
    case "$arg" in
        --workers|--workers=*) WORKERS= ;;
    esac
done

# DX_CONTAINER says the render matches the agent, which is what the exact comparison keys on.
exec docker run --rm --platform linux/amd64 --shm-size=2gb --security-opt seccomp=unconfined \
    -e "THEME=${THEME:-}" -e "CONSTEL=${CONSTEL:-jquery}" -e DX_CONTAINER=1 -e CI=true \
    -v "$REPO_ROOT:/repo" -w /repo/apps/demos devextreme-playwright-e2e \
    bash -c "$SETUP && exec node_modules/.bin/playwright test \"\$@\"" playwright ${WORKERS:+"$WORKERS"} "$@"
