"use strict";

exports.addColorizer = addColorizer;
exports.createColorCodeGetter = createColorCodeGetter;
exports.getColorizer = getColorizer;
exports.setDefaultColorizer = setDefaultColorizer;
var _utils = require("../core/utils");
var _common = require("../../core/utils/common");
const colorizers = {};
let defaultColorizerName;
function wrapLeafColorGetter(getter) {
  return function (node) {
    return !node.isNode() ? getter(node) : undefined;
  };
}
function wrapGroupColorGetter(getter) {
  return function (node) {
    const parent = !node.isNode() && node.parent;
    return parent ? parent._groupColor = parent._groupColor || getter(parent) : undefined;
  };
}
function getColorizer(options, themeManager, root) {
  const type = (0, _utils.normalizeEnum)(options.type || defaultColorizerName);
  const colorizer = colorizers[type] && colorizers[type](options, themeManager, root);
  return colorizer ? (options.colorizeGroups ? wrapGroupColorGetter : wrapLeafColorGetter)(colorizer) : _common.noop;
}
function addColorizer(name, colorizer) {
  colorizers[name] = colorizer;
}
function setDefaultColorizer(name) {
  defaultColorizerName = name;
}
function getValueAsColorCode(node) {
  return node.value;
}
function createColorCode(colorCodeField) {
  return function (node) {
    return Number(node.data[colorCodeField]);
  };
}
function createColorCodeGetter(options) {
  return options.colorCodeField ? createColorCode(options.colorCodeField) : getValueAsColorCode;
}