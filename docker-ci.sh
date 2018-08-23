#!/bin/bash -e

# Run inside https://hub.docker.com/r/devexpress/devextreme-build/

trap "echo 'Interrupted!' && kill -9 0" TERM INT

export DEVEXTREME_DOCKER_CI=true
export DEVEXTREME_QUNIT_CI=true
export NUGET_PACKAGES=$PWD/dotnet_packages

function run_lint {
    npm i eslint eslint-plugin-spellcheck
    npm run lint
}

function run_test {
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
            firefox --version
            firefox $url &
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


echo "node $(node -v), npm $(npm -v), dotnet $(dotnet --version)"

case "$TARGET" in
    "lint") run_lint ;;
    "test") run_test ;;

    *)
        echo "Unknown target"
        exit 1
    ;;
esac
