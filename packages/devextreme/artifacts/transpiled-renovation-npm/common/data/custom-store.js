"use strict";

exports.isGroupItemsArray = isGroupItemsArray;
exports.isItemsArray = isItemsArray;
exports.isLoadResultObject = isLoadResultObject;
function isGroupItem(item) {
  if (item === undefined || item === null || typeof item !== 'object') {
    return false;
  }
  return 'key' in item && 'items' in item;
}
function isLoadResultObject(res) {
  return !Array.isArray(res) && 'data' in res;
}
function isGroupItemsArray(res) {
  return Array.isArray(res) && !!res.length && isGroupItem(res[0]);
}
function isItemsArray(res) {
  return Array.isArray(res) && !isGroupItem(res[0]);
}