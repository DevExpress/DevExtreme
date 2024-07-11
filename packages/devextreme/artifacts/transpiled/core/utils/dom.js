"use strict";

exports.resetActiveElement = exports.replaceWith = exports.normalizeTemplateElement = exports.isElementInDom = exports.insertBefore = exports.extractTemplateMarkup = exports.createTextElementHiddenCopy = exports.contains = exports.closestCommonParent = exports.clipboardText = exports.clearSelection = void 0;
var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _iterator = require("./iterator");
var _type = require("./type");
var _window = require("./window");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();
const getRootNodeHost = element => {
  if (!element.getRootNode) {
    return undefined;
  }
  const host = element.getRootNode().host;

  // NOTE: getRootNode().host can return a string if element is detached "a" element
  if ((0, _type.isString)(host)) {
    return undefined;
  }
  return host;
};
const resetActiveElement = () => {
  const activeElement = _dom_adapter.default.getActiveElement();
  if (activeElement && activeElement !== _dom_adapter.default.getBody()) {
    var _activeElement$blur;
    (_activeElement$blur = activeElement.blur) === null || _activeElement$blur === void 0 || _activeElement$blur.call(activeElement);
  }
};
exports.resetActiveElement = resetActiveElement;
const clearSelection = () => {
  const selection = window.getSelection();
  if (!selection) return;
  if (selection.type === 'Caret') return;
  if (selection.empty) {
    selection.empty();
  } else if (selection.removeAllRanges) {
    // T522811
    try {
      selection.removeAllRanges();
    } catch (e) {}
  }
};
exports.clearSelection = clearSelection;
const closestCommonParent = (startTarget, endTarget) => {
  const $startTarget = (0, _renderer.default)(startTarget);
  const $endTarget = (0, _renderer.default)(endTarget);
  if ($startTarget[0] === $endTarget[0]) {
    return $startTarget[0];
  }
  const $startParents = $startTarget.parents();
  const $endParents = $endTarget.parents();
  const startingParent = Math.min($startParents.length, $endParents.length);
  for (let i = -startingParent; i < 0; i++) {
    if ($startParents.get(i) === $endParents.get(i)) {
      return $startParents.get(i);
    }
  }
};
exports.closestCommonParent = closestCommonParent;
const extractTemplateMarkup = element => {
  element = (0, _renderer.default)(element);
  const templateTag = element.length && element.filter(function isNotExecutableScript() {
    const $node = (0, _renderer.default)(this);
    return $node.is('script[type]') && $node.attr('type').indexOf('script') < 0;
  });
  if (templateTag.length) {
    return templateTag.eq(0).html();
  } else {
    element = (0, _renderer.default)('<div>').append(element);
    return element.html();
  }
};
exports.extractTemplateMarkup = extractTemplateMarkup;
const normalizeTemplateElement = element => {
  let $element = (0, _type.isDefined)(element) && (element.nodeType || (0, _type.isRenderer)(element)) ? (0, _renderer.default)(element) : (0, _renderer.default)('<div>').html(element).contents();
  if ($element.length === 1) {
    if ($element.is('script')) {
      $element = normalizeTemplateElement($element.html().trim());
    } else if ($element.is('table')) {
      $element = $element.children('tbody').contents();
    }
  }
  return $element;
};
exports.normalizeTemplateElement = normalizeTemplateElement;
const clipboardText = (event, text) => {
  const clipboard = event.originalEvent && event.originalEvent.clipboardData || window.clipboardData;
  if (!text) {
    return clipboard && clipboard.getData('Text');
  }
  clipboard && clipboard.setData('Text', text);
};
exports.clipboardText = clipboardText;
const contains = (container, element) => {
  if (!element) {
    return false;
  }
  if ((0, _type.isWindow)(container)) {
    return contains(container.document, element);
  }
  return container.contains(element) || contains(container, getRootNodeHost(element));
};
exports.contains = contains;
const createTextElementHiddenCopy = (element, text, options) => {
  const elementStyles = window.getComputedStyle((0, _renderer.default)(element).get(0));
  const includePaddings = options && options.includePaddings;
  return (0, _renderer.default)('<div>').text(text).css({
    'fontStyle': elementStyles.fontStyle,
    'fontVariant': elementStyles.fontVariant,
    'fontWeight': elementStyles.fontWeight,
    'fontSize': elementStyles.fontSize,
    'fontFamily': elementStyles.fontFamily,
    'letterSpacing': elementStyles.letterSpacing,
    'border': elementStyles.border,
    'paddingTop': includePaddings ? elementStyles.paddingTop : '',
    'paddingRight': includePaddings ? elementStyles.paddingRight : '',
    'paddingBottom': includePaddings ? elementStyles.paddingBottom : '',
    'paddingLeft': includePaddings ? elementStyles.paddingLeft : '',
    'visibility': 'hidden',
    'whiteSpace': 'pre',
    'position': 'absolute',
    'float': 'left'
  });
};
exports.createTextElementHiddenCopy = createTextElementHiddenCopy;
const insertBefore = (element, newElement) => {
  if (newElement) {
    _dom_adapter.default.insertElement(element.parentNode, newElement, element);
  }
  return element;
};
exports.insertBefore = insertBefore;
const replaceWith = (element, newElement) => {
  if (!(newElement && newElement[0])) return;
  if (newElement.is(element)) return element;
  (0, _iterator.each)(newElement, (_, currentElement) => {
    insertBefore(element[0], currentElement);
  });
  element.remove();
  return newElement;
};
exports.replaceWith = replaceWith;
const isElementInDom = $element => {
  const element = $element === null || $element === void 0 ? void 0 : $element.get(0);
  const shadowHost = element === null || element === void 0 ? void 0 : element.getRootNode().host;
  return !!(0, _renderer.default)(shadowHost || element).closest((0, _window.getWindow)().document).length;
};
exports.isElementInDom = isElementInDom;