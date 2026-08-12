# Reproduces the "Wrappers E2E Tests" CI environment: Node from .node-version
# and Google Chrome pinned to the version used by .github/actions/setup-chrome.
FROM node:24.16.0-bookworm-slim

ARG CHROME_VERSION=150.0.7871.181

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl \
    && curl -fsSL "https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_${CHROME_VERSION}-1_amd64.deb" -o /tmp/chrome.deb \
    && apt-get install -y --no-install-recommends /tmp/chrome.deb \
    && rm /tmp/chrome.deb \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /repo/e2e/wrappers
