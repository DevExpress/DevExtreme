/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable func-names */
/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable consistent-return */
/* eslint-disable prefer-spread */
/* eslint-disable radix */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-plusplus */

import Color from '@js/color';
import { noop } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { adjust, sign } from '@js/core/utils/math';
import {
  isDefined, isExponential, isFunction, isNumeric, isString,
} from '@js/core/utils/type';

const {
  PI,
  LN10,
  abs,
  log,
  floor,
  ceil,
  sqrt,
  atan2,
} = Math;
const _min = Math.min;
const _max = Math.max;
const _cos = Math.cos;
const _sin = Math.sin;
const _round = Math.round;
const { dateToMilliseconds } = dateUtils;

const MAX_PIXEL_COUNT = 1E10;
const PI_DIV_180 = PI / 180;

const _isNaN = isNaN;
const _Number = Number;
const _NaN = NaN;

let numDefsSvgElements = 1;

export const PANE_PADDING = 10;

export const getLog = function (value, base) {
  if (!value) {
    return _NaN;
  }
  return log(value) / log(base);
};

export const getAdjustedLog10 = function (value) {
  return adjust(getLog(value, 10));
};

export const raiseTo = function (power, base) {
  return base ** power;
};

//  Translates angle to [0, 360)
//  Expects number, no validation
export const normalizeAngle = function (angle) {
  return ((angle % 360) + 360) % 360;
};

//  Maps angle in trigonometric space to angle in 'renderer' space
//  Expects numbers, no validation
export const convertAngleToRendererSpace = function (angle) {
  return 90 - angle;
};

//  Maps angle in degrees to angle in radians
//  Expects number, no validation
export const degreesToRadians = function (value) {
  return PI * value / 180;
};

//  Calculates sin and cos for <angle> in degrees
//  Expects number, no validation
export const getCosAndSin = function (angle) {
  const angleInRadians = degreesToRadians(angle);
  return { cos: _cos(angleInRadians), sin: _sin(angleInRadians) };
};

//  Because Math.log(1000) / Math.LN10 < 3 though it is exactly 3
//  Same happens for 1E6, 1E9, 1E12, 1E13, 1E15, ...
const DECIMAL_ORDER_THRESHOLD = 1E-14;
//    ____________________
//   /       2          2
// \/ (y2-y1)  + (x2-x1)
export const getDistance = function (x1, y1, x2, y2) {
  const diffX = x2 - x1;
  const diffY = y2 - y1;
  return sqrt(diffY * diffY + diffX * diffX);
};

export const getDecimalOrder = function (number) {
  let n = abs(number);
  let cn;
  if (!_isNaN(n)) {
    if (n > 0) {
      n = log(n) / LN10;
      cn = ceil(n);
      return cn - n < DECIMAL_ORDER_THRESHOLD ? cn : floor(n);
    }
    return 0;
  }
  return _NaN;
};

export const getAppropriateFormat = function (start, end, count) {
  const order = _max(getDecimalOrder(start), getDecimalOrder(end));
  let precision = -getDecimalOrder(abs(end - start) / count);
  let format;

  if (!_isNaN(order) && !_isNaN(precision)) {
    if (abs(order) <= 4) {
      format = 'fixedPoint';
      precision < 0 && (precision = 0);
      precision > 4 && (precision = 4);
    } else {
      format = 'exponential';
      precision += order - 1;
      precision > 3 && (precision = 3);
    }
    return { type: format, precision };
  }
  return null;
};
// @ts-expect-error
export const roundValue = function (value, precision) {
  if (precision > 20) {
    precision = 20;
  }
  if (isNumeric(value)) {
    if (isExponential(value)) {
      return _Number(value.toExponential(precision));
    }
    // @ts-expect-error
    return _Number(value.toFixed(precision));
  }
};

export const getPower = function (value) {
  return value.toExponential().split('e')[1];
};

export function map(array, callback) {
  let i = 0;
  const len = array.length;
  const result = [];
  let value;

  while (i < len) {
    value = callback(array[i], i);
    if (value !== null) {
      // @ts-expect-error
      result.push(value);
    }
    i++;
  }
  return result;
}

function selectByKeys(object, keys) {
  return map(keys, (key) => (object[key] ? object[key] : null));
}

function decreaseFields(object, keys, eachDecrease, decrease) {
  let dec = decrease;
  each(keys, (_, key) => {
    if (object[key]) {
      object[key] -= eachDecrease;
      dec -= eachDecrease;
    }
  });
  return dec;
}

