"use strict";

exports.isElementVisible = isElementVisible;
function isElementVisible(element) {
  if (element) {
    var _element$getClientRec;
    return !!(element.offsetWidth || element.offsetHeight || (_element$getClientRec = element.getClientRects) !== null && _element$getClientRec !== void 0 && _element$getClientRec.call(element).length);
  }
  return false;
}