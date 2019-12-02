#!/bin/bash -e

# Run inside https://hub.docker.com/r/devexpress/devextreme-build/

trap "echo 'Interrupted!' && kill -9 0" TERM INT

export DEVEXTREME_DOCKER_CI=true
export NUGET_PACKAGES=$PWD/dotnet_packages

function run_lint {
    npm i eslint eslint-plugin-spellcheck stylelint stylelint-config-standard npm-run-all
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

    npx gulp ts-compilation-check ts-jquery-check npm-ts-modules-check
}

function run_test {
    export DEVEXTREME_QUNIT_CI=true

    local port=`node -e "console.log(require('./ports.json').qunit)"`
    local url="http://localhost:$port/run?notimers=true"
    local runner_pid
    local runner_result=0

    [ -n "$CONSTEL" ] && url="$url&constellation=$CONSTEL"
    [ -z "$JQUERY"  ] && url="$url&nojquery=true"

    if [ "$HEADLESS" != "true" ]; then
        Xvfb :99 -ac -screen 0 1200x600x24 &
        x11vnc -display :99 2>/dev/null &
    fi

    npm i
    npm run build

    dotnet ./testing/runner/bin/runner.dll --single-run & runner_pid=$!

    while ! httping -qc1 $url; do
        sleep 1
    done

    echo "URL: $url"

    case "$BROWSER" in

        "firefox")
            local firefox_args="-profile /firefox-profile $url"
            [ "$HEADLESS" == "true" ] && firefox_args="-headless $firefox_args"

            firefox --version
            firefox $firefox_args &
        ;;

        *)
            local chrome_command="google-chrome-stable \
                --no-sandbox \
                --disable-dev-shm-usage \
                --disable-gpu \
                --user-data-dir=/tmp/chrome";

            if [ "$HEADLESS" == "true" ]; then
                echo "Headless mode"
                chrome_command="$chrome_command \
                    --headless \
                    --remote-debugging-address=0.0.0.0 \
                    --remote-debugging-port=9222";
            else
                chrome_command="dbus-launch --exit-with-session $chrome_command \
                    --no-first-run \
                    --no-default-browser-check \
                    --disable-translate";
            fi

            if [ -n "$MOBILE_UA" ]; then
                local user_agent

                if [ "$MOBILE_UA" == "ios9" ]; then
                    user_agent="Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
                else
                    exit 1
                fi

                echo "User agent: $user_agent"

                chrome_command="$chrome_command \
                    --user-agent=\"$user_agent\" \
                    --enable-viewport \
                    --touch-events \
                    --enable-overlay-scrollbar \
                    --enable-features=OverlayScrollbar"
            fi

            google-chrome-stable --version

            echo "Chrome cmd: $chrome_command"

            $chrome_command $url &>chrome.log &

            # if [ "$HEADLESS" == "true" ]; then
            #   google-chrome-stable \
            #     --no-sandbox \
            #     --disable-dev-shm-usage \
            #     --disable-gpu \
            #     --user-data-dir=/tmp/chrome \
            #     --headless \
            #     --remote-debugging-address=0.0.0.0 \
            #     --remote-debugging-port=9222 \
            #     $url &>headless-chrome.log &
            # elif [ "$IOS" == "true" ]; then
            #     dbus-launch --exit-with-session google-chrome-stable \
            #         --no-sandbox \
            #         --disable-dev-shm-usage \
            #         --disable-gpu \
            #         --user-data-dir=/tmp/chrome \
            #         --no-first-run \
            #         --no-default-browser-check \
            #         --disable-translate \
            #         --user-agent="$ios_user_agent" \
            #         --enable-viewport \
            #         --touch-events \
            #         --enable-overlay-scrollbar \
            #         --enable-features=OverlayScrollbar \
            #         $url &
            # else
            #     dbus-launch --exit-with-session google-chrome-stable \
            #         --no-sandbox \
            #         --disable-dev-shm-usage \
            #         --disable-gpu \
            #         --user-data-dir=/tmp/chrome \
            #         --no-first-run \
            #         --no-default-browser-check \
            #         --disable-translate \
            #         $url &
            # fi
        ;;

    esac

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
    npm i
    npm run build

    local args="--browsers chrome:headless";
    [ "$COMPONENT" ] && args="$args --componentFolder $COMPONENT";

    npm run test-functional -- $args
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
