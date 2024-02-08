/* eslint-disable import/no-extraneous-dependencies */
const { series } = require('gulp');
const { copyJsSharedResources, copyMvcSharedResources } = require('../utils/copy-shared-resources/copy');

exports.shared = series(
  copyJsSharedResources,
  copyMvcSharedResources,
);
