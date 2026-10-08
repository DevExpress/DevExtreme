/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable no-bitwise */
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

import { dateUtils } from '@ts/core/utils/m_date';
import { extend } from '@ts/core/utils/m_extend';
import { each } from '@ts/core/utils/m_iterator';
import { adjust } from '@ts/core/utils/m_math';
import { isDate, isDefined } from '@ts/core/utils/m_type';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
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
import type { RangeData, RangeInstance } from '@ts/viz/translators/range';
import { Range } from '@ts/viz/translators/range';

export interface Translator2DOptions {
  isHorizontal?: boolean;
  shiftZeroValue?: boolean;
  conversionValue?: boolean;
  interval?: ThemeValue;
  firstDayOfWeek?: number;
  stick?: boolean;
  breaksSize?: number;
  addSpiderCategory?: boolean;
}

interface TranslatorBreak {
  trFrom: number;
  trTo: number;
  from: ThemeValue;
  to: ThemeValue;
  length: number;
  cumulativeWidth: number;
  start?: number;
  end?: number;
}

interface BreakPosition {
  length: number;
  breaksSize?: number;
  inBreak?: boolean;
  break?: ThemeValue;
}

interface CanvasOptions {
  base?: number;
  rangeMin: ThemeValue;
  rangeMax: ThemeValue;
  rangeMinVisible: ThemeValue;
  rangeMaxVisible: ThemeValue;
  startPadding: number;
  endPadding: number;
  startPoint: number;
  endPoint: number;
  invert: boolean;
  canvasLength: number;
  rangeDoubleError: number;
  ratioOfCanvasRange: number;
  interval?: number;
  startPointIndex?: number;
}

interface BreaksCheckingMethods {
  isStartSide: (pos: number, breaks: TranslatorBreak[], start: string, end: string) => boolean;
  isEndSide: (pos: number, breaks: TranslatorBreak[], start: string, end: string) => boolean;
  isInBreak: (pos: number, br: TranslatorBreak, start: string, end: string) => boolean;
  isBetweenBreaks: (pos: number, br: TranslatorBreak, prevBreak: TranslatorBreak, start: string, end: string) => boolean;
  getLength: (br: TranslatorBreak, lastBreak: TranslatorBreak) => number;
  getBreaksSize: (br: TranslatorBreak, lastBreak: TranslatorBreak) => number;
}

interface ZoomResult {
  min: ThemeValue;
  max: ThemeValue;
  translate: number;
  scale: number;
}

const _abs = Math.abs;

const CANVAS_PROP = ['width', 'height', 'left', 'top', 'bottom', 'right'];

const dummyTranslator = {
  to(this: Translator2DInstance, value: number): number {
    const coord = this._canvasOptions.startPoint + (this._options.conversionValue ? value : Math.round(value));
    return coord > this._canvasOptions.endPoint ? this._canvasOptions.endPoint : coord;
  },
  from(this: Translator2DInstance, value: number): number {
    return value - this._canvasOptions.startPoint;
  },
};

const validateCanvas = function (canvas: ThemeValue): ThemeValue {
  each(CANVAS_PROP, (_, prop) => {
    canvas[prop] = parseInt(canvas[prop]) || 0;
  });
  return canvas;
};

const makeCategoriesToPoints = function (categories: ThemeValue[]): Record<string, number> {
  const categoriesToPoints = {};

  categories.forEach((item, i) => { categoriesToPoints[item.valueOf()] = i; });
  return categoriesToPoints;
};

const validateBusinessRange = function (businessRange: RangeData): ThemeValue {
  if (!(businessRange instanceof Range)) {
    businessRange = new Range(businessRange);
  }
  function validate(valueSelector: string, baseValueSelector: string): void {
    if (!isDefined(businessRange[valueSelector]) && isDefined(businessRange[baseValueSelector])) {
      businessRange[valueSelector] = businessRange[baseValueSelector];
    }
  }
  validate('minVisible', 'min');
  validate('maxVisible', 'max');
  return businessRange;
};

