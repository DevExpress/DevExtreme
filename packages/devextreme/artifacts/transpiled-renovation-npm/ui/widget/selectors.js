"use strict";

exports.tabbable = exports.focused = exports.focusable = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const focusableFn = function (element, tabIndex) {
  if (!visible(element)) {
    return false;
  }
  const nodeName = element.nodeName.toLowerCase();
  const isTabIndexNotNaN = !isNaN(tabIndex);
  const isDisabled = element.disabled;
  const isDefaultFocus = /^(input|select|textarea|button|object|iframe)$/.test(nodeName);
  const isHyperlink = nodeName === 'a';
  let isFocusable;
  const isContentEditable = element.isContentEditable;
  if (isDefaultFocus || isContentEditable) {
    isFocusable = !isDisabled;
  } else {
    if (isHyperlink) {
      isFocusable = element.href || isTabIndexNotNaN;
    } else {
      isFocusable = isTabIndexNotNaN;
    }
  }
  return isFocusable;
};
function visible(element) {
  const $element = (0, _renderer.default)(element);
  return $element.is(':visible') && $element.css('visibility') !== 'hidden' && $element.parents().css('visibility') !== 'hidden';
}
const focusable = function (index, element) {
  return focusableFn(element, (0, _renderer.default)(element).attr('tabIndex'));
};
exports.focusable = focusable;
const tabbable = function (index, element) {
  const tabIndex = (0, _renderer.default)(element).attr('tabIndex');
  return (isNaN(tabIndex) || tabIndex >= 0) && focusableFn(element, tabIndex);
};
// note: use this method instead of is(":focus")
exports.tabbable = tabbable;
const focused = function ($element) {
  const element = (0, _renderer.default)($element).get(0);
  return _dom_adapter.default.getActiveElement(element) === element;
};
exports.focused = focused;