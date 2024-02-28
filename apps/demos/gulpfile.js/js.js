/* eslint-disable import/no-extraneous-dependencies */
const { join } = require('path');
const { task, parallel, series } = require('gulp');

const { init } = require('../utils/shared/config-helper');
const createConfig = require('../utils/internal/create-config');
const { copyJsSharedResources } = require('../utils/copy-shared-resources/copy');
const { copyBundlesFolder, build } = require('../utils/bundle');

const demosDir = join(__dirname, '..', 'Demos');

function prepareJs(callback) {
  init();
  copyJsSharedResources(callback);
  createConfig.useBundles = false;
  createConfig.run(demosDir);
  callback();
}

exports.js = prepareJs;

task('copy-bundles', (callback) => {
  copyBundlesFolder();
  callback();
});

task('update-config', (callback) => {
  createConfig.useBundles = true;
  createConfig.run(demosDir);
  callback();
});

exports.bundles = series(
  'copy-bundles',
  parallel(
    ['vue', 'angular', 'react'].map((framework) => Object.assign((callback) => {
      build(framework).then(callback);
    }, { displayName: `bundle-${framework}` })),
  ),
);