export function normalizeEnum(value) {
  return String(value).toLowerCase();
}

export function setCanvasValues(canvas) {
  if (canvas) {
    canvas.originalTop = canvas.top;
    canvas.originalBottom = canvas.bottom;
    canvas.originalLeft = canvas.left;
    canvas.originalRight = canvas.right;
  }
  return canvas;
}

function normalizeBBoxField(value) {
  return -MAX_PIXEL_COUNT < value && value < +MAX_PIXEL_COUNT ? value : 0;
}

export function normalizeBBox(bBox) {
  const xl = normalizeBBoxField(floor(bBox.x));
  const yt = normalizeBBoxField(floor(bBox.y));
  const xr = normalizeBBoxField(ceil(bBox.width + bBox.x));
  const yb = normalizeBBoxField(ceil(bBox.height + bBox.y));
  const result = {
    x: xl,
    y: yt,
    width: xr - xl,
    height: yb - yt,
  };
  // @ts-expect-error
  result.isEmpty = !result.x && !result.y && !result.width && !result.height;
  return result;
}

// Angle is expected to be from right-handed cartesian (not svg) space - positive is counterclockwise
export function rotateBBox(bBox, center, angle) {
  const cos = _Number(_cos(angle * PI_DIV_180).toFixed(3));
  const sin = _Number(_sin(angle * PI_DIV_180).toFixed(3));
  const w2 = bBox.width / 2;
  const h2 = bBox.height / 2;
  const centerX = bBox.x + w2;
  const centerY = bBox.y + h2;
  const w2_ = abs(w2 * cos) + abs(h2 * sin);
  const h2_ = abs(w2 * sin) + abs(h2 * cos);
  // Note that the following slightly differs from theoretical formula:
  // x' = x * cos - y * sin, y' = x * sin + y * cos
  // That is because in svg y goes down (not up) - so sign of sin is reverted
  // x' = x * cos + y * sin, y' = -x * sin + y * cos
  const centerX_ = center[0] + (centerX - center[0]) * cos + (centerY - center[1]) * sin;
  const centerY_ = center[1] - (centerX - center[0]) * sin + (centerY - center[1]) * cos;
  return normalizeBBox({
    x: centerX_ - w2_,
    y: centerY_ - h2_,
    width: 2 * w2_,
    height: 2 * h2_,
  });
}

export const decreaseGaps = function (object, keys, decrease) {
  let arrayGaps;
  do {
    arrayGaps = selectByKeys(object, keys);
    arrayGaps.push(ceil(decrease / arrayGaps.length));
    decrease = decreaseFields(object, keys, _min.apply(null, arrayGaps), decrease);
  } while (decrease > 0 && arrayGaps.length > 1);
  return decrease;
};

export const parseScalar = function (value, defaultValue?) {
  return value !== undefined ? value : defaultValue;
};

export const enumParser = function (values) {
  const stored = {};
  let i;
  let ii;
  for (i = 0, ii = values.length; i < ii; ++i) {
    stored[normalizeEnum(values[i])] = 1;
  }
  return function (value, defaultValue) {
    const _value = normalizeEnum(value);
    return stored[_value] ? _value : defaultValue;
  };
};

export const patchFontOptions = function (options) {
  const fontOptions = {};
  each(options || {}, (key, value) => {
    if (/^(cursor)$/i.test(key)) {
      // TODO check other properties, add tests
    } else if (key === 'opacity') {
      value = null;
    } else if (key === 'color') {
      key = 'fill';
      if ('opacity' in options) {
        const color = new Color(value);
        value = `rgba(${color.r},${color.g},${color.b},${options.opacity})`;
      }
    } else {
      key = `font-${key}`;
    }
    fontOptions[key] = value;
  });
  return fontOptions;
};

export function convertPolarToXY(centerCoords, startAngle, angle, radius) {
  const shiftAngle = 90;
  const normalizedRadius = radius > 0 ? radius : 0;

  angle = isDefined(angle) ? angle + startAngle - shiftAngle : 0;
  const cosSin = getCosAndSin(angle);

  return { x: _round(centerCoords.x + normalizedRadius * cosSin.cos), y: _round(centerCoords.y + normalizedRadius * cosSin.sin) };
}

export const convertXYToPolar = function (centerCoords, x, y) {
  const radius = getDistance(centerCoords.x, centerCoords.y, x, y);
  const angle = atan2(y - centerCoords.y, x - centerCoords.x);

  return { phi: _round(normalizeAngle(angle * 180 / PI)), r: _round(radius) };
};

