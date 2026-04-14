#!/bin/bash -e

# QUnit Test Runner Script
# 
# Despite the "docker" in the filename, this script runs in multiple modes:
#
# 1. GITHUBACTION=true (GitHub Actions)
#    - Runs NATIVELY on GitHub runner (NO Docker container!)
#    - Uses pre-installed Chrome and Node.js
#    - Dependencies already installed by workflow
#    - Fastest and most stable mode
#
# 2. LOCAL=true (Local development with Docker)
#    - Runs inside Docker container
#    - Uses host.docker.internal for networking
#
# 3. Default (Legacy CI with Docker)
#    - Runs inside Docker container
#    - Installs dependencies inside container
#
# Current GitHub Actions workflow runs in mode #1 (native, no Docker)

trap "echo 'Interrupted!' && kill -9 0" TERM INT

export DEVEXTREME_TEST_CI=true

function run_test {
    local i
    local status

    for i in {1..3}; do
        set +e
        (set -e; run_test_impl); status=$?
        set -e
        [ $status == 0 ] && exit 0
    done

    exit 1
}

function run_test_impl {
    local port=`node -e "console.log(require('./ports.json').qunit)"`
    local url="http://0.0.0.0:$port/run?notimers=true"
    local runner_pid
    local runner_result=0

    echo "========================================="
    if [ "$GITHUBACTION" == "true" ]; then
        echo "MODE: GitHub Actions (native, no Docker)"
    elif [ "$LOCAL" == "true" ]; then
        echo "MODE: Local Docker"
    else
        echo "MODE: CI Docker"
    fi
    echo "========================================="

    [ -z "$CHROME_CMD" ] && CHROME_CMD=google-chrome-stable
    [ "$LOCAL" == "true" ] && url="http://host.docker.internal:$port/run?notimers=true"
    [ -n "$CONSTEL" ] && url="$url&constellation=$CONSTEL"
    [ "$JQUERY" == "false"  ] && url="$url&nojquery=true"
    [ "$SHADOW_DOM" == "true" ] && url="$url&shadowDom=true"
    [ "$NO_CSP" == "true" ] && url="$url&nocsp=true"

    if [ -n "$TZ" ]; then
        sudo ln -sf "/usr/share/zoneinfo/$TZ" /etc/localtime
        sudo dpkg-reconfigure --frontend noninteractive tzdata
    fi

    if [ "$NO_HEADLESS" == "true" ]; then
        Xvfb -ac :99 -screen 0 1200x600x24 > /dev/null 2>&1 &
        if [ "$GITHUBACTION" != "true" ]; then
            x11vnc -display :99 2>/dev/null &
        fi
    fi

    if [ "$LOCAL" != "true" ]; then
        if [ "$GITHUBACTION" != "true" ]; then
        pnpm i
        pnpm run build
        fi

        echo "Compiling TypeScript test runner..."
        pnpm exec tsc -p ./testing/runner/tsconfig.json

        echo "Starting Node.js test runner..."
        node ./testing/runner/dist/index.js --single-run & runner_pid=$!
        echo "Runner PID: $runner_pid"

        local max_attempts=30
        [ "$GITHUBACTION" == "true" ] && max_attempts=45
        
        for i in $(seq $max_attempts -1 0); do
            if [ -n "$runner_pid" ] && ! kill -0 $runner_pid 2>/dev/null; then
                echo "❌ Runner exited unexpectedly"
                return 1
            fi

            if curl --head --silent --fail $url 2> /dev/null; then
                echo "✅ Runner reached at $url"
                break
            else
                echo "⏳ Waiting for runner... (${i}s remaining)"
            fi

            if [ $i -eq 0 ]; then
                echo "❌ Runner not reached after ${max_attempts} seconds"
                return 1
            fi

            sleep 1
        done
    fi

    echo "URL: $url"

    local chrome_command=$CHROME_CMD
    local chrome_args=(
        --no-sandbox
        --headless
        --disable-gpu
        --disable-partial-raster
        --disable-skia-runtime-opts
        --no-first-run
        --run-all-compositor-stages-before-draw
        --disable-new-content-rendering-timeout
        --disable-background-timer-throttling
        --disable-renderer-backgrounding
        --disable-threaded-animation
        --disable-threaded-scrolling
        --disable-checker-imaging
        --disable-image-animation-resync
        --use-gl="swiftshader"
        --disable-features=PaintHolding
        --disable-features=ScriptStreaming
        --disable-features=LazyFrameLoading
        --font-render-hinting=none
        --disable-font-subpixel-positioning
        --disable-extensions
    )

    if [ "$GITHUBACTION" == "true" ]; then
        chrome_args+=(
            --disable-dev-shm-usage
            --disable-software-rasterizer
            --js-flags="--max-old-space-size=4096"
            --disable-background-networking
            --disable-sync
            --metrics-recording-only
            --disable-default-apps
        )
    fi

    if [ "$NO_HEADLESS" == "true" ]; then
        chrome_command="dbus-launch --exit-with-session $chrome_command"
        chrome_args+=(
            --no-first-run
            --no-default-browser-check
            --disable-translate
        )
    fi

    if [ "$GITHUBACTION" == "true" ]; then
        echo "$chrome_command"
        printf '  %s\n' "${chrome_args[@]}"
    else
        tput setaf 6
        echo "$chrome_command"
        printf '  %s\n' "${chrome_args[@]}"
        tput setaf 9
    fi
    eval "$chrome_command --version"
    eval "$chrome_command ${chrome_args[@]} '$url'" &>chrome.log &
    local chrome_pid=$!
    echo "Chrome PID: $chrome_pid"

    start_runner_watchdog $runner_pid $chrome_pid
    wait $runner_pid || runner_result=1
    return $runner_result
}

