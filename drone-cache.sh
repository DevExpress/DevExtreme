#!/bin/bash

CACHE_DIRS="node_modules dotnet_packages"

function read_fallback_branch {
    node -e "console.log(require('./package.json').version.split(/\./g).slice(0, 2).join('_'))" 2> /dev/null || echo "unknown";
}

function try_upload {
    local url="http://devextreme-ci-cache.s3.amazonaws.com/$1.tgz"
    if tar cfz - $i | curl -Lsf -X PUT -H "x-amz-acl: bucket-owner-full-control" --data-binary @- "$url"; then
        echo "Uploaded: $url"
        return 0
    else
        echo "Failed to upload: $url"
        return 1
    fi
}

function try_restore {
    local url="http://devextreme-ci-cache.s3.amazonaws.com/$1.tgz"
    if curl -Lsf "$url" | tar xzf - 2>/dev/null; then
        echo "Restored: $url"
        return 0
    else
        echo "Failed to restore: $url"
        return 1
    fi
}


if [ -z "$DRONE_REPO" ] || [ -z "$DRONE_BRANCH" ]; then
    echo "Missing required env"
    exit 1
fi

if [ "$1" == "rebuild" ]; then

    if [ "$DRONE_BUILD_EVENT" != "push" ]; then
        echo "Skip on $DRONE_BUILD_EVENT"
        exit 0
    fi

    for i in $CACHE_DIRS; do
        [ -e $i ] && try_upload "$DRONE_REPO/$DRONE_BRANCH/$i"
    done

    exit 0
fi

if [ "$1" == "restore" ]; then
    FALLBACK_BRANCH=$(read_fallback_branch)

    for i in $CACHE_DIRS; do
        try_restore "$DRONE_REPO/$DRONE_BRANCH/$i" || try_restore "DevExpress/DevExtreme/$FALLBACK_BRANCH/$i"
    done

    exit 0
fi


echo "Not enough arguments"
exit 1