function prepareBreaks(breaks: ThemeValue[], range: RangeInstance): TranslatorBreak[] {
  const transform = range.axisType === 'logarithmic' ? function (value: ThemeValue): number {
    return getLog(value, range.base);
  } : function (value: ThemeValue): ThemeValue {
    return value;
  };
  const array: TranslatorBreak[] = [];
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

function getCanvasBounds(range: RangeInstance): ThemeValue {
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

function getCheckingMethodsAboutBreaks(inverted: boolean): BreaksCheckingMethods {
  return {
    isStartSide: !inverted ? function (pos, breaks, start, end): boolean {
      return pos < breaks[0][start];
    } : function (pos, breaks, start, end): boolean {
      return pos <= breaks[breaks.length - 1][end];
    },
    isEndSide: !inverted ? function (pos, breaks, start, end): boolean {
      return pos >= breaks[breaks.length - 1][end];
    } : function (pos, breaks, start, end): boolean {
      return pos > breaks[0][start];
    },
    isInBreak: !inverted ? function (pos, br, start, end): boolean {
      return pos >= br[start] && pos < br[end];
    } : function (pos, br, start, end): boolean {
      return pos > br[end] && pos <= br[start];
    },
    isBetweenBreaks: !inverted ? function (pos, br, prevBreak, start, end): boolean {
      return pos < br[start] && pos >= prevBreak[end];
    } : function (pos, br, prevBreak, start, end): boolean {
      return pos >= br[end] && pos < prevBreak[start];
    },
    getLength: !inverted ? function (br): number {
      return br.length;
    } : function (br, lastBreak): number {
      return lastBreak.length - br.length;
    },
    getBreaksSize: !inverted ? function (br): number {
      return br.cumulativeWidth;
    } : function (br, lastBreak): number {
      return lastBreak.cumulativeWidth - br.cumulativeWidth;
    },
  };
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
let _Translator2d = class _Translator2d {
  declare _options: Translator2DOptions;

  declare _canvas: ThemeValue;

  declare _businessRange: RangeInstance;

  declare _canvasOptions: CanvasOptions;

  declare _breaks?: TranslatorBreak[];

  declare _userBreaks: ThemeValue[];

  declare _categories: ThemeValue[];

  declare _categoriesToPoints: Record<string, number>;

  declare visibleCategories: ThemeValue[];

  declare _oldMethods?: string[];

  declare _conversionValue: (value: number, skipRound?: boolean) => number;

  declare sc: Record<string, number>;

  declare _checkingMethodsAboutBreaks: BreaksCheckingMethods[];

  declare canvasLength: number;

  declare isValueProlonged: boolean;

  constructor(businessRange: RangeData, canvas: ThemeValue, options: Translator2DOptions) {
    this.update(businessRange, canvas, options);
  }

  reinit(): void {
    // TODO: parseInt canvas
    const options = this._options;
    const range = this._businessRange;
    const categories = range.categories || [];
    let script = {};
    const canvasOptions = this._prepareCanvasOptions();
    const visibleCategories = getCategoriesInfo(categories, range.minVisible, range.maxVisible).categories;
    const categoriesLength = visibleCategories.length;
    const conditionalRound = (value: number, skipRound?: boolean): number => (skipRound ? value : Math.round(value));

    if (range.isEmpty()) {
      script = dummyTranslator;
    } else {
      switch (range.axisType) {
        case 'logarithmic':
          script = logarithmicTranslator;
          break;
        case 'semidiscrete':
          script = intervalTranslator;
          // @ts-expect-error Date arithmetic: addInterval returns a Date for datetime ranges
          canvasOptions.ratioOfCanvasRange = canvasOptions.canvasLength / (dateUtils.addInterval(canvasOptions.rangeMaxVisible, options.interval) - canvasOptions.rangeMinVisible);
          break;
        case 'discrete':
          script = categoryTranslator;
          this._categories = categories;
          canvasOptions.interval = this._getDiscreteInterval(options.addSpiderCategory ? categoriesLength + 1 : categoriesLength, canvasOptions);
          this._categoriesToPoints = makeCategoriesToPoints(categories);
          if (categoriesLength) {
            canvasOptions.startPointIndex = this._categoriesToPoints[visibleCategories[0].valueOf()];
            this.visibleCategories = visibleCategories;
          }
          break;
        default:
          if (range.dataType === 'datetime') {
            script = datetimeTranslator;
          }
      }
    }
    (this._oldMethods || []).forEach((methodName) => {
      delete this[methodName];
    });
    this._oldMethods = Object.keys(script);
    extend(this, script);

    this._conversionValue = options.conversionValue
      ? (value: number): number => value
      : conditionalRound;

    this.sc = {};
    this._checkingMethodsAboutBreaks = [
      getCheckingMethodsAboutBreaks(false),
      getCheckingMethodsAboutBreaks(this.isInverted()),
    ];
    this._translateBreaks();
    this._calculateSpecialValues();
  }

  _translateBreaks(): void {
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
      // @ts-expect-error breaksSize is set whenever breaks are
      b.start = !this.isInverted() ? end - size : end + size;
    }
  }

  _checkValueAboutBreaks(breaks: TranslatorBreak[], pos: number, start: string, end: string, methods: BreaksCheckingMethods): BreakPosition {
    let i;
    let length;
    let prop: BreakPosition = { length: 0, breaksSize: undefined, inBreak: false };
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
        prop.break = br;
        break;
      }
      if (prevBreak && methods.isBetweenBreaks(pos, br, prevBreak, start, end)) {
        prop = { length: methods.getLength(prevBreak, lastBreak), breaksSize: methods.getBreaksSize(prevBreak, lastBreak), inBreak: false };
        break;
      }
    }
    return prop;
  }

  isInverted(): boolean {
    // @ts-expect-error boolean XOR
    return !(this._options.isHorizontal ^ this._businessRange.invert);
  }

  _getDiscreteInterval(categoriesLength: number, canvasOptions: CanvasOptions): number {
    const correctedCategoriesCount = categoriesLength - (this._options.stick ? 1 : 0);
    return correctedCategoriesCount > 0 ? canvasOptions.canvasLength / correctedCategoriesCount : canvasOptions.canvasLength;
  }

  _prepareCanvasOptions(): ThemeValue {
    const businessRange = this._businessRange;
    const canvasOptions = this._canvasOptions = getCanvasBounds(businessRange);
    const canvas = this._canvas;
    const breaks = this._breaks;
    let length;
    canvasOptions.startPadding = canvas.startPadding || 0;
    canvasOptions.endPadding = canvas.endPadding || 0;
    if (this._options.isHorizontal) {
      canvasOptions.startPoint = canvas.left + canvasOptions.startPadding;
      length = canvas.width;
      canvasOptions.endPoint = canvas.width - canvas.right - canvasOptions.endPadding;
      canvasOptions.invert = businessRange.invert;
    } else {
      canvasOptions.startPoint = canvas.top + canvasOptions.startPadding;
      length = canvas.height;
      canvasOptions.endPoint = canvas.height - canvas.bottom - canvasOptions.endPadding;
      canvasOptions.invert = !businessRange.invert;// axis inverted because display drawn to bottom
    }
    this.canvasLength = canvasOptions.canvasLength = canvasOptions.endPoint - canvasOptions.startPoint;
    canvasOptions.rangeDoubleError = 10 ** (getPower(canvasOptions.rangeMax - canvasOptions.rangeMin) - getPower(length) - 2); // B253861
    canvasOptions.ratioOfCanvasRange = canvasOptions.canvasLength / (canvasOptions.rangeMaxVisible - canvasOptions.rangeMinVisible);

    if (breaks !== undefined) {
      const visibleRangeLength = canvasOptions.rangeMaxVisible - canvasOptions.rangeMinVisible - breaks[breaks.length - 1].length;
      if (visibleRangeLength !== 0) {
        canvasOptions.ratioOfCanvasRange = (canvasOptions.canvasLength - breaks[breaks.length - 1].cumulativeWidth) / visibleRangeLength;
      }
    }

    return canvasOptions;
  }

  updateCanvas(canvas: ThemeValue): void {
    this._canvas = validateCanvas(canvas);
    this.reinit();
  }

  updateBusinessRange(businessRange: RangeData): void {
    const breaks = businessRange.breaks || [];

    this._userBreaks = businessRange.userBreaks || [];

    this._businessRange = validateBusinessRange(businessRange);

    this._breaks = breaks.length ? prepareBreaks(breaks, this._businessRange) : undefined;

    this.reinit();
  }

  update(businessRange: RangeData, canvas: ThemeValue, options?: Translator2DOptions): void {
    this._options = extend(this._options || {}, options);
    this._canvas = validateCanvas(canvas);

    this.updateBusinessRange(businessRange);
  }

  getBusinessRange(): RangeInstance {
    return this._businessRange;
  }

  getEventScale(zoomEvent: { deltaScale?: number }): number {
    return zoomEvent.deltaScale || 1;
  }

  getCanvasVisibleArea(): { min: number; max: number } {
    return {
      min: this._canvasOptions.startPoint,
      max: this._canvasOptions.endPoint,
    };
  }

  _calculateSpecialValues(): void {
    const canvasOptions = this._canvasOptions;
    const startPoint = canvasOptions.startPoint - canvasOptions.startPadding;
    const endPoint = canvasOptions.endPoint + canvasOptions.endPadding;
    const range = this._businessRange;
    const { minVisible } = range;
    const { maxVisible } = range;
    const canvas_position_center_middle = startPoint + canvasOptions.canvasLength / 2;
    let canvas_position_default;

    if (minVisible < 0 && maxVisible > 0 && minVisible !== maxVisible) {
      canvas_position_default = this.translate(0, 1);
    }
    if (!isDefined(canvas_position_default)) {
      // @ts-expect-error boolean XOR
      const invert = range.invert ^ (minVisible < 0 && maxVisible <= 0);
      if (this._options.isHorizontal) {
        canvas_position_default = invert ? endPoint : startPoint;
      } else {
        canvas_position_default = invert ? startPoint : endPoint;
      }
    }

    this.sc = {
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
  }

  translateSpecialCase(value: ThemeValue): number | undefined {
    return this.sc[value];
  }

  _calculateProjection(distance: number): number {
    const canvasOptions = this._canvasOptions;
    return canvasOptions.invert ? canvasOptions.endPoint - distance : canvasOptions.startPoint + distance;
  }

  _calculateUnProjection(distance: number): number {
    const canvasOptions = this._canvasOptions;
    this._businessRange.dataType === 'datetime' && (distance = Math.round(distance));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- valueOf() of a number or a Date
    return canvasOptions.invert ? canvasOptions.rangeMaxVisible.valueOf() - distance : canvasOptions.rangeMinVisible.valueOf() + distance;
  }

  getMinBarSize(minBarSize: number): number {
    const visibleArea = this.getCanvasVisibleArea();
    const minValue = this.from(visibleArea.min + minBarSize);

    return _abs(this.from(visibleArea.min) - (!isDefined(minValue) ? this.from(visibleArea.max) : minValue));
  }

  checkMinBarSize(value: number, minShownValue: number): number {
    return _abs(value) < minShownValue ? value >= 0 ? minShownValue : -minShownValue : value;
  }

  translate(bp: ThemeValue, direction?: number, skipRound?: boolean): ThemeValue {
    const specialValue = this.translateSpecialCase(bp);

    if (isDefined(specialValue)) {
      return Math.round(specialValue);
    }

    if (isNaN(bp)) {
      return null;
    }
    return this.to(bp, direction, skipRound);
  }

  getInterval(interval?: number): number {
    const canvasOptions = this._canvasOptions;
    interval = interval ?? this._businessRange.interval;
    if (interval) {
      return Math.round(canvasOptions.ratioOfCanvasRange * interval);
    }

    return Math.round(canvasOptions.endPoint - canvasOptions.startPoint);
  }

  zoom(translate: number, scale: number, wholeRange?: ThemeValue): ZoomResult {
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
  }

  _correctValueAboutBreaks(value: ThemeValue, direction: number): ThemeValue {
    const br = this._userBreaks.filter((br) => value >= br.from && value <= br.to);
    if (br.length) {
      return direction > 0 ? br[0].to : br[0].from;
    }
    return value;
  }

  zoomZeroLengthRange(translate: number, scale: number): ZoomResult {
    const canvasOptions = this._canvasOptions;
    const min = canvasOptions.rangeMin;
    const max = canvasOptions.rangeMax;
    const correction = (max.valueOf() !== min.valueOf() ? max.valueOf() - min.valueOf() : _abs(canvasOptions.rangeMinVisible.valueOf() - min.valueOf())) / canvasOptions.canvasLength;
    const isDateTime = isDate(max) || isDate(min);
    const isLogarithmic = this._businessRange.axisType === 'logarithmic';

    let newMin = canvasOptions.rangeMinVisible.valueOf() - correction;
    let newMax = canvasOptions.rangeMaxVisible.valueOf() + correction;

    newMin = (isLogarithmic ? adjust(raiseToExt(newMin, canvasOptions.base)) : isDateTime ? new Date(newMin) : newMin) as number;
    newMax = (isLogarithmic ? adjust(raiseToExt(newMax, canvasOptions.base)) : isDateTime ? new Date(newMax) : newMax) as number;

    return {
      min: newMin,
      max: newMax,
      translate,
      scale,
    };
  }

  getMinScale(zoom: boolean): number {
    const { dataType, interval } = this._businessRange;
    if (dataType === 'datetime' && interval === 1) {
      return this.getDateTimeMinScale(zoom);
    }
    return zoom ? 1.1 : 0.9;
  }

  getDateTimeMinScale(zoom: boolean): number {
    const canvasOptions = this._canvasOptions;
    let length = canvasOptions.canvasLength / canvasOptions.ratioOfCanvasRange;
    // @ts-expect-error parseInt truncates a number here
    length += (parseInt(length * 0.1) || 1) * (zoom ? -2 : 2);

    return canvasOptions.canvasLength / (Math.max(length, 1) * canvasOptions.ratioOfCanvasRange);
  }

  getScale(val1?: ThemeValue, val2?: ThemeValue): number {
    const canvasOptions = this._canvasOptions;
    if (canvasOptions.rangeMax === canvasOptions.rangeMin) {
      return 1;
    }

    val1 = isDefined(val1) ? this.fromValue(val1) : canvasOptions.rangeMin;
    val2 = isDefined(val2) ? this.fromValue(val2) : canvasOptions.rangeMax;
    return (canvasOptions.rangeMax - canvasOptions.rangeMin) / Math.abs(val1 - val2);
  }

  // dxRangeSelector
  isValid(value: ThemeValue): boolean {
    const co = this._canvasOptions;

    value = this.fromValue(value);

    return value !== null
            && !isNaN(value)
            && value.valueOf() + co.rangeDoubleError >= co.rangeMin
            && value.valueOf() - co.rangeDoubleError <= co.rangeMax;
  }

  getCorrectValue(value: ThemeValue, direction: number): ThemeValue {
    const breaks = this._breaks;
    let prop;

    value = this.fromValue(value);

    if (this._breaks) {
      // @ts-expect-error the guard above checks this._breaks
      prop = this._checkValueAboutBreaks(breaks, value, 'trFrom', 'trTo', this._checkingMethodsAboutBreaks[0]);
      if (prop.inBreak === true) {
        return this.toValue(direction > 0 ? prop.break.trTo : prop.break.trFrom);
      }
    }

    return this.toValue(value);
  }

  to(bp: ThemeValue, direction?: ThemeValue, skipRound?: boolean): ThemeValue {
    const range = this.getBusinessRange();

    if (isDefined(range.maxVisible) && isDefined(range.minVisible)
            && range.maxVisible.valueOf() === range.minVisible.valueOf()) {
      if (!isDefined(bp) || range.maxVisible.valueOf() !== bp.valueOf()) {
        return null;
      }
      return this.translateSpecialCase(bp === 0 && this._options.shiftZeroValue ? 'canvas_position_default' : 'canvas_position_middle');
    }

    bp = this.fromValue(bp);
    const canvasOptions = this._canvasOptions;
    const breaks = this._breaks;
    let prop: BreakPosition = { length: 0 };
    let commonBreakSize = 0;

    if (breaks !== undefined) {
      prop = this._checkValueAboutBreaks(breaks, bp, 'trFrom', 'trTo', this._checkingMethodsAboutBreaks[0]);
      commonBreakSize = isDefined(prop.breaksSize) ? prop.breaksSize : 0;
    }
    if (prop.inBreak === true) {
      if (direction > 0) {
        return prop.break.start;
      } if (direction < 0) {
        return prop.break.end;
      }
      return null;
    }
    return this._conversionValue(this._calculateProjection((bp - canvasOptions.rangeMinVisible - prop.length)
      * canvasOptions.ratioOfCanvasRange + commonBreakSize), skipRound);
  }

  from(pos: number, direction?: ThemeValue): ThemeValue {
    const breaks = this._breaks;
    let prop: BreakPosition = { length: 0 };
    const canvasOptions = this._canvasOptions;
    const { startPoint } = canvasOptions;
    let commonBreakSize = 0;

    if (breaks !== undefined) {
      prop = this._checkValueAboutBreaks(breaks, pos, 'start', 'end', this._checkingMethodsAboutBreaks[1]);
      commonBreakSize = isDefined(prop.breaksSize) ? prop.breaksSize : 0;
    }
    if (prop.inBreak === true) {
      if (direction > 0) {
        return this.toValue(prop.break.trTo);
      } if (direction < 0) {
        return this.toValue(prop.break.trFrom);
      }
      return null;
    }

    return this.toValue(this._calculateUnProjection((pos - startPoint - commonBreakSize) / canvasOptions.ratioOfCanvasRange + prop.length));
  }

  // dxRangeSelector specific

  // TODO: Rename to getValueRange
  getRange(): [ThemeValue, ThemeValue] {
    return [this.toValue(this._canvasOptions.rangeMin), this.toValue(this._canvasOptions.rangeMax)];
  }

  getScreenRange(): number[] {
    return [this._canvasOptions.startPoint, this._canvasOptions.endPoint];
  }

  add(value: ThemeValue, diff: number, dir: number): ThemeValue {
    return this._add(value, diff, (this._businessRange.invert ? -1 : +1) * dir);
  }

  _add(value: ThemeValue, diff: number, coeff: number): ThemeValue {
    return this.toValue(this.fromValue(value) + diff * coeff);
  }

  fromValue(value: ThemeValue): ThemeValue {
    return value !== null ? Number(value) : null;
  }

  toValue(value: ThemeValue): ThemeValue {
    return value !== null ? Number(value) : null;
  }

  ratioOfCanvasRange(): number {
    return this._canvasOptions.ratioOfCanvasRange;
  }

  convert(value: ThemeValue): ThemeValue {
    return value;
  }

  getRangeByMinZoomValue(minZoom: number, visualRange: ThemeValue): [ThemeValue, ThemeValue] {
    if (visualRange.minVisible + minZoom <= this._businessRange.max) {
      return [visualRange.minVisible, visualRange.minVisible + minZoom];
    }
    return [visualRange.maxVisible - minZoom, visualRange.maxVisible];
  }
};

Object.assign(_Translator2d.prototype, {
  isValueProlonged: false,
});

export type Translator2DInstance = InstanceType<typeof _Translator2d>;

export { _Translator2d as Translator2D };

/// #DEBUG
export function DEBUG_set_Translator2D(value: typeof _Translator2d): void {
  _Translator2d = value;
}
/// #ENDDEBUG