function start_runner_watchdog {
    local runner_pid=$1
    local chrome_pid=$2
    local last_suite_time_file="$PWD/testing/LastSuiteTime.txt"
    local raw_log_file="$PWD/testing/RawLog.txt"
    local chrome_log_file="$PWD/chrome.log"
    local last_suite_time=""
    local stall_count=0
    local check_count=0

    echo "Watchdog started: monitoring runner PID $runner_pid, chrome PID $chrome_pid, checking every 180s, max 6 failures = 18min timeout"

    (
        while true; do
            sleep 180
            check_count=$((check_count + 1))

            if [ -n "$runner_pid" ] && ! kill -0 $runner_pid 2>/dev/null; then
                echo "Watchdog: Runner process $runner_pid no longer exists, exiting watchdog"
                exit 0
            fi

            if [ ! -f $last_suite_time_file ]; then
                echo "Watchdog [check #$check_count]: LastSuiteTime.txt does not exist yet (waiting for first test...)"
                if [ $check_count -gt 2 ]; then
                    stall_count=$((stall_count + 1))
                    echo "Watchdog WARNING: No LastSuiteTime.txt after $((check_count * 3)) minutes"
                fi
            else
                local current_time=$(cat $last_suite_time_file)
                
                if [ -z "$last_suite_time" ]; then
                    last_suite_time=$current_time
                    stall_count=0
                elif [ "$current_time" == "$last_suite_time" ]; then
                    stall_count=$((stall_count + 1))
                    echo "Watchdog [check #$check_count]: STALL DETECTED (attempt $stall_count/6) - LastSuiteTime unchanged: $last_suite_time"
                    
                    if [ $stall_count -ge 6 ]; then
                        echo "========================================="
                        echo "WATCHDOG TIMEOUT: Runner stalled for 18 minutes (6 checks × 3 min)"
                        echo "Last suite time: $last_suite_time"
                        echo "========================================="
                        echo "===== Last 100 lines of RawLog.txt ====="
                        tail -n 100 $raw_log_file 2>/dev/null || echo "(RawLog.txt not found)"
                        echo ""
                        echo "===== MiscErrors.log (JavaScript logs) ====="
                        if [ -f "$PWD/testing/MiscErrors.log" ]; then
                            tail -n 200 "$PWD/testing/MiscErrors.log"
                        else
                            echo "(MiscErrors.log not found)"
                        fi
                        echo ""
                        echo "===== Last 50 lines of chrome.log ====="
                        tail -n 50 $chrome_log_file 2>/dev/null || echo "(chrome.log not found)"
                        echo ""
                        echo "Killing chrome process $chrome_pid..."
                        kill -9 $chrome_pid 2>/dev/null
                        echo "Killing runner process $runner_pid..."
                        kill -9 $runner_pid 2>/dev/null
                        exit 1
                    fi
                else
                    echo "Watchdog [check #$check_count]: Progress detected - LastSuiteTime: $last_suite_time → $current_time"
                    last_suite_time=$current_time
                    stall_count=0
                fi
            fi
        done
    ) &
    
    local watchdog_pid=$!
    echo "Watchdog running in background (PID: $watchdog_pid)"
}

echo "node $(node -v), pnpm $(pnpm -v)"

TARGET_FUNC="run_$TARGET"

if [ $(type -t $TARGET_FUNC) != "function" ]; then
    echo "Unknown target"
    exit 1
fi

$TARGET_FUNC
