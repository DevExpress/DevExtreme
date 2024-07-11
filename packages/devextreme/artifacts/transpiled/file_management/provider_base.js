"use strict";

exports.default = void 0;
var _data = require("../core/utils/data");
var _common = require("../core/utils/common");
var _date_serialization = _interopRequireDefault(require("../core/utils/date_serialization"));
var _iterator = require("../core/utils/iterator");
var _type = require("../core/utils/type");
var _deferred = require("../core/utils/deferred");
var _file_system_item = _interopRequireDefault(require("./file_system_item"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DEFAULT_FILE_UPLOAD_CHUNK_SIZE = 200000;
class FileSystemProviderBase {
  constructor(options) {
    options = (0, _common.ensureDefined)(options, {});
    this._keyGetter = (0, _data.compileGetter)(this._getKeyExpr(options));
    this._nameGetter = (0, _data.compileGetter)(this._getNameExpr(options));
    this._isDirGetter = (0, _data.compileGetter)(this._getIsDirExpr(options));
    this._sizeGetter = (0, _data.compileGetter)(this._getSizeExpr(options));
    this._dateModifiedGetter = (0, _data.compileGetter)(this._getDateModifiedExpr(options));
    this._thumbnailGetter = (0, _data.compileGetter)(options.thumbnailExpr || 'thumbnail');
  }
  getItems(parentDirectory) {
    return [];
  }
  renameItem(item, name) {}
  createDirectory(parentDirectory, name) {}
  deleteItems(items) {}
  moveItems(items, destinationDirectory) {}
  copyItems(items, destinationDirectory) {}
  uploadFileChunk(fileData, chunksInfo, destinationDirectory) {}
  abortFileUpload(fileData, chunksInfo, destinationDirectory) {}
  downloadItems(items) {}
  getItemsContent(items) {}
  getFileUploadChunkSize() {
    return DEFAULT_FILE_UPLOAD_CHUNK_SIZE;
  }
  _convertDataObjectsToFileItems(entries, pathInfo) {
    const result = [];
    (0, _iterator.each)(entries, (_, entry) => {
      const fileItem = this._createFileItem(entry, pathInfo);
      result.push(fileItem);
    });
    return result;
  }
  _createFileItem(dataObj, pathInfo) {
    const key = this._keyGetter(dataObj);
    const fileItem = new _file_system_item.default(pathInfo, this._nameGetter(dataObj), !!this._isDirGetter(dataObj), key);
    fileItem.size = this._sizeGetter(dataObj);
    if (fileItem.size === undefined) {
      fileItem.size = 0;
    }
    fileItem.dateModified = _date_serialization.default.deserializeDate(this._dateModifiedGetter(dataObj));
    if (fileItem.dateModified === undefined) {
      fileItem.dateModified = new Date();
    }
    if (fileItem.isDirectory) {
      fileItem.hasSubDirectories = this._hasSubDirs(dataObj);
    }
    if (!key) {
      fileItem.key = fileItem.relativeName;
    }
    fileItem.thumbnail = this._thumbnailGetter(dataObj) || '';
    fileItem.dataItem = dataObj;
    return fileItem;
  }
  _hasSubDirs(dataObj) {
    return true;
  }
  _getKeyExpr(options) {
    return options.keyExpr || this._defaultKeyExpr;
  }
  _defaultKeyExpr(fileItem) {
    if (arguments.length === 2) {
      fileItem.__KEY__ = arguments[1];
      return;
    }
    return Object.prototype.hasOwnProperty.call(fileItem, '__KEY__') ? fileItem.__KEY__ : null;
  }
  _getNameExpr(options) {
    return options.nameExpr || 'name';
  }
  _getIsDirExpr(options) {
    return options.isDirectoryExpr || 'isDirectory';
  }
  _getSizeExpr(options) {
    return options.sizeExpr || 'size';
  }
  _getDateModifiedExpr(options) {
    return options.dateModifiedExpr || 'dateModified';
  }
  _executeActionAsDeferred(action, keepResult) {
    const deferred = new _deferred.Deferred();
    try {
      const result = action();
      if ((0, _type.isPromise)(result)) {
        (0, _deferred.fromPromise)(result).done(userResult => deferred.resolve(keepResult && userResult || undefined)).fail(error => deferred.reject(error));
      } else {
        deferred.resolve(keepResult && result || undefined);
      }
    } catch (error) {
      return deferred.reject(error);
    }
    return deferred.promise();
  }
}
var _default = exports.default = FileSystemProviderBase;
module.exports = exports.default;
module.exports.default = exports.default;