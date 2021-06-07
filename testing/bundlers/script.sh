#!/usr/bin/env bash

npm install --save-dev $(npm pack ../../artifacts/npm/devextreme/ | tail -1)