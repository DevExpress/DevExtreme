#!/bin/bash -e

# Run inside https://hub.docker.com/r/devexpress/devextreme-build/

export DEVEXTREME_DOCKER_CI=true
export NUGET_PACKAGES=$PWD/dotnet_packages

function run_lint {
    npm i eslint eslint-plugin-spellcheck jshint
    npm run lint
}

function run_test {
    local port=`node -e "console.log(require('./ports.json').qunit)"`
    local url="http://localhost:$port/run?notimers=true&nojquery=true"
    local runner_pid
    local runner_result=0

    [ -n "$CONSTEL" ] && url="$url&constellation=$CONSTEL"

    Xvfb :99 -ac -screen 0 1200x600x24 &
    x11vnc -display :99 2>/dev/null &

    npm i
    npm run build

    # See https://github.com/DevExpress/DevExtreme/pull/1251
    chmod 755 $(find dotnet_packages -type d)

    dotnet ./testing/runner/bin/Debug/dist/runner.dll --single-run & runner_pid=$!

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
            dbus-launch google-chrome-stable \
                --no-sandbox \
                --no-first-run \
                --no-default-browser-check \
                --disable-gpu \
                --disable-translate \
                --user-data-dir=/tmp/chrome \
                $url &
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
