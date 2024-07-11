"use strict";

exports.measureLabels = exports.calculateCanvasMargins = void 0;
const _max = Math.max;
const calculateCanvasMargins = function (bBoxes, canvas) {
  const cLeft = canvas.left;
  const cTop = canvas.top;
  const cRight = canvas.width - canvas.right;
  const cBottom = canvas.height - canvas.bottom;
  return bBoxes.reduce(function (margins, bBox) {
    if (!bBox || bBox.isEmpty) {
      return margins;
    }
    return {
      left: _max(margins.left, cLeft - bBox.x),
      top: _max(margins.top, cTop - bBox.y),
      right: _max(margins.right, bBox.x + bBox.width - cRight),
      bottom: _max(margins.bottom, bBox.y + bBox.height - cBottom)
    };
  }, {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  });
};
exports.calculateCanvasMargins = calculateCanvasMargins;
const measureLabels = function (items) {
  items.forEach(function (item) {
    const label = item.getContentContainer();
    item.labelBBox = label ? label.getBBox() : {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  });
};
exports.measureLabels = measureLabels;