# Mirrors the environment the tests get on CI.
FROM ubuntu:24.04

ARG NODE_VERSION
ARG CHROME_VERSION

RUN echo 'APT::Install-Recommends "0";' > /etc/apt/apt.conf.d/dx-no-recommends \
    && apt-get update \
    && apt-get install -y ca-certificates curl fonts-noto-color-emoji \
    && curl -fsSL "https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_${CHROME_VERSION}-1_amd64.deb" -o /tmp/chrome.deb \
    && apt-get install -y /tmp/chrome.deb \
    && curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz" -o /tmp/node.tar.gz \
    && tar -xzf /tmp/node.tar.gz -C /usr/local --strip-components=1 \
    && rm /tmp/chrome.deb /tmp/node.tar.gz \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /repo/e2e/wrappers
