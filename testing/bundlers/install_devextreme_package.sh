#!/usr/bin/env bash

npm install --no-save $(npm pack ../../artifacts/npm/devextreme/ | tail -1)