ARG BASE_IMAGE=devextreme-shr2:ubuntu-20.04

FROM ${BASE_IMAGE}

ARG CHROME_VERSION=145.0.7632.67

USER root

ENV DEBIAN_FRONTEND=noninteractive
ENV PATH="/usr/local/bin:${PATH}"

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    fontconfig \
    git \
    gnupg \
    p7zip-full \
    python3 \
    unzip \
    xz-utils \
  && rm -rf /var/lib/apt/lists/*

RUN if ! command -v mise > /dev/null 2>&1; then \
    curl -fsSL https://mise.run | sh; \
    install -m 0755 /root/.local/bin/mise /usr/local/bin/mise; \
  fi

RUN set -eux; \
  current_chrome_version="$(google-chrome-stable --product-version 2>/dev/null || true)"; \
  if [ "${current_chrome_version}" != "${CHROME_VERSION}" ]; then \
    apt-get update; \
    apt-get install -y --no-install-recommends libu2f-udev; \
    curl -fsSL \
      "https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_${CHROME_VERSION}-1_amd64.deb" \
      -o /tmp/chrome.deb; \
    apt-get install -y /tmp/chrome.deb; \
    rm -f /tmp/chrome.deb; \
    rm -rf /var/lib/apt/lists/*; \
  fi; \
  google-chrome-stable --version

WORKDIR /work/DevExtreme
