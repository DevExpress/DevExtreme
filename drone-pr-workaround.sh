#!/bin/bash -e

# See https://discourse.drone.io/t/solved-issues-when-cloning-github-pr/482/5
# This works together with DRONE_GITHUB_MERGE_REF=false for Drone server

if [ -z "$DRONE_PULL_REQUEST" ]; then
    echo "Not a pull request. Do nothing."
    exit 0
fi

for i in {1..10}; do 
    if (( i > 1 )); then
        echo "Retrying in 5 sec..."
        sleep 5
    fi

    git fetch --no-tags origin +refs/pull/$DRONE_PULL_REQUEST/merge && git checkout -qf FETCH_HEAD && exit 0
done

exit 1
