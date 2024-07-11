"use strict";

exports.prepareSegmentRectPoints = exports.floorCanvasDimensions = exports.areCanvasesDifferent = exports._test_prepareSegmentRectPoints = void 0;
Object.defineProperty(exports, "refreshPaths", {
  enumerable: true,
  get: function () {
    return _renderer.refreshPaths;
  }
});
var _renderer = require("./core/renderers/renderer");
var _iterator = require("../core/utils/iterator");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const {
  floor
} = Math;
let prepareSegmentRectPoints = function (left, top, width, height, borderOptions) {
  const maxSW = ~~((width < height ? width : height) / 2);
  const sw = borderOptions.width || 0;
  const newSW = sw < maxSW ? sw : maxSW;
  left = left + newSW / 2;
  top = top + newSW / 2;
  width = width - newSW;
  height = height - newSW;
  const right = left + width;
  const bottom = top + height;
  let points = [];
  let segments = [];
  let segmentSequence;
  let visiblyOpt = 0;
  let prevSegmentVisibility = 0;
  const allSegment = {
    top: [[left, top], [right, top]],
    right: [[right, top], [right, bottom]],
    bottom: [[right, bottom], [left, bottom]],
    left: [[left, bottom], [left, top]]
  };
  (0, _iterator.each)(allSegment, function (seg) {
    const visibility = !!borderOptions[seg];
    visiblyOpt = visiblyOpt * 2 + ~~visibility;
  });
  switch (visiblyOpt) {
    case 13:
    case 9:
      segmentSequence = ['left', 'top', 'right', 'bottom'];
      break;
    case 11:
      segmentSequence = ['bottom', 'left', 'top', 'right'];
      break;
    default:
      segmentSequence = ['top', 'right', 'bottom', 'left'];
  }
  (0, _iterator.each)(segmentSequence, function (_, seg) {
    const segmentVisibility = !!borderOptions[seg];
    if (!prevSegmentVisibility && segments.length) {
      points.push(segments);
      segments = [];
    }
    if (segmentVisibility) {
      (0, _iterator.each)(allSegment[seg].slice(prevSegmentVisibility), function (_, segment) {
        segments = segments.concat(segment);
      });
    }
    prevSegmentVisibility = ~~segmentVisibility;
  });
  segments.length && points.push(segments);
  points.length === 1 && (points = points[0]);
  return {
    points: points,
    pathType: visiblyOpt === 15 ? 'area' : 'line'
  };
};
exports.prepareSegmentRectPoints = prepareSegmentRectPoints;
const areCanvasesDifferent = function (canvas1, canvas2) {
  const sizeChangingThreshold = 1;
  const sizeLessThreshold = ['width', 'height'].every(key => Math.abs(canvas1[key] - canvas2[key]) < sizeChangingThreshold);
  const canvasCoordsIsEqual = ['left', 'right', 'top', 'bottom'].every(key => canvas1[key] === canvas2[key]);
  return !(sizeLessThreshold && canvasCoordsIsEqual);
};
exports.areCanvasesDifferent = areCanvasesDifferent;
const floorCanvasDimensions = function (canvas) {
  return _extends({}, canvas, {
    height: floor(canvas.height),
    width: floor(canvas.width)
  });
};

///#DEBUG
exports.floorCanvasDimensions = floorCanvasDimensions;
const _test_prepareSegmentRectPoints = function () {
  const original = prepareSegmentRectPoints.original || prepareSegmentRectPoints;
  if (arguments[0]) {
    exports.prepareSegmentRectPoints = prepareSegmentRectPoints = arguments[0];
  }
  prepareSegmentRectPoints.original = original;
  prepareSegmentRectPoints.restore = function () {
    exports.prepareSegmentRectPoints = prepareSegmentRectPoints = original;
  };
  return prepareSegmentRectPoints;
};
///#ENDDEBUG
exports._test_prepareSegmentRectPoints = _test_prepareSegmentRectPoints;