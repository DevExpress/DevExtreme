/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable radix */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { adjust } from '@js/core/utils/math';
import { isDate, isDefined } from '@js/core/utils/type';
import {
  getCategoriesInfo,
  getLogExt as getLog,
  getPower,
  raiseToExt,
} from '@ts/viz/core/utils';
import categoryTranslator from '@ts/viz/translators/category_translator';
import datetimeTranslator from '@ts/viz/translators/datetime_translator';
import intervalTranslator from '@ts/viz/translators/interval_translator';
import logarithmicTranslator from '@ts/viz/translators/logarithmic_translator';
import { Range } from '@ts/viz/translators/range';

const _abs = Math.abs;

const CANVAS_PROP = ['width', 'height', 'left', 'top', 'bottom', 'right'];

const dummyTranslator = {
  to(value) {
    const coord = this._canvasOptions.startPoint + (this._options.conversionValue ? value : Math.round(value));
    return coord > this._canvasOptions.endPoint ? this._canvasOptions.endPoint : coord;
  },
  from(value) {
    return value - this._canvasOptions.startPoint;
  },
};

const validateCanvas = function (canvas) {
  each(CANVAS_PROP, (_, prop) => {
    canvas[prop] = parseInt(canvas[prop]) || 0;
  });
  return canvas;
};

const makeCategoriesToPoints = function (categories) {
  const categoriesToPoints = {};

  categories.forEach((item, i) => { categoriesToPoints[item.valueOf()] = i; });
  return categoriesToPoints;
};

const validateBusinessRange = function (businessRange) {
  if (!(businessRange instanceof Range)) {
    businessRange = new Range(businessRange);
  }
  function validate(valueSelector, baseValueSelector) {
    if (!isDefined(businessRange[valueSelector]) && isDefined(businessRange[baseValueSelector])) {
      businessRange[valueSelector] = businessRange[baseValueSelector];
    }
  }
  validate('minVisible', 'min');
  validate('maxVisible', 'max');
  return businessRange;
};

function prepareBreaks(breaks, range) {
  const transform = range.axisType === 'logarithmic' ? function (value) {
    return getLog(value, range.base);
  } : function (value) {
    return value;
  };
  const array = [];
  let br;
  let transformFrom;
  let transformTo;
  let i;
  const { length } = breaks;
  let sum = 0;

  for (i = 0; i < length; i++) {
    br = breaks[i];
    transformFrom = transform(br.from);
    transformTo = transform(br.to);
    sum += transformTo - transformFrom;
    // @ts-expect-error
    array.push({
      trFrom: transformFrom,
      trTo: transformTo,
      from: br.from,
      to: br.to,
      length: sum,
      cumulativeWidth: br.cumulativeWidth,
    });
  }

  return array;
}

function getCanvasBounds(range) {
  let { min } = range;
  let { max } = range;
  let { minVisible } = range;
  let { maxVisible } = range;
  const isLogarithmic = range.axisType === 'logarithmic';

  if (isLogarithmic) {
    maxVisible = getLog(maxVisible, range.base, range.allowNegatives, range.linearThreshold);
    minVisible = getLog(minVisible, range.base, range.allowNegatives, range.linearThreshold);
    min = getLog(min, range.base, range.allowNegatives, range.linearThreshold);
    max = getLog(max, range.base, range.allowNegatives, range.linearThreshold);
  }

  return {
    base: range.base, rangeMin: min, rangeMax: max, rangeMinVisible: minVisible, rangeMaxVisible: maxVisible,
  };
}