export const processSeriesTemplate = function (seriesTemplate, items) {
  const customizeSeries = isFunction(seriesTemplate.customizeSeries) ? seriesTemplate.customizeSeries : noop;
  const { nameField } = seriesTemplate;
  const generatedSeries = {};
  const seriesOrder = [];
  let series;
  let i = 0;
  let length;
  let data;

  items = items || [];
  for (length = items.length; i < length; i++) {
    data = items[i];
    if (nameField in data) {
      series = generatedSeries[data[nameField]];
      if (!series) {
        series = generatedSeries[data[nameField]] = { name: data[nameField], nameFieldValue: data[nameField] };
        // @ts-expect-error
        seriesOrder.push(series.name);
      }
    }
  }
  return map(seriesOrder, (orderedName) => {
    const group = generatedSeries[orderedName];
    return extend(group, customizeSeries.call(null, group.name));
  });
};

export const getCategoriesInfo = function (categories, startValue, endValue) {
  if (categories.length === 0) {
    return { categories: [] };
  }
  startValue = isDefined(startValue) ? startValue : categories[0];
  endValue = isDefined(endValue) ? endValue : categories[categories.length - 1];

  const categoriesValue = map(categories, (category) => category?.valueOf());
  // @ts-expect-error
  let indexStartValue = categoriesValue.indexOf(startValue.valueOf());
  // @ts-expect-error
  let indexEndValue = categoriesValue.indexOf(endValue.valueOf());
  let swapBuf;
  let inverted = false;

  indexStartValue < 0 && (indexStartValue = 0);
  indexEndValue < 0 && (indexEndValue = categories.length - 1);
  if (indexEndValue < indexStartValue) {
    swapBuf = indexEndValue;
    indexEndValue = indexStartValue;
    indexStartValue = swapBuf;
    inverted = true;
  }

  const visibleCategories = categories.slice(indexStartValue, indexEndValue + 1);
  const lastIdx = visibleCategories.length - 1;
  return {
    categories: visibleCategories,
    start: visibleCategories[inverted ? lastIdx : 0],
    end: visibleCategories[inverted ? 0 : lastIdx],
    inverted,
  };
};

export function isRelativeHeightPane(pane) { return !(pane.unit % 2); }

export function normalizePanesHeight(panes) {
  panes.forEach((pane) => {
    const { height } = pane;
    let unit = 0;
    let parsedHeight = parseFloat(height) || undefined;

    if (isString(height) && height.includes('px')
    || isNumeric(height) && height > 1) {
      // @ts-expect-error
      parsedHeight = _round(parsedHeight);
      unit = 1;
    }

    if (!unit && parsedHeight) {
      if (isString(height) && height.includes('%')) {
        parsedHeight /= 100;
        unit = 2;
      } else if (parsedHeight < 0) {
        parsedHeight = parsedHeight < -1 ? 1 : abs(parsedHeight);
      }
    }

    pane.height = parsedHeight;
    pane.unit = unit;
  });
  const relativeHeightPanes = panes.filter(isRelativeHeightPane);
  const weightSum = relativeHeightPanes.reduce((prev, next) => prev + (next.height || 0), 0);
  const weightHeightCount = relativeHeightPanes.length;
  const emptyHeightPanes = relativeHeightPanes.filter((pane) => !pane.height);
  const emptyHeightCount = emptyHeightPanes.length;

  if (weightSum < 1 && emptyHeightCount) {
    emptyHeightPanes.forEach((pane) => pane.height = (1 - weightSum) / emptyHeightCount);
  } else if (weightSum > 1 || weightSum < 1 && !emptyHeightCount || weightSum === 1 && emptyHeightCount) {
    if (emptyHeightCount) {
      const weightForEmpty = weightSum / weightHeightCount;
      const emptyWeightSum = emptyHeightCount * weightForEmpty;
      relativeHeightPanes.filter((pane) => pane.height).forEach((pane) => pane.height *= (weightSum - emptyWeightSum) / weightSum);
      emptyHeightPanes.forEach((pane) => pane.height = weightForEmpty);
    }
    relativeHeightPanes.forEach((pane) => pane.height *= 1 / weightSum);
  }
}

