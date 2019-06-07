#!/bin/bash -e

# Run inside https://hub.docker.com/r/devexpress/devextreme-build/

trap "echo 'Interrupted!' && kill -9 0" TERM INT

export DEVEXTREME_DOCKER_CI=true
export NUGET_PACKAGES=$PWD/dotnet_packages

function run_lint {
    npm i eslint eslint-plugin-spellcheck
    npm run lint
}

function run_ts {
    target=./ts/dx.all.d.ts
    cp $target $target.current

    npm i
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
    local url="http://localhost:$port/run?notimers=true&nojquery=true"
    local runner_pid
    local runner_result=0

    [ -n "$CONSTEL" ] && url="$url&constellation=$CONSTEL"

    if [ "$HEADLESS" != "true" ]; then
        Xvfb :99 -ac -screen 0 1200x600x24 &
        x11vnc -display :99 2>/dev/null &
    fi

    npm i
    npm run build

    # See https://github.com/DevExpress/DevExtreme/pull/1251
    chmod 755 $(find dotnet_packages -type d)

    dotnet ./testing/runner/bin/runner.dll --single-run & runner_pid=$!

    while ! httping -qc1 $url; do
        sleep 1
    done

    case "$BROWSER" in

        "firefox")
            local firefox_args="-profile /firefox-profile $url"
            [ "$HEADLESS" == "true" ] && firefox_args="-headless $firefox_args"

            firefox --version
            firefox $firefox_args &
        ;;

        *)
            google-chrome-stable --version

            if [ "$HEADLESS" == "true" ]; then
                google-chrome-stable \
                    --no-sandbox \
                    --disable-gpu \
                    --user-data-dir=/tmp/chrome \
                    --headless \
                    --remote-debugging-address=0.0.0.0 \
                    --remote-debugging-port=9222 \
                    $url &>headless-chrome.log &
            else
                dbus-launch --exit-with-session google-chrome-stable \
                    --no-sandbox \
                    --disable-gpu \
                    --user-data-dir=/tmp/chrome \
                    --no-first-run \
                    --no-default-browser-check \
                    --disable-translate \
                    $url &
            fi
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
    npm run build
    npm run test-functional -- --browsers chrome:headless
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