function getCheckingMethodsAboutBreaks(inverted) {
  return {
    isStartSide: !inverted ? function (pos, breaks, start, end) {
      return pos < breaks[0][start];
    } : function (pos, breaks, start, end) {
      return pos <= breaks[breaks.length - 1][end];
    },
    isEndSide: !inverted ? function (pos, breaks, start, end) {
      return pos >= breaks[breaks.length - 1][end];
    } : function (pos, breaks, start, end) {
      return pos > breaks[0][start];
    },
    isInBreak: !inverted ? function (pos, br, start, end) {
      return pos >= br[start] && pos < br[end];
    } : function (pos, br, start, end) {
      return pos > br[end] && pos <= br[start];
    },
    isBetweenBreaks: !inverted ? function (pos, br, prevBreak, start, end) {
      return pos < br[start] && pos >= prevBreak[end];
    } : function (pos, br, prevBreak, start, end) {
      return pos >= br[end] && pos < prevBreak[start];
    },
    getLength: !inverted ? function (br) {
      return br.length;
    } : function (br, lastBreak) {
      return lastBreak.length - br.length;
    },
    getBreaksSize: !inverted ? function (br) {
      return br.cumulativeWidth;
    } : function (br, lastBreak) {
      return lastBreak.cumulativeWidth - br.cumulativeWidth;
    },
  };
}

const _Translator2d = function (businessRange, canvas, options) {
  this.update(businessRange, canvas, options);
};

