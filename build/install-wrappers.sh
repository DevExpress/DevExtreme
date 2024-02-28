#!/bin/bash

echo This is a workaround for working with demos until the wrappers are reworked
echo please run 'npm run all:build' before this script
echo this sript should be rerunned after each 'npm install'

rm -rf node_modules/devextreme-angular node_modules/devextreme-react node_modules/devextreme-vue
mkdir node_modules/devextreme-angular node_modules/devextreme-react node_modules/devextreme-vue
tar -xzf artifacts/npm/devextreme-angular-*.tgz -C node_modules/devextreme-angular
mv node_modules/devextreme-angular/package/* node_modules/devextreme-angular
tar -xzf artifacts/npm/devextreme-react-*.tgz -C node_modules/devextreme-react
mv node_modules/devextreme-react/package/* node_modules/devextreme-react
tar -xzf artifacts/npm/devextreme-vue-*.tgz -C node_modules/devextreme-vue
mv node_modules/devextreme-vue/package/* node_modules/devextreme-vue

echo done!
