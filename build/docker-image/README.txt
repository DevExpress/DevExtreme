Build:
    docker build -t devexpress/devextreme-build:YYYY-MM-DD .

Debug:
    docker run --rm -ti -p 5900:5900 -e NO_HEADLESS=true -e TARGET=test -v REPO_PATH:/devextreme devexpress/devextreme-build:YYYY-MM-DD ./docker-ci.sh

Move tag:
    docker tag devexpress/devextreme-build:YYYY-MM-DD devexpress/devextreme-build:XX_X
    docker push devexpress/devextreme-build:XX_X