_Translator2d.prototype = {
  constructor: _Translator2d,
  reinit() {
    // TODO: parseInt canvas
    const that = this;
    const options = that._options;
    const range = that._businessRange;
    const categories = range.categories || [];
    let script = {};
    const canvasOptions = that._prepareCanvasOptions();
    const visibleCategories = getCategoriesInfo(categories, range.minVisible, range.maxVisible).categories;
    const categoriesLength = visibleCategories.length;
    const conditionalRound = (value, skipRound) => (skipRound ? value : Math.round(value));

    if (range.isEmpty()) {
      script = dummyTranslator;
    } else {
      switch (range.axisType) {
        case 'logarithmic':
          script = logarithmicTranslator;
          break;
        case 'semidiscrete':
          script = intervalTranslator;
          canvasOptions.ratioOfCanvasRange = canvasOptions.canvasLength / (dateUtils.addInterval(canvasOptions.rangeMaxVisible, options.interval) - canvasOptions.rangeMinVisible);
          break;
        case 'discrete':
          script = categoryTranslator;
          that._categories = categories;
          canvasOptions.interval = that._getDiscreteInterval(options.addSpiderCategory ? categoriesLength + 1 : categoriesLength, canvasOptions);
          that._categoriesToPoints = makeCategoriesToPoints(categories);
          if (categoriesLength) {
            canvasOptions.startPointIndex = that._categoriesToPoints[visibleCategories[0].valueOf()];
            that.visibleCategories = visibleCategories;
          }
          break;
        default:
          if (range.dataType === 'datetime') {
            script = datetimeTranslator;
          }
      }
    }
    (that._oldMethods || []).forEach((methodName) => {
      delete that[methodName];
    });
    that._oldMethods = Object.keys(script);
    extend(that, script);

    that._conversionValue = options.conversionValue
      ? (value) => value
      : conditionalRound;

    that.sc = {};
    that._checkingMethodsAboutBreaks = [
      getCheckingMethodsAboutBreaks(false),
      getCheckingMethodsAboutBreaks(that.isInverted()),
    ];
    that._translateBreaks();
    that._calculateSpecialValues();
  },

  _translateBreaks() {
    const breaks = this._breaks;
    const size = this._options.breaksSize;
    let i;
    let b;
    let end;
    let length;
    if (breaks === undefined) {
      return;
    }
    for (i = 0, length = breaks.length; i < length; i++) {
      b = breaks[i];
      end = this.translate(b.to);
      b.end = end;
      b.start = !b.gapSize ? !this.isInverted() ? end - size : end + size : end;
    }
  },

  _checkValueAboutBreaks(breaks, pos, start, end, methods) {
    let i;
    let length;
    let prop = { length: 0, breaksSize: undefined, inBreak: false };
    let br;
    let prevBreak;
    const lastBreak = breaks[breaks.length - 1];

    if (methods.isStartSide(pos, breaks, start, end)) {
      return prop;
    } if (methods.isEndSide(pos, breaks, start, end)) {
      return { length: lastBreak.length, breaksSize: lastBreak.cumulativeWidth, inBreak: false };
    }

    for (i = 0, length = breaks.length; i < length; i++) {
      br = breaks[i];
      prevBreak = breaks[i - 1];
      if (methods.isInBreak(pos, br, start, end)) {
        prop.inBreak = true;
        // @ts-expect-error
        prop.break = br;
        break;
      }
      if (prevBreak && methods.isBetweenBreaks(pos, br, prevBreak, start, end)) {
        prop = { length: methods.getLength(prevBreak, lastBreak), breaksSize: methods.getBreaksSize(prevBreak, lastBreak), inBreak: false };
        break;
      }
    }
    return prop;
  },

  isInverted() {
    return !(this._options.isHorizontal ^ this._businessRange.invert);
  },

  _getDiscreteInterval(categoriesLength, canvasOptions) {
    const correctedCategoriesCount = categoriesLength - (this._options.stick ? 1 : 0);
    return correctedCategoriesCount > 0 ? canvasOptions.canvasLength / correctedCategoriesCount : canvasOptions.canvasLength;
  },

  _prepareCanvasOptions() {
    const that = this;
    const businessRange = that._businessRange;
    const canvasOptions = that._canvasOptions = getCanvasBounds(businessRange);
    const canvas = that._canvas;
    const breaks = that._breaks;
    let length;
    // @ts-expect-error
    canvasOptions.startPadding = canvas.startPadding || 0;
    // @ts-expect-error
    canvasOptions.endPadding = canvas.endPadding || 0;
    if (that._options.isHorizontal) {
      // @ts-expect-error
      canvasOptions.startPoint = canvas.left + canvasOptions.startPadding;
      length = canvas.width;
      // @ts-expect-error
      canvasOptions.endPoint = canvas.width - canvas.right - canvasOptions.endPadding;
      // @ts-expect-error
      canvasOptions.invert = businessRange.invert;
    } else {
      // @ts-expect-error
      canvasOptions.startPoint = canvas.top + canvasOptions.startPadding;
      length = canvas.height;
      // @ts-expect-error
      canvasOptions.endPoint = canvas.height - canvas.bottom - canvasOptions.endPadding;
      // @ts-expect-error
      canvasOptions.invert = !businessRange.invert;// axis inverted because display drawn to bottom
    }
    // @ts-expect-error
    that.canvasLength = canvasOptions.canvasLength = canvasOptions.endPoint - canvasOptions.startPoint;
    // @ts-expect-error
    canvasOptions.rangeDoubleError = 10 ** (getPower(canvasOptions.rangeMax - canvasOptions.rangeMin) - getPower(length) - 2); // B253861
    // @ts-expect-error
    canvasOptions.ratioOfCanvasRange = canvasOptions.canvasLength / (canvasOptions.rangeMaxVisible - canvasOptions.rangeMinVisible);

    if (breaks !== undefined) {
      const visibleRangeLength = canvasOptions.rangeMaxVisible - canvasOptions.rangeMinVisible - breaks[breaks.length - 1].length;
      if (visibleRangeLength !== 0) {
        // @ts-expect-error
        canvasOptions.ratioOfCanvasRange = (canvasOptions.canvasLength - breaks[breaks.length - 1].cumulativeWidth) / visibleRangeLength;
      }
    }

    return canvasOptions;
  },

  updateCanvas(canvas) {
    this._canvas = validateCanvas(canvas);
    this.reinit();
  },

  updateBusinessRange(businessRange) {
    const that = this;
    const breaks = businessRange.breaks || [];

    that._userBreaks = businessRange.userBreaks || [];

    that._businessRange = validateBusinessRange(businessRange);

    that._breaks = breaks.length ? prepareBreaks(breaks, that._businessRange) : undefined;

    that.reinit();
  },

  update(businessRange, canvas, options) {
    const that = this;
    that._options = extend(that._options || {}, options);
    that._canvas = validateCanvas(canvas);

    that.updateBusinessRange(businessRange);
  },

  getBusinessRange() {
    return this._businessRange;
  },

  getEventScale(zoomEvent) {
    return zoomEvent.deltaScale || 1;
  },

  getCanvasVisibleArea() {
    return {
      min: this._canvasOptions.startPoint,
      max: this._canvasOptions.endPoint,
    };
  },

  _calculateSpecialValues() {
    const that = this;
    const canvasOptions = that._canvasOptions;
    const startPoint = canvasOptions.startPoint - canvasOptions.startPadding;
    const endPoint = canvasOptions.endPoint + canvasOptions.endPadding;
    const range = that._businessRange;
    const { minVisible } = range;
    const { maxVisible } = range;
    const canvas_position_center_middle = startPoint + canvasOptions.canvasLength / 2;
    let canvas_position_default;

    if (minVisible < 0 && maxVisible > 0 && minVisible !== maxVisible) {
      canvas_position_default = that.translate(0, 1);
    }
    if (!isDefined(canvas_position_default)) {
      // @ts-expect-error
      const invert = range.invert ^ (minVisible < 0 && maxVisible <= 0);
      if (that._options.isHorizontal) {
        canvas_position_default = invert ? endPoint : startPoint;
      } else {
        canvas_position_default = invert ? startPoint : endPoint;
      }
    }

    that.sc = {
      canvas_position_default,
      canvas_position_left: startPoint,
      canvas_position_top: startPoint,
      canvas_position_center: canvas_position_center_middle,
      canvas_position_middle: canvas_position_center_middle,
      canvas_position_right: endPoint,
      canvas_position_bottom: endPoint,
      canvas_position_start: canvasOptions.invert ? endPoint : startPoint,
      canvas_position_end: canvasOptions.invert ? startPoint : endPoint,
    };
  },

  translateSpecialCase(value) {
    return this.sc[value];
  },

  _calculateProjection(distance) {
    const canvasOptions = this._canvasOptions;
    return canvasOptions.invert ? canvasOptions.endPoint - distance : canvasOptions.startPoint + distance;
  },

  _calculateUnProjection(distance) {
    const canvasOptions = this._canvasOptions;
    this._businessRange.dataType === 'datetime' && (distance = Math.round(distance));
    return canvasOptions.invert ? canvasOptions.rangeMaxVisible.valueOf() - distance : canvasOptions.rangeMinVisible.valueOf() + distance;
  },

  getMinBarSize(minBarSize) {
    const visibleArea = this.getCanvasVisibleArea();
    const minValue = this.from(visibleArea.min + minBarSize);

    return _abs(this.from(visibleArea.min) - (!isDefined(minValue) ? this.from(visibleArea.max) : minValue));
  },

  checkMinBarSize(value, minShownValue) {
    return _abs(value) < minShownValue ? value >= 0 ? minShownValue : -minShownValue : value;
  },

  translate(bp, direction, skipRound) {
    const specialValue = this.translateSpecialCase(bp);

    if (isDefined(specialValue)) {
      return Math.round(specialValue);
    }

    if (isNaN(bp)) {
      return null;
    }
    return this.to(bp, direction, skipRound);
  },

  getInterval(interval) {
    const canvasOptions = this._canvasOptions;
    interval = interval ?? this._businessRange.interval;
    if (interval) {
      return Math.round(canvasOptions.ratioOfCanvasRange * interval);
    }

    return Math.round(canvasOptions.endPoint - canvasOptions.startPoint);
  },

  zoom(translate, scale, wholeRange) {
    const canvasOptions = this._canvasOptions;

    if (canvasOptions.rangeMinVisible.valueOf() === canvasOptions.rangeMaxVisible.valueOf() && translate !== 0) {
      return this.zoomZeroLengthRange(translate, scale);
    }

    const { startPoint } = canvasOptions;
    const { endPoint } = canvasOptions;
    const isInverted = this.isInverted();

    let newStart = (startPoint + translate) / scale;
    let newEnd = (endPoint + translate) / scale;

    wholeRange = wholeRange || {};
    const minPoint = this.to(isInverted ? wholeRange.endValue : wholeRange.startValue);
    const maxPoint = this.to(isInverted ? wholeRange.startValue : wholeRange.endValue);

    let min;
    let max;

    if (minPoint > newStart) {
      newEnd -= newStart - minPoint;
      newStart = minPoint;
      min = isInverted ? wholeRange.endValue : wholeRange.startValue;
    }

    if (maxPoint < newEnd) {
      newStart -= newEnd - maxPoint;
      newEnd = maxPoint;
      max = isInverted ? wholeRange.startValue : wholeRange.endValue;
    }
    if ((maxPoint - minPoint) < (newEnd - newStart)) {
      newStart = minPoint;
      newEnd = maxPoint;
    }

    translate = (endPoint - startPoint) * newStart / (newEnd - newStart) - startPoint;
    scale = ((startPoint + translate) / newStart) || 1;

    min = isDefined(min) ? min : adjust(this.from(newStart, 1));
    max = isDefined(max) ? max : adjust(this.from(newEnd, -1));

    if (scale <= 1) {
      min = this._correctValueAboutBreaks(min, scale === 1 ? translate : -1);
      max = this._correctValueAboutBreaks(max, scale === 1 ? translate : 1);
    }

    if (min > max) {
      min = min > wholeRange.endValue ? wholeRange.endValue : min;
      max = max < wholeRange.startValue ? wholeRange.startValue : max;
    } else {
      min = min < wholeRange.startValue ? wholeRange.startValue : min;
      max = max > wholeRange.endValue ? wholeRange.endValue : max;
    }
    return {
      min,
      max,
      translate: adjust(translate),
      scale: adjust(scale),
    };
  },

  _correctValueAboutBreaks(value, direction) {
    const br = this._userBreaks.filter((br) => value >= br.from && value <= br.to);
    if (br.length) {
      return direction > 0 ? br[0].to : br[0].from;
    }
    return value;
  },

  zoomZeroLengthRange(translate, scale) {
    const canvasOptions = this._canvasOptions;
    const min = canvasOptions.rangeMin;
    const max = canvasOptions.rangeMax;
    const correction = (max.valueOf() !== min.valueOf() ? max.valueOf() - min.valueOf() : _abs(canvasOptions.rangeMinVisible.valueOf() - min.valueOf())) / canvasOptions.canvasLength;
    const isDateTime = isDate(max) || isDate(min);
    const isLogarithmic = this._businessRange.axisType === 'logarithmic';

    let newMin = canvasOptions.rangeMinVisible.valueOf() - correction;
    let newMax = canvasOptions.rangeMaxVisible.valueOf() + correction;

    newMin = isLogarithmic ? adjust(raiseToExt(newMin, canvasOptions.base)) : isDateTime ? new Date(newMin) : newMin;
    newMax = isLogarithmic ? adjust(raiseToExt(newMax, canvasOptions.base)) : isDateTime ? new Date(newMax) : newMax;

    return {
      min: newMin,
      max: newMax,
      translate,
      scale,
    };
  },

  getMinScale(zoom) {
    const { dataType, interval } = this._businessRange;
    if (dataType === 'datetime' && interval === 1) {
      return this.getDateTimeMinScale(zoom);
    }
    return zoom ? 1.1 : 0.9;
  },

  getDateTimeMinScale(zoom) {
    const canvasOptions = this._canvasOptions;
    let length = canvasOptions.canvasLength / canvasOptions.ratioOfCanvasRange;
    // @ts-expect-error
    length += (parseInt(length * 0.1) || 1) * (zoom ? -2 : 2);

    return canvasOptions.canvasLength / (Math.max(length, 1) * canvasOptions.ratioOfCanvasRange);
  },

  getScale(val1, val2) {
    const canvasOptions = this._canvasOptions;
    if (canvasOptions.rangeMax === canvasOptions.rangeMin) {
      return 1;
    }

    val1 = isDefined(val1) ? this.fromValue(val1) : canvasOptions.rangeMin;
    val2 = isDefined(val2) ? this.fromValue(val2) : canvasOptions.rangeMax;
    return (canvasOptions.rangeMax - canvasOptions.rangeMin) / Math.abs(val1 - val2);
  },

  // dxRangeSelector
  isValid(value) {
    const co = this._canvasOptions;

    value = this.fromValue(value);

    return value !== null
            && !isNaN(value)
            && value.valueOf() + co.rangeDoubleError >= co.rangeMin
            && value.valueOf() - co.rangeDoubleError <= co.rangeMax;
  },

  getCorrectValue(value, direction) {
    const that = this;
    const breaks = that._breaks;
    let prop;

    value = that.fromValue(value);

    if (that._breaks) {
      prop = that._checkValueAboutBreaks(breaks, value, 'trFrom', 'trTo', that._checkingMethodsAboutBreaks[0]);
      if (prop.inBreak === true) {
        return that.toValue(direction > 0 ? prop.break.trTo : prop.break.trFrom);
      }
    }

    return that.toValue(value);
  },

  to(bp, direction, skipRound) {
    const range = this.getBusinessRange();

    if (isDefined(range.maxVisible) && isDefined(range.minVisible)
            && range.maxVisible.valueOf() === range.minVisible.valueOf()) {
      if (!isDefined(bp) || range.maxVisible.valueOf() !== bp.valueOf()) {
        return null;
      }
      return this.translateSpecialCase(bp === 0 && this._options.shiftZeroValue ? 'canvas_position_default' : 'canvas_position_middle');
    }

    bp = this.fromValue(bp);
    const that = this;
    const canvasOptions = that._canvasOptions;
    const breaks = that._breaks;
    let prop = { length: 0 };
    let commonBreakSize = 0;

    if (breaks !== undefined) {
      prop = that._checkValueAboutBreaks(breaks, bp, 'trFrom', 'trTo', that._checkingMethodsAboutBreaks[0]);
      // @ts-expect-error
      commonBreakSize = isDefined(prop.breaksSize) ? prop.breaksSize : 0;
    }
    // @ts-expect-error
    if (prop.inBreak === true) {
      if (direction > 0) {
        // @ts-expect-error
        return prop.break.start;
      } if (direction < 0) {
        // @ts-expect-error
        return prop.break.end;
      }
      return null;
    }
    return that._conversionValue(that._calculateProjection((bp - canvasOptions.rangeMinVisible - prop.length)
      * canvasOptions.ratioOfCanvasRange + commonBreakSize), skipRound);
  },

  from(pos, direction) {
    const that = this;
    const breaks = that._breaks;
    let prop = { length: 0 };
    const canvasOptions = that._canvasOptions;
    const { startPoint } = canvasOptions;
    let commonBreakSize = 0;

    if (breaks !== undefined) {
      prop = that._checkValueAboutBreaks(breaks, pos, 'start', 'end', that._checkingMethodsAboutBreaks[1]);
      // @ts-expect-error
      commonBreakSize = isDefined(prop.breaksSize) ? prop.breaksSize : 0;
    }
    // @ts-expect-error
    if (prop.inBreak === true) {
      if (direction > 0) {
        // @ts-expect-error
        return that.toValue(prop.break.trTo);
      } if (direction < 0) {
        // @ts-expect-error
        return that.toValue(prop.break.trFrom);
      }
      return null;
    }

    return that.toValue(that._calculateUnProjection((pos - startPoint - commonBreakSize) / canvasOptions.ratioOfCanvasRange + prop.length));
  },

  isValueProlonged: false,

  // dxRangeSelector specific

  // TODO: Rename to getValueRange
  getRange() {
    return [this.toValue(this._canvasOptions.rangeMin), this.toValue(this._canvasOptions.rangeMax)];
  },

  getScreenRange() {
    return [this._canvasOptions.startPoint, this._canvasOptions.endPoint];
  },

  add(value, diff, dir) {
    return this._add(value, diff, (this._businessRange.invert ? -1 : +1) * dir);
  },

  _add(value, diff, coeff) {
    return this.toValue(this.fromValue(value) + diff * coeff);
  },

  fromValue(value) {
    return value !== null ? Number(value) : null;
  },

  toValue(value) {
    return value !== null ? Number(value) : null;
  },

  ratioOfCanvasRange() {
    return this._canvasOptions.ratioOfCanvasRange;
  },

  convert(value) {
    return value;
  },

  getRangeByMinZoomValue(minZoom, visualRange) {
    if (visualRange.minVisible + minZoom <= this._businessRange.max) {
      return [visualRange.minVisible, visualRange.minVisible + minZoom];
    }
    return [visualRange.maxVisible - minZoom, visualRange.maxVisible];
  },
};

export { _Translator2d as Translator2D };
