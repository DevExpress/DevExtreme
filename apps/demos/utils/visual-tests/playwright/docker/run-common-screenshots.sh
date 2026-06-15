#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../../../../.." && pwd -P)"
CONTAINER_REPO_ROOT="/work/DevExtreme"
CONTAINER_SCRIPT="${CONTAINER_REPO_ROOT}/apps/demos/utils/visual-tests/playwright/docker/run-common-screenshots.sh"

log() {
  printf '[playwright-docker] %s\n' "$*"
}

is_truthy() {
  case "${1:-}" in
    1|true|TRUE|yes|YES|on|ON) return 0 ;;
    *) return 1 ;;
  esac
}

docker_platform_args() {
  if [ -n "${PLAYWRIGHT_DOCKER_PLATFORM:-}" ]; then
    printf '%s\n' --platform "${PLAYWRIGHT_DOCKER_PLATFORM}"
    return
  fi

  case "$(uname -m)" in
    arm64|aarch64) printf '%s\n' --platform linux/amd64 ;;
    *) ;;
  esac
}

ensure_base_image() {
  local base_image="$1"
  local upstream_context="${DEVEXTREME_SHR2_DOCKER_CONTEXT:-https://github.com/DevExpress/devextreme-shr2.git#main:docker-image-ubuntu-20.04}"
  local platform_arg
  local -a platform_args=()

  while IFS= read -r platform_arg; do
    platform_args+=("${platform_arg}")
  done < <(docker_platform_args)

  if docker image inspect "${base_image}" > /dev/null 2>&1; then
    return
  fi

  log "Base image '${base_image}' was not found locally."
  log "Building it from '${upstream_context}'."
  log "If that repository is private, build/pull '${base_image}' yourself or set DEVEXTREME_SHR2_IMAGE."

  docker build "${platform_args[@]}" -t "${base_image}" "${upstream_context}"
}

build_runner_image() {
  local base_image="${DEVEXTREME_SHR2_IMAGE:-devextreme-shr2:ubuntu-20.04}"
  local runner_image="${PLAYWRIGHT_DOCKER_IMAGE:-devextreme-playwright-common-screenshots:ubuntu-20.04}"
  local chrome_version="${PLAYWRIGHT_CHROME_VERSION:-145.0.7632.67}"
  local platform_arg
  local -a platform_args=()

  while IFS= read -r platform_arg; do
    platform_args+=("${platform_arg}")
  done < <(docker_platform_args)

  ensure_base_image "${base_image}"

  if docker image inspect "${runner_image}" > /dev/null 2>&1 \
    && ! is_truthy "${PLAYWRIGHT_DOCKER_REBUILD_IMAGE:-false}"; then
    log "Using existing runner image '${runner_image}'. Set PLAYWRIGHT_DOCKER_REBUILD_IMAGE=true to rebuild it."
    return
  fi

  log "Building runner image '${runner_image}' from '${base_image}'."
  docker build "${platform_args[@]}" \
    --build-arg "BASE_IMAGE=${base_image}" \
    --build-arg "CHROME_VERSION=${chrome_version}" \
    -t "${runner_image}" \
    -f "${SCRIPT_DIR}/Dockerfile" \
    "${SCRIPT_DIR}"
}

get_node_modules_targets() {
  printf '%s\n' node_modules

  find apps e2e packages \
    -mindepth 2 \
    -maxdepth 2 \
    -name package.json \
    -not -path 'packages/sbom/package.json' \
    -print \
    | sed 's#/package.json$#/node_modules#'
}

get_volume_prefix() {
  local repo_hash

  repo_hash="$(printf '%s' "${REPO_ROOT}" | cksum | awk '{ print $1 }')"
  printf '%s\n' "${PLAYWRIGHT_DOCKER_VOLUME_PREFIX:-devextreme-playwright-${repo_hash}}"
}