export function updatePanesCanvases(panes, canvas, rotated) {
  let distributedSpace = 0;
  const padding = PANE_PADDING;
  const paneSpace = rotated ? canvas.width - canvas.left - canvas.right : canvas.height - canvas.top - canvas.bottom;
  const totalCustomSpace = panes.reduce((prev, cur) => prev + (!isRelativeHeightPane(cur) ? cur.height : 0), 0);
  const usefulSpace = paneSpace - padding * (panes.length - 1) - totalCustomSpace;
  const startName = rotated ? 'left' : 'top';
  const endName = rotated ? 'right' : 'bottom';

  panes.forEach((pane) => {
    const calcLength = !isRelativeHeightPane(pane) ? pane.height : _round(pane.height * usefulSpace);
    pane.canvas = pane.canvas || {};
    extend(pane.canvas, canvas);
    pane.canvas[startName] = canvas[startName] + distributedSpace;
    pane.canvas[endName] = canvas[endName] + (paneSpace - calcLength - distributedSpace);

    distributedSpace = distributedSpace + calcLength + padding;
    setCanvasValues(pane.canvas);
  });
}

export const unique = function (array) {
  const values = {};
  return map(array, (item) => {
    const result = !values[item] ? item : null;
    values[item] = true;
    return result;
  });
};

export const getVerticallyShiftedAngularCoords = function (bBox, dy, center) {
  // TODO: Use center instead of left top corner - that is more correct and allows to get rid of "isPositive"
  //   horizontalOffset1 = bBox.x + bBox.width / 2 - center.x
  //   horizontalOffset2 = bBox.y + bBox.height / 2 - center.y
  //   verticalOffset2 = newCoord.y + bBox.height / 2 - center.y
  const isPositive = bBox.x + bBox.width / 2 >= center.x;
  const horizontalOffset1 = (isPositive ? bBox.x : bBox.x + bBox.width) - center.x;
  const verticalOffset1 = bBox.y - center.y;
  const verticalOffset2 = verticalOffset1 + dy;
  const horizontalOffset2 = _round(sqrt(horizontalOffset1 * horizontalOffset1 + verticalOffset1 * verticalOffset1 - verticalOffset2 * verticalOffset2));
  const dx = (isPositive ? +horizontalOffset2 : -horizontalOffset2) || horizontalOffset1;
  return { x: center.x + (isPositive ? dx : dx - bBox.width), y: bBox.y + dy };
};

export function mergeMarginOptions(opt1, opt2) {
  return {
    checkInterval: opt1.checkInterval || opt2.checkInterval,
    size: _max(opt1.size || 0, opt2.size || 0),
    percentStick: opt1.percentStick || opt2.percentStick,
    sizePointNormalState: _max(opt1.sizePointNormalState || 0, opt2.sizePointNormalState || 0),
  };
}

export function getVizRangeObject(value) {
  if (Array.isArray(value)) {
    return { startValue: value[0], endValue: value[1] };
  }
  return value || {};
}

export function normalizeArcParams(x, y, innerRadius, outerRadius, startAngle, endAngle) {
  let isCircle;
  let noArc = true;
  // @ts-expect-error
  const angleDiff = roundValue(endAngle, 3) - roundValue(startAngle, 3);
  if (angleDiff) {
    if ((abs(angleDiff) % 360) === 0) {
      startAngle = 0;
      endAngle = 360;
      isCircle = true;
      endAngle -= 0.01;
    }

    if (startAngle > 360) {
      startAngle %= 360;
    }

    if (endAngle > 360) {
      endAngle %= 360;
    }

    if (startAngle > endAngle) {
      startAngle -= 360;
    }
    noArc = false;
  }

  startAngle *= PI_DIV_180;
  endAngle *= PI_DIV_180;

  return [
    x,
    y,
    Math.min(outerRadius, innerRadius),
    Math.max(outerRadius, innerRadius),
    Math.cos(startAngle),
    Math.sin(startAngle),
    Math.cos(endAngle),
    Math.sin(endAngle),
    isCircle,
    floor(abs(endAngle - startAngle) / PI) % 2 ? '1' : '0',
    noArc,
  ];
}

export function convertVisualRangeObject(visualRange, convertToVisualRange?) {
  if (convertToVisualRange) {
    return visualRange;
  }
  return [visualRange.startValue, visualRange.endValue];
}

export function getAddFunction(range, correctZeroLevel) {
  // T170398
  if (range.dataType === 'datetime') {
    return function (rangeValue, marginValue, sign = 1) {
      return new Date(rangeValue.getTime() + sign * marginValue);
    };
  }

  if (range.axisType === 'logarithmic') {
    return function (rangeValue, marginValue, sign = 1) {
      const log = getLogExt(rangeValue, range.base) + sign * marginValue;
      return raiseToExt(log, range.base);
    };
  }

  return function (rangeValue, marginValue, sign = 1) {
    const newValue = rangeValue + sign * marginValue;
    return correctZeroLevel && newValue * rangeValue <= 0 ? 0 : newValue;
  };
}

