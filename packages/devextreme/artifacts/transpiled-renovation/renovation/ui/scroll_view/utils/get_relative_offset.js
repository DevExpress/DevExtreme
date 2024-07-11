"use strict";

exports.getRelativeOffset = getRelativeOffset;
function getRelativeOffset(targetElementClass, sourceElement) {
  const offset = {
    left: 0,
    top: 0
  };
  let element = sourceElement;
  while ((_element = element) !== null && _element !== void 0 && _element.offsetParent && !element.classList.contains(targetElementClass)) {
    var _element;
    const parentElement = element.offsetParent;
    const elementRect = element.getBoundingClientRect();
    const parentElementRect = parentElement.getBoundingClientRect();
    offset.left += elementRect.left - parentElementRect.left;
    offset.top += elementRect.top - parentElementRect.top;
    element = element.offsetParent;
  }
  return offset;
}