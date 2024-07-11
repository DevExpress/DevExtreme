"use strict";

exports.addShadowDomStyles = addShadowDomStyles;
exports.getShadowElementsFromPoint = getShadowElementsFromPoint;
const DX_RULE_PREFIX = 'dx-';
let ownerDocumentStyleSheet = null;
function createConstructedStyleSheet(rootNode) {
  try {
    // eslint-disable-next-line no-undef
    return new CSSStyleSheet();
  } catch (err) {
    const styleElement = rootNode.ownerDocument.createElement('style');
    rootNode.appendChild(styleElement);
    return styleElement.sheet;
  }
}
function processRules(targetStyleSheet, styleSheets, needApplyAllStyles) {
  for (let i = 0; i < styleSheets.length; i++) {
    const sheet = styleSheets[i];
    try {
      for (let j = 0; j < sheet.cssRules.length; j++) {
        insertRule(targetStyleSheet, sheet.cssRules[j], needApplyAllStyles);
      }
    } catch (err) {
      // NOTE: need try/catch block for not-supported cross-domain css
    }
  }
}
function insertRule(targetStyleSheet, rule, needApplyAllStyles) {
  var _rule$selectorText, _rule$cssRules, _rule$name, _rule$style;
  const isDxRule = needApplyAllStyles || ((_rule$selectorText = rule.selectorText) === null || _rule$selectorText === void 0 ? void 0 : _rule$selectorText.includes(DX_RULE_PREFIX)) || ((_rule$cssRules = rule.cssRules) === null || _rule$cssRules === void 0 || (_rule$cssRules = _rule$cssRules[0]) === null || _rule$cssRules === void 0 || (_rule$cssRules = _rule$cssRules.selectorText) === null || _rule$cssRules === void 0 ? void 0 : _rule$cssRules.includes(DX_RULE_PREFIX)) || ((_rule$name = rule.name) === null || _rule$name === void 0 ? void 0 : _rule$name.startsWith(DX_RULE_PREFIX)) || ((_rule$style = rule.style) === null || _rule$style === void 0 ? void 0 : _rule$style.fontFamily) === 'DXIcons';
  if (isDxRule) {
    targetStyleSheet.insertRule(rule.cssText, targetStyleSheet.cssRules.length);
  }
}
function addShadowDomStyles($element) {
  var _el$getRootNode;
  const el = $element.get(0);
  const root = (_el$getRootNode = el.getRootNode) === null || _el$getRootNode === void 0 ? void 0 : _el$getRootNode.call(el);
  if (!(root !== null && root !== void 0 && root.host)) {
    return;
  }
  if (!ownerDocumentStyleSheet) {
    ownerDocumentStyleSheet = createConstructedStyleSheet(root);
    processRules(ownerDocumentStyleSheet, el.ownerDocument.styleSheets, false);
  }
  const currentShadowDomStyleSheet = createConstructedStyleSheet(root);
  processRules(currentShadowDomStyleSheet, root.styleSheets, true);
  root.adoptedStyleSheets = [ownerDocumentStyleSheet, currentShadowDomStyleSheet];
}
function isPositionInElementRectangle(element, x, y) {
  const rect = element.getBoundingClientRect();
  return rect && x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom;
}
function createQueue() {
  let shiftIndex = 0;
  const items = [];
  return {
    push(item) {
      items.push(item);
      return this;
    },
    shift() {
      shiftIndex++;
      return items[shiftIndex - 1];
    },
    get length() {
      return items.length - shiftIndex;
    },
    get items() {
      return items;
    }
  };
}
function getShadowElementsFromPoint(x, y, root) {
  const elementQueue = createQueue().push(root);
  while (elementQueue.length) {
    const el = elementQueue.shift();
    for (let i = 0; i < el.childNodes.length; i++) {
      const childNode = el.childNodes[i];

      // eslint-disable-next-line no-undef
      if (childNode.nodeType === Node.ELEMENT_NODE && isPositionInElementRectangle(childNode, x, y) &&
      // eslint-disable-next-line no-undef
      getComputedStyle(childNode).pointerEvents !== 'none') {
        elementQueue.push(childNode);
      }
    }
  }
  const result = elementQueue.items.reverse();
  result.pop();
  return result;
}