export function adjustVisualRange(options, visualRange, wholeRange, dataRange?) {
  const minDefined = isDefined(visualRange.startValue);
  const maxDefined = isDefined(visualRange.endValue);
  const nonDiscrete = options.axisType !== 'discrete';

  dataRange = dataRange || wholeRange;

  const add = getAddFunction(options, false);

  let min = minDefined ? visualRange.startValue : dataRange.min;
  let max = maxDefined ? visualRange.endValue : dataRange.max;
  let rangeLength = visualRange.length;
  const { categories } = dataRange;

  if (nonDiscrete && !isDefined(min) && !isDefined(max)) {
    return {
      startValue: min,
      endValue: max,
    };
  }

  if (isDefined(rangeLength)) {
    if (nonDiscrete) {
      if (options.dataType === 'datetime' && !isNumeric(rangeLength)) {
        rangeLength = dateToMilliseconds(rangeLength);
      }

      if (maxDefined && !minDefined || !maxDefined && !minDefined) {
        isDefined(wholeRange.max) && (max = max > wholeRange.max ? wholeRange.max : max);
        min = add(max, rangeLength, -1);
      } else if (minDefined && !maxDefined) {
        isDefined(wholeRange.min) && (min = min < wholeRange.min ? wholeRange.min : min);
        max = add(min, rangeLength);
      }
    } else {
      rangeLength = parseInt(rangeLength);
      if (!isNaN(rangeLength) && isFinite(rangeLength)) {
        rangeLength--;
        if (!maxDefined && !minDefined) {
          max = categories[categories.length - 1];
          min = categories[categories.length - 1 - rangeLength];
        } else if (minDefined && !maxDefined) {
          const categoriesInfo = getCategoriesInfo(categories, min, undefined);
          max = categoriesInfo.categories[rangeLength];
        } else if (!minDefined && maxDefined) {
          const categoriesInfo = getCategoriesInfo(categories, undefined, max);
          min = categoriesInfo.categories[categoriesInfo.categories.length - 1 - rangeLength];
        }
      }
    }
  }

  if (nonDiscrete) {
    if (isDefined(wholeRange.max) && max > wholeRange.max) {
      max = wholeRange.max;
    }
    if (isDefined(wholeRange.min) && min < wholeRange.min) {
      min = wholeRange.min;
    }
  }

  return {
    startValue: min,
    endValue: max,
  };
}

export function getLogExt(value, base, allowNegatives = false, linearThreshold?) {
  if (!allowNegatives) {
    return getLog(value, base);
  }
  if (value === 0) {
    return 0;
  }
  const transformValue = getLog(abs(value), base) - (linearThreshold - 1);
  if (transformValue < 0) {
    return 0;
  }
  return adjust(sign(value) * transformValue, Number((base ** (linearThreshold - 1)).toFixed(abs(linearThreshold))));
}

export function raiseToExt(value, base, allowNegatives = false, linearThreshold?) {
  if (!allowNegatives) {
    return raiseTo(value, base);
  }

  if (value === 0) {
    return 0;
  }

  const transformValue = raiseTo(abs(value) + (linearThreshold - 1), base);

  if (transformValue < 0) {
    return 0;
  }

  return adjust(sign(value) * transformValue, Number((base ** linearThreshold).toFixed(abs(linearThreshold))));
}

export function rangesAreEqual(range, rangeFromOptions) {
  if (Array.isArray(rangeFromOptions)) {
    return range.length === rangeFromOptions.length
    && range.every((item, i) => valueOf(item) === valueOf(rangeFromOptions[i]));
  }
  return valueOf(range.startValue) === valueOf(rangeFromOptions.startValue)
    && valueOf(range.endValue) === valueOf(rangeFromOptions.endValue);
}

export function valueOf(value) {
  return value && value.valueOf();
}

export function pointInCanvas(canvas, x, y) {
  return x >= canvas.left && x <= canvas.right && y >= canvas.top && y <= canvas.bottom;
}

export const getNextDefsSvgId = () => `DevExpress_${numDefsSvgElements++}`;

export function extractColor(color, isBase?) {
  if (isString(color) || !color) {
    return color;
  } if (isBase) {
    return color.base;
  }
  return color.fillId || color.base;
}