# Named volumes start root-owned, so a `--user $uid:$gid` container cannot
# write to them. Pre-chown each volume to the host UID/GID via a throwaway
# root container so subsequent pnpm/nx writes succeed.
prepare_volume_ownership() {
  local uid="$1"
  local gid="$2"
  shift 2
  local -a chown_mounts=("$@")
  local platform_arg
  local -a platform_args=()
  local -a mount_args=()
  local mount_arg
  local mount_path
  local -a chown_paths=()

  if [ "${#chown_mounts[@]}" -eq 0 ]; then
    return
  fi

  while IFS= read -r platform_arg; do
    platform_args+=("${platform_arg}")
  done < <(docker_platform_args)

  # chown_mounts is a flat list alternating "-v" "name:path". Extract paths.
  local idx
  for ((idx = 1; idx < ${#chown_mounts[@]}; idx += 2)); do
    mount_arg="${chown_mounts[$idx]}"
    mount_path="${mount_arg#*:}"
    chown_paths+=("${mount_path}")
    mount_args+=(-v "${mount_arg}")
  done

  log "Preparing named-volume ownership (uid=${uid} gid=${gid})."
  docker run --rm "${platform_args[@]}" \
    "${mount_args[@]}" \
    busybox:latest \
    chown -R "${uid}:${gid}" "${chown_paths[@]}" > /dev/null
}

run_host() {
  local runner_image="${PLAYWRIGHT_DOCKER_IMAGE:-devextreme-playwright-common-screenshots:ubuntu-20.04}"
  local uid
  local gid
  local cache_root
  local home_dir
  local volume_prefix
  local node_modules_target
  local platform_arg
  local volume_name
  local -a platform_args=()
  local -a env_args=()
  local -a tty_args=()
  local -a node_modules_volume_args=()

  uid="$(id -u)"
  gid="$(id -g)"
  cache_root="${PLAYWRIGHT_DOCKER_CACHE_ROOT:-${HOME}/.cache/devextreme-playwright-docker}"
  home_dir="${cache_root}/home"
  volume_prefix="$(get_volume_prefix)"

  mkdir -p "${home_dir}"
  while IFS= read -r platform_arg; do
    platform_args+=("${platform_arg}")
  done < <(docker_platform_args)

  if [ -t 0 ] && [ -t 1 ]; then
    tty_args=(-it)
  else
    tty_args=(-i)
  fi

  while IFS= read -r node_modules_target; do
    volume_name="${volume_prefix}-$(printf '%s' "${node_modules_target}" | tr '/.' '--')"
    node_modules_volume_args+=(-v "${volume_name}:${CONTAINER_REPO_ROOT}/${node_modules_target}")
  done < <(cd "${REPO_ROOT}" && get_node_modules_targets)

  # Dedicated named volume for pnpm's content-addressable store. Without this,
  # pnpm falls back to <workspace>/.pnpm-store inside the bind-mounted repo,
  # leaking a multi-GB store directory onto the host.
  node_modules_volume_args+=(-v "${volume_prefix}---pnpm-store:${CONTAINER_REPO_ROOT}/.pnpm-store")

  build_runner_image

  prepare_volume_ownership "${uid}" "${gid}" "${node_modules_volume_args[@]}"

  for name in \
    BROWSERS \
    CHANGEDFILEINFOSPATH \
    CI_ENV \
    CONCURRENCY \
    CONSTEL \
    DEBUG \
    DISABLE_DEMO_TEST_SETTINGS \
    NODE_OPTIONS \
    NX_SKIP_NX_CACHE \
    PLAYWRIGHT_DOCKER_BUILD \
    PLAYWRIGHT_DOCKER_INSTALL \
    PLAYWRIGHT_DOCKER_RESTORE_DEMOS \
    PLAYWRIGHT_GREP \
    PLAYWRIGHT_LEGACY_SCREENSHOT \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD \
    STRATEGY \
    TCQUARANTINE \
    THEME; do
    if [ -n "${!name+x}" ]; then
      env_args+=(-e "${name}=${!name}")
    fi
  done

  log "Running Playwright common tests in Docker."
  docker run --rm "${tty_args[@]}" --init \
    "${platform_args[@]}" \
    --shm-size="${PLAYWRIGHT_DOCKER_SHM_SIZE:-2g}" \
    --user "${uid}:${gid}" \
    -e "HOME=/home/devextreme" \
    -e "USER=devextreme" \
    -e "HOST_UID=${uid}" \
    -e "HOST_GID=${gid}" \
    "${env_args[@]}" \
    -v "${REPO_ROOT}:${CONTAINER_REPO_ROOT}" \
    -v "${home_dir}:/home/devextreme" \
    "${node_modules_volume_args[@]}" \
    -w "${CONTAINER_REPO_ROOT}" \
    "${runner_image}" \
    bash "${CONTAINER_SCRIPT}" __container "$@"
}

install_roboto_if_needed() {
  if [[ "${THEME}" != *material* ]]; then
    return
  fi

  local roboto_font_dir="${HOME}/.local/share/fonts/roboto"
  local roboto_file="${roboto_font_dir}/Roboto.ttf"
  local google_fonts_commit="8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5"
  local roboto_sha256="d7598e12c5dbef095ff8272cfc55da0250bd07fbdecbac8a530b9b277872a134"
  local base_url="https://raw.githubusercontent.com/google/fonts/${google_fonts_commit}/ofl/roboto"

  mkdir -p "${roboto_font_dir}"

  if [ ! -f "${roboto_file}" ]; then
    log "Installing pinned Roboto font for Material theme."
    curl -fsSL "${base_url}/Roboto%5Bwdth%2Cwght%5D.ttf" -o /tmp/Roboto.ttf
    echo "${roboto_sha256}  /tmp/Roboto.ttf" | sha256sum -c -
    mv /tmp/Roboto.ttf "${roboto_file}"
  fi

  fc-cache -f > /dev/null 2>&1
}

get_chrome_flags() {
  local flags

  flags="chrome:headless --window-size=1200,800 --disable-gpu --no-sandbox --disable-dev-shm-usage --disable-partial-raster --disable-skia-runtime-opts --run-all-compositor-stages-before-draw --disable-new-content-rendering-timeout --disable-threaded-animation --disable-threaded-scrolling --disable-checker-imaging --disable-image-animation-resync --use-gl=swiftshader --disable-features=PaintHolding --js-flags=--random-seed=2147483647"

  if [[ "${THEME}" != *material* ]]; then
    flags="${flags} --font-render-hinting=none --disable-font-subpixel-positioning"
  fi

  printf '%s\n' "${flags}"
}

snapshot_demo_indexes() {
  local snapshot_tar="$1"

  if ! is_truthy "${PLAYWRIGHT_DOCKER_RESTORE_DEMOS:-true}"; then
    return
  fi

  git ls-files -z -- \
    'apps/demos/Demos/**/jQuery/index.html' \
    'apps/demos/Demos/**/React/index.html' \
    'apps/demos/Demos/**/Vue/index.html' \
    'apps/demos/Demos/**/Angular/index.html' \
    | tar --null -T - -cf "${snapshot_tar}"
}

restore_demo_indexes() {
  local snapshot_tar="$1"
  local baseline_dirty="$2"
  local changed_file

  if ! is_truthy "${PLAYWRIGHT_DOCKER_RESTORE_DEMOS:-true}" || [ ! -f "${snapshot_tar}" ]; then
    return
  fi

  while IFS= read -r changed_file; do
    if grep -Fxq "${changed_file}" "${baseline_dirty}"; then
      log "Keeping pre-existing demo change: ${changed_file}"
      continue
    fi

    if tar -tf "${snapshot_tar}" "${changed_file}" > /dev/null 2>&1; then
      tar -xf "${snapshot_tar}" "${changed_file}"
      log "Restored generated demo theme change: ${changed_file}"
    fi
  done < <(git diff --name-only -- \
    'apps/demos/Demos/**/jQuery/index.html' \
    'apps/demos/Demos/**/React/index.html' \
    'apps/demos/Demos/**/Vue/index.html' \
    'apps/demos/Demos/**/Angular/index.html')
}

run_container() {
  local server_pid=""
  local test_status=0
  local tmp_dir
  local snapshot_tar
  local baseline_dirty
  local playwright_target
  local -a test_args=()

  cd "${CONTAINER_REPO_ROOT}"

  export CI=true
  export CI_ENV="${CI_ENV:-true}"
  export CONCURRENCY="${CONCURRENCY:-4}"
  export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=8192}"
  export NX_SKIP_NX_CACHE="${NX_SKIP_NX_CACHE:-true}"
  # Pin pnpm's content-addressable store to the dedicated named volume mounted
  # at <repo>/.pnpm-store. Without this, pnpm picks a HOME-relative default
  # that ends up on a different filesystem than the workspace and falls back
  # to writing the store under <repo>/.pnpm-store on the bind mount, leaking
  # multi-GB of cache onto the host.
  export NPM_CONFIG_STORE_DIR="${NPM_CONFIG_STORE_DIR:-${CONTAINER_REPO_ROOT}/.pnpm-store}"
  # Match the CI workflow: opt out of Playwright's CDPScreenshotNewSurface so
  # screenshots match TestCafe-generated etalons (esp. for Material text).
  export PLAYWRIGHT_LEGACY_SCREENSHOT="${PLAYWRIGHT_LEGACY_SCREENSHOT:-1}"
  export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD="${PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD:-1}"
  export STRATEGY="${STRATEGY:-screenshots}"
  export TCQUARANTINE="${TCQUARANTINE:-true}"
  export THEME="${THEME:-fluent.blue.light}"
  export BROWSERS="${BROWSERS:-$(get_chrome_flags)}"

  if [ "${STRATEGY}" = "accessibility" ]; then
    export CONSTEL="${CONSTEL:-jquery}"
    playwright_target="test-playwright-common-accessibility"
  elif [ "${STRATEGY}" = "widgets" ]; then
    export CONSTEL="${CONSTEL:-jquery(1/3)}"
    playwright_target="test-playwright-widgets-screenshots"
  else
    export CONSTEL="${CONSTEL:-jquery(1/3)}"
    playwright_target="test-playwright-common-screenshots"
  fi

  tmp_dir="$(mktemp -d)"
  snapshot_tar="${tmp_dir}/demo-indexes.tar"
  baseline_dirty="${tmp_dir}/dirty-demo-files.txt"

  cleanup() {
    local cleanup_status=$?

    if [ -n "${server_pid:-}" ] && kill -0 "${server_pid}" > /dev/null 2>&1; then
      kill "${server_pid}" > /dev/null 2>&1 || true
      wait "${server_pid}" > /dev/null 2>&1 || true
    fi

    cd "${CONTAINER_REPO_ROOT}" || true
    restore_demo_indexes "${snapshot_tar:-}" "${baseline_dirty:-}" || true
    rm -rf "${tmp_dir:-}"

    exit "${cleanup_status}"
  }
  trap cleanup EXIT

  git status --short -- \
    'apps/demos/Demos/**/jQuery/index.html' \
    'apps/demos/Demos/**/React/index.html' \
    'apps/demos/Demos/**/Vue/index.html' \
    'apps/demos/Demos/**/Angular/index.html' \
    | sed -E 's/^.. //' > "${baseline_dirty}" || true
  snapshot_demo_indexes "${snapshot_tar}" || true

  mise trust "${CONTAINER_REPO_ROOT}/.mise.toml" > /dev/null 2>&1 || true
  mise install

  log "Chrome: $(google-chrome-stable --version)"
  log "Node/pnpm: $(mise exec -- node --version) / $(mise exec -- pnpm --version)"
  log "STRATEGY=${STRATEGY}"
  log "CONSTEL=${CONSTEL}"
  log "THEME=${THEME}"

  if ! is_truthy "${PLAYWRIGHT_DOCKER_INSTALL:-true}"; then
    log "Skipping pnpm install because PLAYWRIGHT_DOCKER_INSTALL=false."
  else
    log "Installing dependencies."
    mise exec -- pnpm install --frozen-lockfile
  fi

  if [ "${PLAYWRIGHT_DOCKER_BUILD:-always}" = "skip" ]; then
    log "Skipping DevExtreme testing build because PLAYWRIGHT_DOCKER_BUILD=skip."
  else
    log "Building DevExtreme testing artifacts."
    mise exec -- pnpm exec nx build devextreme-scss
    mise exec -- pnpm exec nx build devextreme -c testing
  fi

  install_roboto_if_needed

  log "Starting repo-root web server on port 8080."
  mkdir -p apps/demos/testing/artifacts
  python3 -m http.server 8080 > apps/demos/testing/artifacts/playwright-docker-http-server.log 2>&1 &
  server_pid=$!
  sleep 1

  if [ -n "${PLAYWRIGHT_GREP:-}" ]; then
    test_args+=(--grep "${PLAYWRIGHT_GREP}")
  fi
  test_args+=("$@")

  log "Running Playwright ${STRATEGY}."
  cd "${CONTAINER_REPO_ROOT}/apps/demos"
  set +e
  if [ "${#test_args[@]}" -gt 0 ]; then
    mise exec -- pnpm exec nx "${playwright_target}" -- "${test_args[@]}"
    test_status=$?
  else
    mise exec -- pnpm exec nx "${playwright_target}"
    test_status=$?
  fi
  set -e

  if [ "${STRATEGY}" = "accessibility" ]; then
    log "Axe reports: apps/demos/testing/artifacts/axe-reports"
  else
    log "Screenshots: apps/demos/testing/screenshots"
    log "Compared artifacts: apps/demos/testing/artifacts/compared-screenshots"
  fi
  log "Playwright report: apps/demos/testing/artifacts/playwright-report"

  return "${test_status}"
}

if [ "${1:-}" = "__container" ]; then
  shift
  run_container "$@"
else
  run_host "$@"
fi
