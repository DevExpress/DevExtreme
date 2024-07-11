"use strict";

var _core = _interopRequireDefault(require("./core"));
var _error = _interopRequireDefault(require("../../file_management/error"));
var _file_system_item = _interopRequireDefault(require("../../file_management/file_system_item"));
var _object_provider = _interopRequireDefault(require("../../file_management/object_provider"));
var _remote_provider = _interopRequireDefault(require("../../file_management/remote_provider"));
var _custom_provider = _interopRequireDefault(require("../../file_management/custom_provider"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable import/no-commonjs */

module.exports = _core.default.fileManagement = _core.default.fileManagement || {};
_core.default.fileManagement.FileSystemError = _error.default;
_core.default.fileManagement.FileSystemItem = _file_system_item.default;
_core.default.fileManagement.ObjectFileSystemProvider = _object_provider.default;
_core.default.fileManagement.RemoteFileSystemProvider = _remote_provider.default;
_core.default.fileManagement.CustomFileSystemProvider = _custom_provider.default;