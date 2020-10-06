/* eslint-disable import/no-commonjs */
import DevExpress from './core';

/// BUNDLER_PARTS
/* fileManagement (dx.module-core.js) */

const fileManagement = require('../../../bundles/modules/file_management');
DevExpress.fileManagement = fileManagement;

/// BUNDLER_PARTS_END

module.exports = fileManagement;
