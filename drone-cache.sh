#!/bin/bash

CACHE_BUCKET=devextreme-ci-cache
CACHE_DIRS="node_modules dotnet_packages"

if [ -z "$DRONE_REPO" ] || [ -z "$DRONE_BRANCH" ]; then
    echo "Missing required env"
    exit 1
fi

if [ "$1" == "rebuild" ]; then

    if [ "$DRONE_BUILD_EVENT" != "push" ]; then
        echo "Skip on $DRONE_BUILD_EVENT"
        exit 0
    fi

    echo "Rebuilding cache..."
    for i in $CACHE_DIRS; do
        if [ -e $i ]; then
            url="http://$CACHE_BUCKET.s3.amazonaws.com/$DRONE_REPO/$DRONE_BRANCH/$i.tgz"
            if tar cfz - $i | curl -f -X PUT -H "x-amz-acl: bucket-owner-full-control" --data-binary @- "$url"; then
                echo "Uploaded: $url"
            fi
        else
            echo "Does not exist: $i"
        fi
    done

    exit 0
fi

if [ "$1" == "restore" ]; then
    echo "Restoring cache..."
    for i in $CACHE_DIRS; do
        url="http://$CACHE_BUCKET.s3.amazonaws.com/$DRONE_REPO/$DRONE_BRANCH/$i.tgz"
        if curl -s "$url" | tar xzf - 2>/dev/null; then
            echo "Restored: $url"
        else
            echo "Unable to restore: $url"
        fi
    done

    exit 0
fi


echo "Not enough arguments"
exit 1
