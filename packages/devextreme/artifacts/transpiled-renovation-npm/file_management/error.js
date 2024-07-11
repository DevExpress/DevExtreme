"use strict";

exports.default = void 0;
class FileSystemError {
  constructor(errorCode, fileSystemItem, errorText) {
    this.errorCode = errorCode;
    this.fileSystemItem = fileSystemItem;
    this.errorText = errorText;
  }
}
var _default = exports.default = FileSystemError;
module.exports = exports.default;
module.exports.default = exports.default;