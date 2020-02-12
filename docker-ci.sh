#!/bin/bash -e

# Run inside https://hub.docker.com/r/devexpress/devextreme-build/

trap "echo 'Interrupted!' && kill -9 0" TERM INT

export DEVEXTREME_DOCKER_CI=true
export NUGET_PACKAGES=$PWD/dotnet_packages
export DOTNET_USE_POLLING_FILE_WATCHER=true

function run_lint {
    npm i eslint eslint-plugin-spellcheck eslint-plugin-qunit stylelint stylelint-config-standard npm-run-all babel-eslint
    npm run lint
}

function run_ts {
    target=./ts/dx.all.d.ts
    cp $target $target.current

    npm i
    npm update devextreme-internal-tools
    npm ls devextreme-internal-tools

    npm run update-ts

    if ! diff $target.current $target -U 5 > $target.diff; then
        echo "FAIL: $target is outdated:"
        cat $target.diff | sed "1,2d"
        exit 1
    else
        echo "TS is up-to-date"
    fi

    npx gulp ts-compilation-check ts-jquery-check ts-modules-check
}

function run_test {
    export DEVEXTREME_TEST_CI=true

    local port=`node -e "console.log(require('./ports.json').qunit)"`
    local url="http://localhost:$port/run?notimers=true"
    local runner_pid
    local runner_result=0

    [ -n "$CONSTEL" ] && url="$url&constellation=$CONSTEL"
    [ -n "$MOBILE_UA" ] && url="$url&deviceMode=true"
    [ -z "$JQUERY"  ] && url="$url&nojquery=true"
    [ -n "$PERF" ] && url="$url&include=DevExpress.performance&workerInWindow=true"

    if [ -n "$TZ" ]; then
        ln -sf "/usr/share/zoneinfo/$TZ" /etc/localtime
        dpkg-reconfigure --frontend noninteractive tzdata
    fi

    if [ "$NO_HEADLESS" == "true" ]; then
        Xvfb :99 -ac -screen 0 1200x600x24 &
        x11vnc -display :99 2>/dev/null &
    fi

    npm i
    npm run build

    dotnet ./testing/runner/bin/runner.dll --single-run & runner_pid=$!

    for i in {15..0}; do
        if [ -n "$runner_pid" ] && [ ! -e "/proc/$runner_pid" ]; then
            echo "Runner exited unexpectedly"
            exit 1
        fi

        httping -qsc1 "$url" && break

        if [ $i -eq 0 ]; then
            echo "Runner not reached"
            exit 1
        fi

        sleep 1
        echo "Waiting for runner..."
    done

    echo "URL: $url"

    case "$BROWSER" in

        "firefox")
            local firefox_args="-profile /firefox-profile $url"
            [ "$NO_HEADLESS" != "true" ] && firefox_args="-headless $firefox_args"

            firefox --version
            firefox $firefox_args &
        ;;

        *)
            local chrome_command=google-chrome-stable
            local chrome_args=(
                --no-sandbox
                --disable-dev-shm-usage
                --disable-gpu
                --disable-extensions
                --user-data-dir=/tmp/chrome
            )

            if [ "$NO_HEADLESS" != "true" ]; then
                echo "Headless mode"
                chrome_args+=(
                    --headless
                    --remote-debugging-address=0.0.0.0
                    --remote-debugging-port=9222
                )
            else
                chrome_command="dbus-launch --exit-with-session $chrome_command"
                chrome_args+=(
                    --no-first-run
                    --no-default-browser-check
                    --disable-translate
                )
            fi

            if [ "$PERF" == "true" ]; then
                echo "Performance tests"
                chrome_args+=(
                    --disable-popup-blocking
                    --remote-debugging-port=9223
                    --enable-impl-side-painting
                    --enable-skia-benchmarking
                    --disable-web-security
                )
            fi

            if [ -n "$MOBILE_UA" ]; then
                local user_agent

                if [ "$MOBILE_UA" == "ios9" ]; then
                    user_agent="Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
                else
                    exit 1
                fi

                echo "Mobile user agent: $MOBILE_UA"

                chrome_args+=(
                    --user-agent="'$user_agent'"
                    --enable-viewport
                    --touch-events
                    --enable-overlay-scrollbar
                    --enable-features=OverlayScrollbar
                )
            fi

            tput setaf 6
            echo "$chrome_command"
            printf '  %s\n' "${chrome_args[@]}"
            tput setaf 9

            google-chrome-stable --version
            eval "$chrome_command ${chrome_args[@]} '$url'" &>chrome.log &
        ;;

    esac

    start_runner_watchdog $runner_pid
    wait $runner_pid || runner_result=1
    exit $runner_result
}

function run_test_themebuilder {
    dotnet build build/build-dotnet.sln
    npm i
    npm run build-themes
    npm run build-themebuilder-assets
    cd themebuilder
    npm i
    npm run test
}

function run_test_functional {
    export DEVEXTREME_TEST_CI=true

    npm i
    npm run build

    local args="--browsers=chrome:headless";
    [ -n "$COMPONENT" ] && args="$args --componentFolder=$COMPONENT";
    [ -n "$QUARANTINE_MODE" ] && args="$args --quarantineMode=true";

    npm run test-functional -- $args
}

function start_runner_watchdog {
    local last_suite_time_file="$PWD/testing/LastSuiteTime.txt"
    local last_suite_time=unknown

    while true; do
        sleep 300

        if [ ! -f $last_suite_time_file ] || [ $(cat $last_suite_time_file) == $last_suite_time ]; then
            echo "Runner stalled"
            kill -9 $1
        else
            last_suite_time=$(cat $last_suite_time_file)
        fi
    done &
}

echo "node $(node -v), npm $(npm -v), dotnet $(dotnet --version)"

case "$TARGET" in
    "lint") run_lint ;;
    "ts") run_ts ;;
    "test") run_test ;;
    "test_themebuilder") run_test_themebuilder ;;
    "test_functional") run_test_functional ;;

    *)
        echo "Unknown target"
        exit 1
    ;;
esac
