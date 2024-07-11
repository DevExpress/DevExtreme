"use strict";

exports.whenSome = exports.getMapFromObject = exports.getDisplayFileSize = exports.findItemsByKeys = exports.extendAttributes = void 0;
var _deferred = require("../../core/utils/deferred");
var _extend = require("../../core/utils/extend");
var _common = require("../../core/utils/common");
var _type = require("../../core/utils/type");
const whenSome = function (arg, onSuccess, onError) {
  onSuccess = onSuccess || _common.noop;
  onError = onError || _common.noop;
  if (!Array.isArray(arg)) {
    arg = [arg];
  }
  const deferreds = arg.map((item, index) => {
    return (0, _deferred.when)(item).then(result => {
      (0, _type.isFunction)(onSuccess) && onSuccess({
        item,
        index,
        result
      });
      return result;
    }, error => {
      if (!error) {
        error = {};
      }
      error.index = index;
      (0, _type.isFunction)(onError) && onError(error);
      return new _deferred.Deferred().resolve().promise();
    });
  });
  return _deferred.when.apply(null, deferreds);
};
exports.whenSome = whenSome;
const getDisplayFileSize = function (byteSize) {
  const sizesTitles = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  let displaySize = byteSize;
  while (displaySize >= 1024 && index <= sizesTitles.length - 1) {
    displaySize /= 1024;
    index++;
  }
  displaySize = Math.round(displaySize * 10) / 10;
  return `${displaySize} ${sizesTitles[index]}`;
};
exports.getDisplayFileSize = getDisplayFileSize;
const extendAttributes = function (targetObject, sourceObject, objectKeysArray) {
  objectKeysArray.forEach(objectKey => {
    (0, _extend.extend)(true, targetObject, (0, _type.isDefined)(sourceObject[objectKey]) ? {
      [objectKey]: sourceObject[objectKey]
    } : {});
  });
  return targetObject;
};
exports.extendAttributes = extendAttributes;
const findItemsByKeys = (itemInfos, keys) => {
  const itemMap = {};
  keys.forEach(key => {
    itemMap[key] = null;
  });
  itemInfos.forEach(itemInfo => {
    const key = itemInfo.fileItem.key;
    if (Object.prototype.hasOwnProperty.call(itemMap, key)) {
      itemMap[key] = itemInfo;
    }
  });
  const result = [];
  keys.forEach(key => {
    const itemInfo = itemMap[key];
    if (itemInfo) {
      result.push(itemInfo);
    }
  });
  return result;
};
exports.findItemsByKeys = findItemsByKeys;
const getMapFromObject = function (object) {
  const keys = Object.keys(object);
  const values = [];
  keys.forEach(key => values.push(object[key]));
  return {
    keys,
    values
  };
};
exports.getMapFromObject = getMapFromObject;