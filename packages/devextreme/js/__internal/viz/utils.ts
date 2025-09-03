/* eslint-disable prefer-rest-params */
/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { each as _each } from '@js/core/utils/iterator';
import { refreshPaths } from '@ts/viz/core/renderers/renderer';

const { floor } = Math;

export let prepareSegmentRectPoints = function (left, top, width, height, borderOptions) {
  const maxSW = ~~((width < height ? width : height) / 2);
  const sw = borderOptions.width || 0;
  const newSW = sw < maxSW ? sw : maxSW;

  left += newSW / 2;
  top += newSW / 2;
  width -= newSW;
  height -= newSW;

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
    left: [[left, bottom], [left, top]],
  };
  _each(allSegment, (seg) => {
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

  _each(segmentSequence, (_, seg) => {
    const segmentVisibility = !!borderOptions[seg];

    if (!prevSegmentVisibility && segments.length) {
      // @ts-expect-error
      points.push(segments);
      segments = [];
    }

    if (segmentVisibility) {
      _each(allSegment[seg].slice(prevSegmentVisibility), (_, segment) => {
        segments = segments.concat(segment);
      });
    }
    prevSegmentVisibility = ~~segmentVisibility;
  });
  // @ts-expect-error
  segments.length && points.push(segments);

  points.length === 1 && (points = points[0]);

  return { points, pathType: visiblyOpt === 15 ? 'area' : 'line' };
};

export {
  refreshPaths,
};

export const areCanvasesDifferent = function (canvas1, canvas2) {
  const sizeChangingThreshold = 1;

  const sizeLessThreshold = ['width', 'height']
    .every((key) => Math.abs(canvas1[key] - canvas2[key]) < sizeChangingThreshold);

  const canvasCoordsIsEqual = ['left', 'right', 'top', 'bottom'].every((key) => canvas1[key] === canvas2[key]);

  return !(sizeLessThreshold && canvasCoordsIsEqual);
};

export const floorCanvasDimensions = function (canvas) {
  return {
    ...canvas,
    height: floor(canvas.height),
    width: floor(canvas.width),
  };
};

/// #DEBUG
export const _test_prepareSegmentRectPoints = function () {
  // @ts-expect-error
  const original = prepareSegmentRectPoints.original || prepareSegmentRectPoints;
  if (arguments[0]) {
    prepareSegmentRectPoints = arguments[0];
  }
  // @ts-expect-error
  prepareSegmentRectPoints.original = original;
  // @ts-expect-error
  prepareSegmentRectPoints.restore = function () { prepareSegmentRectPoints = original; };
  return prepareSegmentRectPoints;
};
/// #ENDDEBUG
