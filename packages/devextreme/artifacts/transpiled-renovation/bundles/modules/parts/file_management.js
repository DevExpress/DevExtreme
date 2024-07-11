"use strict";

var _core = _interopRequireDefault(require("./core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable import/no-commonjs */

/// BUNDLER_PARTS
/* fileManagement (dx.module-core.js) */

const fileManagement = require('../../../bundles/modules/file_management');
_core.default.fileManagement = fileManagement;

/// BUNDLER_PARTS_END

module.exports = fileManagement;