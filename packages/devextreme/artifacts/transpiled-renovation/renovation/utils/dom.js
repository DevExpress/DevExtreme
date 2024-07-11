"use strict";

exports.querySelectorInSameDocument = querySelectorInSameDocument;
function querySelectorInSameDocument(el, selector) {
  var _el$getRootNode;
  const root = ((_el$getRootNode = el.getRootNode) === null || _el$getRootNode === void 0 ? void 0 : _el$getRootNode.call(el)) ?? document;
  return root.querySelector(selector);
}