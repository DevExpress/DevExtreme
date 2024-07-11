"use strict";

exports.getScrollbarSize = getScrollbarSize;
function getScrollbarSize(element, direction) {
  if (direction === 'vertical') {
    return element.offsetWidth - element.clientWidth;
  }
  return element.offsetHeight - element.clientHeight;
}