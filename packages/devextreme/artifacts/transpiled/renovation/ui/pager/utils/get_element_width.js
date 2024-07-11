"use strict";

exports.getElementContentWidth = getElementContentWidth;
exports.getElementMinWidth = getElementMinWidth;
exports.getElementStyle = getElementStyle;
exports.getElementWidth = getElementWidth;
var _get_computed_style = _interopRequireDefault(require("../../../utils/get_computed_style"));
var _type_conversion = require("../../../utils/type_conversion");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function getElementStyle(name, element) {
  const computedStyle = (0, _get_computed_style.default)(element) ?? {};
  return (0, _type_conversion.toNumber)(computedStyle[name]);
}
function getElementContentWidth(element) {
  const padding = getElementStyle('paddingLeft', element) + getElementStyle('paddingRight', element);
  const width = getElementStyle('width', element);
  return width - padding;
}
function getElementWidth(element) {
  const margin = getElementStyle('marginLeft', element) + getElementStyle('marginRight', element);
  const width = getElementStyle('width', element);
  return margin + width;
}
function getElementMinWidth(element) {
  return getElementStyle('minWidth', element);
}