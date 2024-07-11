"use strict";

exports.toggleDisplay = exports.createVisibilityGroup = exports.createTracker = void 0;
const createTracker = (renderer, root) => renderer.g().attr({
  stroke: 'none',
  'stroke-width': 0,
  fill: '#000000',
  opacity: 0.0001
}).css({
  cursor: 'pointer'
}).append(root);
exports.createTracker = createTracker;
const createVisibilityGroup = function (renderer, root) {
  let className = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return renderer.g().attr({
    'class': className
  }).append(root);
};
exports.createVisibilityGroup = createVisibilityGroup;
const toggleDisplay = (blocks, isVisible) => {
  const cssDisplayBlock = {
    display: 'block'
  };
  const cssDisplayNone = {
    display: 'none'
  };
  const style = isVisible ? cssDisplayBlock : cssDisplayNone;
  blocks.map(item => item.css(style));
};
exports.toggleDisplay = toggleDisplay;