/* eslint-disable max-classes-per-file */

import registerComponent from '@js/core/component_registrator';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { adjust } from '@js/core/utils/math';
import {
  isDate, isDefined, isFunction, isNumeric, isPlainObject, type as getType,
} from '@js/core/utils/type';
import formatHelper from '@ts/core/format_helper';
import type DOMComponent from '@ts/core/widget/dom_component';
import constants from '@ts/viz/axes/axes_constants';
import { Axis } from '@ts/viz/axes/base_axis';
import { tickGenerator } from '@ts/viz/axes/tick_generator';
import { correctValueType, getParser } from '@ts/viz/components/parse_utils';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
// PLUGINS_SECTION
import BaseWidget from '@ts/viz/core/base_widget';
import { plugin as dataSourcePlugin } from '@ts/viz/core/data_source';
import { plugin as exportPlugin } from '@ts/viz/core/export';
import { setupWidgetPrototype } from '@ts/viz/core/helpers';
import { plugin as LoadingIndicatorPlugin } from '@ts/viz/core/loading_indicator';
import { plugin as titlePlugin } from '@ts/viz/core/title';
import {
  convertVisualRangeObject,
  getCategoriesInfo,
  getLog,
  getVizRangeObject as parseValue,
  normalizeEnum,
  patchFontOptions,
  rangesAreEqual,
} from '@ts/viz/core/utils';
import { consts, formatValue, HEIGHT_COMPACT_MODE } from '@ts/viz/range_selector/common';
import { RangeView } from '@ts/viz/range_selector/range_view';
import { SeriesDataSource } from '@ts/viz/range_selector/series_data_source';
import { SlidersController } from '@ts/viz/range_selector/sliders_controller';
import { Tracker } from '@ts/viz/range_selector/tracker';
import { Range } from '@ts/viz/translators/range';

const START_VALUE = 'startValue';
const END_VALUE = 'endValue';
const DATETIME = 'datetime';
const VALUE = 'value';
const DISCRETE = 'discrete';
const SEMIDISCRETE = 'semidiscrete';
const STRING = 'string';
const VALUE_CHANGED = `${VALUE}Changed`;
const CONTAINER_BACKGROUND_COLOR = 'containerBackgroundColor';
const SLIDER_MARKER = 'sliderMarker';
const OPTION_BACKGROUND = 'background';
const LOGARITHMIC = 'logarithmic';
const KEEP = 'keep';
const SHIFT = 'shift';
const RESET = 'reset';
const INVISIBLE_POS = -1000;
const SEMIDISCRETE_GRID_SPACING_FACTOR = 50;
const DEFAULT_AXIS_DIVISION_FACTOR = 30;
const DEFAULT_MINOR_AXIS_DIVISION_FACTOR = 15;
const DEFAULT_LOGARITHM_BASE = 10;

interface Indents {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface TickIntervalsInfo {
  tickInterval: ThemeValue;
  minorTickInterval: ThemeValue;
  bounds: ThemeValue;
  ticks: ThemeValue[];
}

interface IntervalCustomTicks {
  intervals: ThemeValue[];
  altIntervals?: ThemeValue[];
}

type DateMarkerVisibilityChecker = (
  isDateScale: boolean,
  isMarkerVisible: boolean,
  min: ThemeValue,
  max: ThemeValue,
  tickInterval: ThemeValue,
) => boolean;

interface Canvas {
  left: number;
  top: number;
  width: number;
  height: number;
  right?: number;
  bottom?: number;
}

function getTextBBox(renderer: ThemeValue, text: string, fontOptions: ThemeValue): ThemeValue {
  const textElement = renderer.text(text, INVISIBLE_POS, INVISIBLE_POS)
    .css(patchFontOptions(fontOptions))
    .append(renderer.root);

  const textBBox = textElement.getBBox();
  textElement.remove();
  return textBBox;
}

function calculateMarkerHeight(
  renderer: ThemeValue,
  value: ThemeValue,
  sliderMarkerOptions: ThemeValue,
): number {
  const formattedText = value === undefined
    ? consts.emptySliderMarkerText
    : formatValue(value, sliderMarkerOptions);
  const textBBox = getTextBBox(renderer, formattedText, sliderMarkerOptions.font);
  return Math.ceil(textBBox.height) + 2 * sliderMarkerOptions.paddingTopBottom + consts.pointerSize;
}

function calculateScaleLabelHalfWidth(
  renderer: ThemeValue,
  value: ThemeValue,
  scaleOptions: ThemeValue,
  tickIntervalsInfo: TickIntervalsInfo,
): number {
  const formattedText = formatValue(
    value,
    scaleOptions.label,
    tickIntervalsInfo,
    scaleOptions.valueType,
    scaleOptions.type,
    scaleOptions.logarithmBase,
  );
  const textBBox = getTextBBox(renderer, formattedText, scaleOptions.label.font);

  return Math.ceil(textBBox.width / 2);
}

function calculateIndents(
  renderer: ThemeValue,
  scale: ThemeValue,
  sliderMarkerOptions: ThemeValue,
  indentOptions: ThemeValue,
  tickIntervalsInfo: TickIntervalsInfo,
): Indents {
  let leftScaleLabelWidth = 0;
  let rightScaleLabelWidth = 0;
  const ticks = scale.type === 'semidiscrete' ? scale.customTicks : tickIntervalsInfo.ticks;
  const indents = indentOptions || {};

  const placeholderWidthLeftOption = indents.left;
  const placeholderWidthRightOption = indents.right;

  let { placeholderHeight } = sliderMarkerOptions;

  if (sliderMarkerOptions.visible) {
    const leftMarkerHeight = calculateMarkerHeight(renderer, scale.startValue, sliderMarkerOptions);
    const rightMarkerHeight = calculateMarkerHeight(renderer, scale.endValue, sliderMarkerOptions);
    if (placeholderHeight === undefined) {
      placeholderHeight = Math.max(leftMarkerHeight, rightMarkerHeight);
    }
  }

  if (scale.label.visible) {
    const startTickValue = isDefined(scale.startValue) ? ticks[0] : undefined;
    const endTickValue = isDefined(scale.endValue) ? ticks[ticks.length - 1] : undefined;
    leftScaleLabelWidth = calculateScaleLabelHalfWidth(
      renderer,
      startTickValue,
      scale,
      tickIntervalsInfo,
    );
    rightScaleLabelWidth = calculateScaleLabelHalfWidth(
      renderer,
      endTickValue,
      scale,
      tickIntervalsInfo,
    );
  }
  const placeholderWidthLeft = placeholderWidthLeftOption !== undefined
    ? placeholderWidthLeftOption
    : leftScaleLabelWidth;
  // T240698
  const placeholderWidthRight = (placeholderWidthRightOption !== undefined
    ? placeholderWidthRightOption
    : rightScaleLabelWidth) || 1;

  return {
    left: placeholderWidthLeft,
    right: placeholderWidthRight,
    top: placeholderHeight || 0,
    bottom: 0,
  };
}

function calculateValueType(firstValue: ThemeValue, secondValue: ThemeValue): string {
  const typeFirstValue = getType(firstValue);
  const typeSecondValue = getType(secondValue);
  const validType = (type: string): boolean => typeFirstValue === type || typeSecondValue === type;

  if (validType('date')) {
    return DATETIME;
  }
  if (validType('number')) {
    return 'numeric';
  }
  return validType(STRING) ? STRING : '';
}

function showScaleMarkers(scaleOptions: ThemeValue): boolean {
  return Boolean(scaleOptions.valueType === DATETIME && scaleOptions.marker.visible);
}

function updateTranslatorRangeInterval(
  translatorRange: ThemeValue,
  scaleOptions: ThemeValue,
): void {
  let intervalX = scaleOptions.minorTickInterval || scaleOptions.tickInterval;
  if (scaleOptions.valueType === 'datetime') {
    intervalX = dateUtils.dateToMilliseconds(intervalX);
  }
  translatorRange.addRange({ interval: intervalX });
}

function checkLogarithmicOptions(
  options: ThemeValue,
  defaultLogarithmBase: number,
  incidentOccurred: ThemeValue,
): void {
  if (!options) {
    return;
  }

  const base = options.logarithmBase;
  if ((options.type === LOGARITHMIC && base <= 0) || (base && !isNumeric(base))) {
    options.logarithmBase = defaultLogarithmBase;
    incidentOccurred('E2104');
  } else if (options.type !== LOGARITHMIC) {
    options.logarithmBase = undefined;
  }
}

function calculateScaleAreaHeight(
  renderer: ThemeValue,
  scaleOptions: ThemeValue,
  visibleMarkers: boolean,
  tickIntervalsInfo: TickIntervalsInfo,
): number {
  const labelScaleOptions = scaleOptions.label;
  const markerScaleOptions = scaleOptions.marker;
  const { placeholderHeight } = scaleOptions;
  const ticks = scaleOptions.type === 'semidiscrete'
    ? scaleOptions.customTicks
    : tickIntervalsInfo.ticks;
  const text = formatValue(ticks[0], labelScaleOptions);

  if (placeholderHeight) {
    return Number(placeholderHeight);
  }
  const labelHeight: number = labelScaleOptions.visible
    ? labelScaleOptions.topIndent + getTextBBox(renderer, text, labelScaleOptions.font).height
    : 0;
  const markerHeight: number = visibleMarkers
    ? markerScaleOptions.topIndent + markerScaleOptions.separatorHeight
    : 0;
  return labelHeight + markerHeight;
}

function getMinorTickIntervalUnit(
  tickInterval: ThemeValue,
  minorTickInterval: ThemeValue,
  withCorrection: boolean,
): ThemeValue {
  let interval = dateUtils.getDateUnitInterval(minorTickInterval);
  const majorUnit = dateUtils.getDateUnitInterval(tickInterval);
  const idx = dateUtils.dateUnitIntervals.indexOf(interval);

  if (withCorrection && interval === majorUnit && idx > 0) {
    interval = dateUtils.dateUnitIntervals[idx - 1];
  }

  return interval;
}

function getNextTickInterval(
  tickInterval: ThemeValue,
  minorTickInterval: ThemeValue,
  isDateType: boolean,
): ThemeValue {
  if (!tickInterval) {
    return minorTickInterval;
  }
  if (isDateType) {
    return dateUtils.getNextDateUnit(tickInterval, undefined);
  }
  return tickInterval + minorTickInterval;
}

function calculateTickIntervalsForSemidiscreteScale(
  scaleOptions: ThemeValue,
  min: ThemeValue,
  max: ThemeValue,
  screenDelta: number,
): TickIntervalsInfo {
  const { minorTickInterval } = scaleOptions;
  let { tickInterval } = scaleOptions;
  const isDateType = scaleOptions.valueType === 'datetime';
  const gridSpacingFactor = scaleOptions.axisDivisionFactor || {};

  if (!tickInterval) {
    let interval = getNextTickInterval(tickInterval, minorTickInterval, isDateType);
    do {
      if (tickInterval !== interval) {
        tickInterval = interval;
      } else {
        break;
      }

      if (isDateType) {
        interval = dateUtils.dateToMilliseconds(tickInterval);
      }

      const tickCountByInterval = Math.ceil((max - min) / interval);
      const factor = gridSpacingFactor[tickInterval] || SEMIDISCRETE_GRID_SPACING_FACTOR;
      const tickCountByScreen = Math.floor(screenDelta / factor) || 1;
      if (!(tickCountByInterval > tickCountByScreen)) {
        break;
      }
      interval = getNextTickInterval(tickInterval, minorTickInterval, isDateType);
    } while (interval);
  }

  return {
    tickInterval,
    minorTickInterval,
    bounds: {
      minVisible: min, maxVisible: max,
    },
    ticks: [],
  };
}

function updateTickIntervals(
  scaleOptions: ThemeValue,
  screenDelta: number,
  incidentOccurred: ThemeValue,
  range: ThemeValue,
): TickIntervalsInfo {
  const min = isDefined(range.minVisible) ? range.minVisible : range.min;
  const max = isDefined(range.maxVisible) ? range.maxVisible : range.max;
  const categoriesInfo = scaleOptions._categoriesInfo;

  if (scaleOptions.type === SEMIDISCRETE) {
    return calculateTickIntervalsForSemidiscreteScale(scaleOptions, min, max, screenDelta);
  }

  const ticksInfo = tickGenerator({
    axisType: scaleOptions.type,
    dataType: scaleOptions.valueType,
    logBase: scaleOptions.logarithmBase,
    allowNegatives: true,
    linearThreshold: Math.abs(scaleOptions.linearThreshold || 0),

    axisDivisionFactor: scaleOptions.axisDivisionFactor,
    minorAxisDivisionFactor: scaleOptions.minorAxisDivisionFactor,
    calculateMinors: true,

    allowDecimals: scaleOptions.allowDecimals,
    endOnTick: scaleOptions.endOnTick,

    incidentOccurred,
    rangeIsEmpty: range.isEmpty(),
  })(
    {
      min,
      max,
      categories: isDefined(categoriesInfo) ? categoriesInfo.categories : [],
    },
    screenDelta,
    scaleOptions.tickInterval,
    scaleOptions.forceUserTickInterval,
    undefined,
    scaleOptions.minorTickInterval,
    scaleOptions.minorTickCount,
  );

  const { length } = ticksInfo.ticks;
  const bounds = {
    minVisible: ticksInfo.ticks[0] < min ? ticksInfo.ticks[0] : min,
    maxVisible: ticksInfo.ticks[length - 1] > max ? ticksInfo.ticks[length - 1] : max,
  };

  return {
    tickInterval: ticksInfo.tickInterval,
    minorTickInterval: scaleOptions.minorTickInterval === 0 ? 0 : ticksInfo.minorTickInterval,
    bounds,
    ticks: ticksInfo.ticks,
  };
}

function getFirstDayOfWeek(options: ThemeValue): ThemeValue {
  return options.workWeek?.[0];
}

function correctValueByInterval(
  value: ThemeValue,
  isDateValue: boolean,
  interval: ThemeValue,
  firstDayOfWeek: ThemeValue,
): ThemeValue {
  if (!isDefined(value)) {
    return value;
  }
  return isDateValue
    ? dateUtils.correctDateWithUnitBeginning(new Date(value), interval, null, firstDayOfWeek)
    : adjust(Math.floor(adjust(value / interval)) * interval);
}

interface DiscreteRange {
  range: ThemeValue;
  categories: ThemeValue[];
  categoriesInfo: ThemeValue;
}

function buildDiscreteRange(
  translatorRange: ThemeValue,
  seriesDataSource: ThemeValue,
  scaleOptions: ThemeValue,
  startValue: ThemeValue,
  endValue: ThemeValue,
): DiscreteRange {
  const rangeForCategories = new Range({
    minVisible: startValue,
    maxVisible: endValue,
  });

  rangeForCategories.addRange(translatorRange);

  const ownCategories = seriesDataSource
    ? seriesDataSource.argCategories
    : scaleOptions.categories || (startValue && endValue && [startValue, endValue]);
  const categories = ownCategories || [];

  return {
    range: rangeForCategories,
    categories,
    categoriesInfo: getCategoriesInfo(categories, startValue, endValue),
  };
}

interface RangeBounds {
  inverted: boolean;
  minValue: ThemeValue;
  maxValue: ThemeValue;
}

function calculateRangeBounds(
  startValue: ThemeValue,
  endValue: ThemeValue,
  categoriesInfo: ThemeValue,
): RangeBounds {
  if (isDefined(startValue) && isDefined(endValue)) {
    const inverted = categoriesInfo ? categoriesInfo.inverted : startValue > endValue;
    if (categoriesInfo) {
      return { inverted, minValue: categoriesInfo.start, maxValue: categoriesInfo.end };
    }
    return {
      inverted,
      minValue: inverted ? endValue : startValue,
      maxValue: inverted ? startValue : endValue,
    };
  }
  if (isDefined(startValue) || isDefined(endValue)) {
    return { inverted: false, minValue: startValue, maxValue: endValue };
  }
  if (categoriesInfo) {
    return { inverted: false, minValue: categoriesInfo.start, maxValue: categoriesInfo.end };
  }
  return { inverted: false, minValue: undefined, maxValue: undefined };
}

function calculateTranslatorRange(
  seriesDataSource: ThemeValue,
  scaleOptions: ThemeValue,
): ThemeValue {
  let { startValue, endValue } = scaleOptions;
  // TODO: There should be something like "seriesDataSource.getArgumentRange()"
  let translatorRange = seriesDataSource ? seriesDataSource.getBoundRange().arg : new Range();
  const isDateValue = scaleOptions.valueType === 'datetime';
  const firstDayOfWeek = getFirstDayOfWeek(scaleOptions);
  const { minRange } = scaleOptions;

  const discreteRange = scaleOptions.type === DISCRETE
    ? buildDiscreteRange(translatorRange, seriesDataSource, scaleOptions, startValue, endValue)
    : undefined;
  const categories = discreteRange?.categories;
  const categoriesInfo = discreteRange?.categoriesInfo;

  if (discreteRange) {
    translatorRange = discreteRange.range;
    scaleOptions._categoriesInfo = categoriesInfo;
  }

  if (scaleOptions.type === SEMIDISCRETE) {
    startValue = correctValueByInterval(
      scaleOptions.startValue,
      isDateValue,
      minRange,
      firstDayOfWeek,
    );
    scaleOptions.startValue = startValue;
    endValue = correctValueByInterval(scaleOptions.endValue, isDateValue, minRange, firstDayOfWeek);
    scaleOptions.endValue = endValue;

    translatorRange.minVisible = correctValueByInterval(
      translatorRange.minVisible,
      isDateValue,
      minRange,
      firstDayOfWeek,
    );
    translatorRange.maxVisible = correctValueByInterval(
      translatorRange.maxVisible,
      isDateValue,
      minRange,
      firstDayOfWeek,
    );

    translatorRange.min = correctValueByInterval(
      translatorRange.min,
      isDateValue,
      minRange,
      firstDayOfWeek,
    );
    translatorRange.max = correctValueByInterval(
      translatorRange.max,
      isDateValue,
      minRange,
      firstDayOfWeek,
    );
  }

  const { inverted, minValue, maxValue } = calculateRangeBounds(
    startValue,
    endValue,
    categoriesInfo,
  );

  translatorRange.addRange({
    invert: inverted,
    min: minValue,
    max: maxValue,
    minVisible: minValue,
    maxVisible: maxValue,
    dataType: scaleOptions.valueType,
  });

  translatorRange.addRange({
    categories: !seriesDataSource ? categories : undefined,
    base: scaleOptions.logarithmBase,
    axisType: scaleOptions.type,
    dataType: scaleOptions.valueType,
  });
  if (seriesDataSource) {
    translatorRange.sortCategories(categories);
  }

  return translatorRange;
}

function startEndNotDefined(start: ThemeValue, end: ThemeValue): boolean {
  return !isDefined(start) || !isDefined(end);
}

function getDateMarkerVisibilityChecker(
  screenDelta: number,
): DateMarkerVisibilityChecker {
  return function checkDateMarkerVisibility(
    isDateScale: boolean,
    isMarkerVisible: boolean,
    min: ThemeValue,
    max: ThemeValue,
    tickInterval: ThemeValue,
  ): boolean {
    if (isMarkerVisible && isDateScale) {
      const yearsCount = Math.ceil((max - min) / dateUtils.dateToMilliseconds('year')) + 1;
      if (!isDefined(tickInterval) || tickInterval.years || tickInterval.months >= 6
        || (screenDelta / SEMIDISCRETE_GRID_SPACING_FACTOR < yearsCount)) {
        return false;
      }
    }
    return isMarkerVisible;
  };
}

function getIntervalCustomTicks(options: ThemeValue): IntervalCustomTicks {
  let min = options.startValue;
  let max = options.endValue;
  const isDateValue = options.valueType === 'datetime';
  const firstDayOfWeek = getFirstDayOfWeek(options);
  const { tickInterval } = options;
  const res: IntervalCustomTicks = {
    intervals: [],
  };

  if (!isDefined(min) || !isDefined(max)) {
    return res;
  }
  res.intervals = dateUtils.getSequenceByInterval(min, max, options.minorTickInterval);

  if (tickInterval !== options.minorTickInterval) {
    res.altIntervals = res.intervals;

    min = correctValueByInterval(min, isDateValue, tickInterval, firstDayOfWeek);
    max = correctValueByInterval(max, isDateValue, tickInterval, firstDayOfWeek);
    res.intervals = dateUtils.getSequenceByInterval(min, max, tickInterval);
    const [firstAltInterval] = res.altIntervals;
    res.intervals[0] = firstAltInterval;
  }

  return res;
}

function updateScaleOptions(
  scaleOptions: ThemeValue,
  seriesDataSource: ThemeValue,
  translatorRange: ThemeValue,
  tickIntervalsInfo: TickIntervalsInfo,
  checkDateMarkerVisibility: ThemeValue,
): void {
  let isEmptyInterval = false;
  const categoriesInfo = scaleOptions._categoriesInfo;
  const isDateTime = scaleOptions.valueType === DATETIME;

  if (seriesDataSource && !seriesDataSource.isEmpty() && !translatorRange.isEmpty()) {
    const { bounds } = tickIntervalsInfo;
    translatorRange.addRange(bounds);
    scaleOptions.startValue = translatorRange.invert ? bounds.maxVisible : bounds.minVisible;
    scaleOptions.endValue = translatorRange.invert ? bounds.minVisible : bounds.maxVisible;
  }

  scaleOptions.marker.visible = checkDateMarkerVisibility(
    isDateTime && scaleOptions.type.indexOf(DISCRETE) === -1,
    scaleOptions.marker.visible,
    scaleOptions.startValue,
    scaleOptions.endValue,
    tickIntervalsInfo.tickInterval,
  );

  if (categoriesInfo) {
    scaleOptions.startValue = categoriesInfo.start;
    scaleOptions.endValue = categoriesInfo.end;
  }
  if (scaleOptions.type.indexOf(DISCRETE) === -1) {
    isEmptyInterval = (isDate(scaleOptions.startValue) && isDate(scaleOptions.endValue)
      && (scaleOptions.startValue.getTime() === scaleOptions.endValue.getTime()))
      || (scaleOptions.startValue === scaleOptions.endValue);
  }
  scaleOptions.isEmpty = startEndNotDefined(scaleOptions.startValue, scaleOptions.endValue)
    || isEmptyInterval;

  if (scaleOptions.isEmpty) {
    scaleOptions.startValue = undefined;
    scaleOptions.endValue = undefined;
  } else {
    scaleOptions.minorTickInterval = tickIntervalsInfo.minorTickInterval;
    scaleOptions.tickInterval = tickIntervalsInfo.tickInterval;
    const needsFormat = !isDefined(scaleOptions.label.format)
      || (scaleOptions.type === SEMIDISCRETE
        && scaleOptions.minorTickInterval !== scaleOptions.tickInterval);
    if (isDateTime && needsFormat) {
      if (scaleOptions.type === DISCRETE) {
        scaleOptions.label.format = formatHelper.getDateFormatByTicks(tickIntervalsInfo.ticks);
      } else if (!scaleOptions.marker.visible) {
        scaleOptions.label.format = formatHelper.getDateFormatByTickInterval(
          scaleOptions.startValue,
          scaleOptions.endValue,
          scaleOptions.tickInterval,
        );
      } else {
        scaleOptions.label.format = dateUtils.getDateFormatByTickInterval(
          scaleOptions.tickInterval,
        );
      }
    }
  }

  if (scaleOptions.type === SEMIDISCRETE) {
    const intervals = getIntervalCustomTicks(scaleOptions);
    scaleOptions.customMinorTicks = intervals.altIntervals;
    scaleOptions.customTicks = intervals.intervals;
    scaleOptions.customBoundTicks = [scaleOptions.customTicks[0]];
  }
}

function prepareScaleOptions(
  scaleOption: ThemeValue,
  calculatedValueType: ThemeValue,
  incidentOccurred: ThemeValue,
  containerColor: ThemeValue,
): ThemeValue {
  let valueType = correctValueType(normalizeEnum(scaleOption.valueType));
  const validateStartEndValues = (field: string, parser: ThemeValue): void => {
    const messageToIncidentOccurred = field === START_VALUE ? 'start' : 'end';

    if (isDefined(scaleOption[field])) {
      const parsedValue = parser(scaleOption[field]);
      if (isDefined(parsedValue)) {
        scaleOption[field] = parsedValue;
      } else {
        scaleOption[field] = undefined;
        incidentOccurred('E2202', [messageToIncidentOccurred]);
      }
    }
  };

  valueType = calculatedValueType || valueType;

  if (!valueType) {
    valueType = calculateValueType(scaleOption.startValue, scaleOption.endValue) || 'numeric';
  }

  if (valueType === STRING || scaleOption.categories) {
    scaleOption.type = DISCRETE;
    valueType = STRING;
  }

  scaleOption.containerColor = containerColor;

  scaleOption.valueType = valueType;
  scaleOption.dataType = valueType;
  const parser = getParser(valueType);

  validateStartEndValues(START_VALUE, parser);
  validateStartEndValues(END_VALUE, parser);

  checkLogarithmicOptions(scaleOption, DEFAULT_LOGARITHM_BASE, incidentOccurred);
  if (!scaleOption.type) {
    scaleOption.type = 'continuous';
  }

  scaleOption.parser = parser;
  if (scaleOption.type === SEMIDISCRETE) {
    scaleOption.minorTick.visible = false;
    scaleOption.minorTickInterval = scaleOption.minRange;
    scaleOption.marker.visible = false;
    scaleOption.maxRange = undefined;
  }
  // eslint-disable-next-line no-bitwise
  scaleOption.forceUserTickInterval |= Number(
    isDefined(scaleOption.tickInterval) && !isDefined(scaleOption.axisDivisionFactor),
  );
  scaleOption.axisDivisionFactor = isDefined(scaleOption.axisDivisionFactor)
    ? scaleOption.axisDivisionFactor
    : DEFAULT_AXIS_DIVISION_FACTOR;
  scaleOption.minorAxisDivisionFactor = isDefined(scaleOption.minorAxisDivisionFactor)
    ? scaleOption.minorAxisDivisionFactor
    : DEFAULT_MINOR_AXIS_DIVISION_FACTOR;
  return scaleOption;
}

function getSliderMarkerDateFormat(
  markerVisible: boolean,
  startValue: ThemeValue,
  endValue: ThemeValue,
  interval: ThemeValue,
): ThemeValue {
  if (markerVisible) {
    return dateUtils.getDateFormatByTickInterval(interval);
  }
  if (isDefined(startValue) && isDefined(endValue)) {
    return formatHelper.getDateFormatByTickInterval(startValue, endValue, interval);
  }
  return undefined;
}

function getPrecisionForSlider(
  startValue: ThemeValue,
  endValue: ThemeValue,
  screenDelta: number,
): number {
  const d = Math.abs(endValue - startValue) / screenDelta;
  const tail = d - Math.floor(d);

  return tail > 0 ? Math.ceil(Math.abs(adjust(getLog(tail, 10)))) : 0;
}

// AxisWrapper

function prepareAxisOptions(
  scaleOptions: ThemeValue,
  isCompactMode: boolean,
  height: number,
  axisPosition: number,
): ThemeValue {
  scaleOptions.marker.label.font = scaleOptions.label.font;

  scaleOptions.color = scaleOptions.tick.color;
  scaleOptions.marker.color = scaleOptions.tick.color;
  scaleOptions.opacity = scaleOptions.tick.opacity;
  scaleOptions.marker.opacity = scaleOptions.tick.opacity;
  scaleOptions.width = scaleOptions.tick.width;
  scaleOptions.marker.width = scaleOptions.tick.width;

  scaleOptions.placeholderSize = (scaleOptions.placeholderHeight || 0) + axisPosition;

  scaleOptions.argumentType = scaleOptions.valueType;
  scaleOptions.visible = isCompactMode;
  scaleOptions.isHorizontal = true;
  scaleOptions.calculateMinors = true;

  scaleOptions.semiDiscreteInterval = scaleOptions.minRange;

  if (!isCompactMode) {
    scaleOptions.minorTick.length = height;
    scaleOptions.tick.length = height;
  }
  scaleOptions.label.indentFromAxis = scaleOptions.label.topIndent + axisPosition;

  return scaleOptions;
}

function createDateMarkersEvent(
  scaleOptions: ThemeValue,
  markerTrackers: ThemeValue,
  setSelectedRange: ThemeValue,
): void {
  function onPointerDown(e: ThemeValue): void {
    const { range } = e.target;
    const minRange = scaleOptions.minRange
      ? dateUtils.addInterval(range.startValue, scaleOptions.minRange)
      : undefined;
    const maxRange = scaleOptions.maxRange
      ? dateUtils.addInterval(range.startValue, scaleOptions.maxRange)
      : undefined;
    if (!((minRange && minRange > range.endValue) || (maxRange && maxRange < range.endValue))) {
      setSelectedRange(range, e);
    }
  }

  each(markerTrackers, (_, value: ThemeValue) => {
    value.on('dxpointerdown', onPointerDown);
  });
}

function getSharpDirection(): number {
  return 1;
}

function getTickStartPositionShift(length: number): number {
  return length % 2 === 1 ? -Math.floor(length / 2) : -length / 2;
}

function checkShiftedLabels(
  majorTicks: ThemeValue[],
  boxes: ThemeValue[],
  minSpacing: number,
  alignment: string,
): void {
  function checkLabelsOverlapping(nearestLabelsIndexes: number[]): void {
    if (nearestLabelsIndexes.length === 2
      && constants.areLabelsOverlap(
        boxes[nearestLabelsIndexes[0]],
        boxes[nearestLabelsIndexes[1]],
        minSpacing,
        alignment,
      )) {
      majorTicks[nearestLabelsIndexes[0]].removeLabel();
    }
  }
  function getTwoVisibleLabels(startIndex: number): number[] {
    const labels: number[] = [];

    for (let i = startIndex; labels.length < 2 && i < majorTicks.length; i += 1) {
      if (majorTicks[i].label) {
        labels.push(i);
      }
    }

    return labels;
  }

  if (majorTicks.length < 3) {
    return;
  }

  checkLabelsOverlapping(getTwoVisibleLabels(0));
  checkLabelsOverlapping(getTwoVisibleLabels(majorTicks.length - 2).reverse());
}

class AxisWrapper {
  _axis;

  _updateSelectedRangeCallback;

  constructor(params: ThemeValue) {
    this._axis = new Axis({
      renderer: params.renderer,
      axesContainerGroup: params.root,
      scaleBreaksGroup: params.scaleBreaksGroup,
      labelsAxesGroup: params.labelsAxesGroup,
      incidentOccurred: params.incidentOccurred,
      // TODO: These dependencies should be statically resolved (not for every new instance)
      axisType: 'xyAxes',
      drawingType: 'linear',
      widgetClass: 'dxrs',
      axisClass: 'range-selector',
      isArgumentAxis: true,
      getTemplate(): void {},
    });
    this._updateSelectedRangeCallback = params.updateSelectedRange;
    this._axis.getAxisSharpDirection = getSharpDirection;
    this._axis.getSharpDirectionByCoords = getSharpDirection;
    this._axis.getTickStartPositionShift = getTickStartPositionShift;
    this._axis._checkShiftedLabels = checkShiftedLabels;
  }

  update(
    options: ThemeValue,
    isCompactMode: boolean,
    canvas: Canvas,
    businessRange: ThemeValue,
    seriesDataSource: ThemeValue,
  ): void {
    const axis = this._axis;
    axis.updateOptions(prepareAxisOptions(
      options,
      isCompactMode,
      canvas.height,
      canvas.height / 2 - Math.ceil(options.width / 2),
    ));
    axis.validate();
    axis.setBusinessRange(businessRange, true);
    if (seriesDataSource !== undefined && seriesDataSource.isShowChart()) {
      axis.setMarginOptions(seriesDataSource.getMarginOptions(canvas));
    }

    axis.draw(canvas);
    axis.shift({ left: 0, bottom: -canvas.height / 2 + canvas.top });
    if (axis.getMarkerTrackers()) {
      // TODO: Check who is responsible for destroying events
      createDateMarkersEvent(options, axis.getMarkerTrackers(), this._updateSelectedRangeCallback);
    }
    axis.drawScaleBreaks({ start: canvas.top, end: canvas.top + canvas.height });
  }

  visualRange(): void { }

  getViewport(): ThemeValue {
    return {};
  }

  allScaleSelected(value: ThemeValue): { startValue: boolean; endValue: boolean } {
    const { startValue, endValue } = this._axis.visualRange();

    return {
      startValue: value[0].valueOf() === startValue.valueOf(),
      endValue: value[1].valueOf() === endValue.valueOf(),
    };
  }

  getOptions(): ThemeValue {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._axis.getOptions() || {};
  }
}

each(Axis.prototype, (field: string) => {
  if (field !== 'constructor' && !field.startsWith('_') && isFunction(Axis.prototype[field])
    && !(field in AxisWrapper.prototype)) {
    AxisWrapper.prototype[field] = function callAxisMethod(
      this: { _axis: ThemeValue },
      ...args: unknown[]
    ): ThemeValue {
      const axis: ThemeValue = this._axis;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return axis[field](...args);
    };
  }
});

class RangeSelector extends BaseWidget {
  static addPlugin: (plugin: ThemeValue) => void;

  static getInstance: typeof DOMComponent.getInstance;

  _clipRect;

  _axis!: ThemeValue;

  _rangeView;

  _slidersController;

  _tracker;

  _clientRect!: number[];

  _rangeOption: ThemeValue;

  _isUpdating?: boolean;

  _dataSourceIsAsync?: boolean;

  __isResizing?: boolean;

  __skipAnimation?: boolean;

  _toggleParentsScrollSubscription(): void {}

  _dataIsReady(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._dataIsLoaded();
  }

  _getDefaultSize(): { width: number; height: number } {
    return {
      width: 400, height: 160,
    };
  }

  _initCore(): void {
    const renderer = this._renderer;
    const { root } = renderer;

    // TODO: Move it to the SlidersEventManager
    root.css({
      'touch-action': 'pan-y',
    });

    // RangeContainer
    this._clipRect = renderer.clipRect(); // TODO: Try to remove it
    // TODO: Groups could be created by the corresponding components
    const rangeViewGroup = renderer.g().attr({ class: 'dxrs-view' }).append(root);
    const slidersGroup = renderer.g()
      .attr({ class: 'dxrs-slidersContainer', 'clip-path': this._clipRect.id })
      .append(root);
    const scaleGroup = renderer.g()
      .attr({ class: 'dxrs-scale', 'clip-path': this._clipRect.id })
      .append(root);
    const labelsAxesGroup = renderer.g()
      .attr({ class: 'dxrs-scale-elements', 'clip-path': this._clipRect.id })
      .append(root);
    const scaleBreaksGroup = renderer.g().attr({ class: 'dxrs-scale-breaks' }).append(root);
    const trackersGroup = renderer.g().attr({ class: 'dxrs-trackers' }).append(root);

    this._axis = new AxisWrapper({
      renderer,
      root: scaleGroup,
      scaleBreaksGroup,
      labelsAxesGroup,
      updateSelectedRange: (range: ThemeValue, e: ThemeValue): void => {
        this.setValue(convertVisualRangeObject(range), e);
      },
      incidentOccurred: this._incidentOccurred,
    });

    this._rangeView = new RangeView({
      renderer,
      root: rangeViewGroup,
      translator: this._axis.getTranslator(),
    });

    this._slidersController = new SlidersController({
      renderer,
      root: slidersGroup,
      trackersGroup,
      updateSelectedRange: (
        range: ThemeValue,
        lastSelectedRange: ThemeValue,
        e: ThemeValue,
      ): void => {
        if (!this._rangeOption) {
          this.option(
            VALUE,
            convertVisualRangeObject(range, isPlainObject(this._options.silent(VALUE))),
          );
        }

        this._eventTrigger(VALUE_CHANGED, {
          value: convertVisualRangeObject(range),
          previousValue: convertVisualRangeObject(lastSelectedRange),
          event: e,
        });
      },
      axis: this._axis,
      translator: this._axis.getTranslator(),
    });

    this._tracker = new Tracker({
      renderer,
      controller: this._slidersController,
    });
  }

  _disposeCore(): void {
    this._axis.dispose();
    this._slidersController.dispose();
    this._tracker.dispose();
  }

  _applySize(rect: number[]): void {
    this._clientRect = rect.slice();
    this._change(['MOSTLY_TOTAL']);
  }

  _change_SCALE(): void {
    this._change(['MOSTLY_TOTAL']);
  }

  _setValueByDataSource(): void {
    const options = this._options.silent();
    const axis = this._axis;

    if (options.dataSource) {
      let selectedRangeUpdateMode = this.option('selectedRangeUpdateMode');
      const value = this.getValue();
      const valueIsReady = isDefined(value[0]) && isDefined(value[1]);
      if (isDefined(selectedRangeUpdateMode)) {
        selectedRangeUpdateMode = normalizeEnum(selectedRangeUpdateMode);
        this.__skipAnimation = true;
      } else if (valueIsReady && !this._dataSourceIsAsync) { // T696409 T930471
        selectedRangeUpdateMode = RESET;
      }

      if (selectedRangeUpdateMode === 'auto' && valueIsReady) {
        const rangesInfo = axis.allScaleSelected(value);

        if (rangesInfo.startValue && rangesInfo.endValue) {
          selectedRangeUpdateMode = RESET;
        } else if (rangesInfo.endValue) {
          selectedRangeUpdateMode = SHIFT;
        } else {
          selectedRangeUpdateMode = KEEP;
        }
      }

      if (selectedRangeUpdateMode === RESET) {
        options[VALUE] = null;
      } else if (selectedRangeUpdateMode === SHIFT && valueIsReady) {
        const currentValue = this.getValue();
        this.__skipAnimation = true;
        options[VALUE] = {
          length: axis.getVisualRangeLength({
            minVisible: currentValue[0],
            maxVisible: currentValue[1],
          }),
        };
      } else if (selectedRangeUpdateMode === KEEP) {
        this.__skipAnimation = true;
      }
    }
    this._dataSourceIsAsync = undefined;
  }

  _change_DATA_SOURCE(): void {
    if (this._options.silent('dataSource')) {
      this._updateDataSource();
    }
  }

  _change_MOSTLY_TOTAL(): void {
    this._applyMostlyTotalChange();
  }

  _change_SLIDER_SELECTION(): void {
    const value = this._options.silent(VALUE);

    this._slidersController.setSelectedRange(value && parseValue(value));
  }

  _change_VALUE(): void {
    const option = this._rangeOption;
    this._dataSourceIsAsync = !this._dataIsReady();
    if (option) {
      this._options.silent(VALUE, option);
      this.setValue(option);
    }
  }

  _validateRange(start: ThemeValue, end: ThemeValue): void {
    const ensureValueInvalid = (value: ThemeValue): boolean => isDefined(value)
      && !this._axis.getTranslator().isValid(value);

    if (this._dataIsReady() && (ensureValueInvalid(start) || ensureValueInvalid(end))) {
      this._incidentOccurred('E2203');
    }
  }

  _applyChanges(...args: unknown[]): void {
    const value = this._options.silent(VALUE);

    if (this._changes.has('VALUE') && value) {
      this._rangeOption = value;
    }
    super._applyChanges(...args);
    this._rangeOption = null;
    this.__isResizing = false;
    this.__skipAnimation = false;
  }

  _applyMostlyTotalChange(): void {
    const renderer = this._renderer;
    const rect = this._clientRect;
    const skipAnimation = Boolean(this.__isResizing || this.__skipAnimation);
    const currentAnimationEnabled = skipAnimation ? renderer.animationEnabled() : undefined;
    const canvas: Canvas = {
      left: rect[0], top: rect[1], width: rect[2] - rect[0], height: rect[3] - rect[1],
    };

    if (skipAnimation) {
      renderer.updateAnimationOptions({
        enabled: false,
      });
    }

    this._clipRect.attr({
      x: rect[0], y: rect[1], width: rect[2] - rect[0], height: rect[3] - rect[1],
    });

    this._axis.getTranslator().update(new Range(), canvas, { isHorizontal: true });

    this._updateContent({
      left: rect[0], top: rect[1], width: rect[2] - rect[0], height: rect[3] - rect[1],
    });

    if (skipAnimation) {
      renderer.updateAnimationOptions({
        enabled: currentAnimationEnabled,
      });
    }

    this._drawn();
  }

  _dataSourceChangedHandler(): void {
    this._setValueByDataSource();
    this._requestChange(['MOSTLY_TOTAL']);
  }

  // It seems that we REALLY like to translate option structures from one form to another.
  // TODO: The more appropriate way is the following:
  // that._rangeView.update([
  //     that._getOption("background"),
  //     that._getOption("chart"),
  //     that.option("dataSource")
  // ]);
  // that._slidersController.update([
  //     that._getOption("sliderHandle"),
  //     that._getOption("sliderMarker"),
  //     that._getOption("shutter"),
  //     that._getOption("behavior")
  // ]);
  // that._axis.update(that._getOption("scale"));
  _completeSeriesDataSourceCreation(scaleOptions: ThemeValue, seriesDataSource: ThemeValue): void {
    const rect = this._clientRect;
    const canvas: Canvas = {
      left: rect[0], top: rect[1], width: rect[2] - rect[0], height: rect[3] - rect[1],
    };

    this._axis.updateOptions(extend({}, scaleOptions, {
      isHorizontal: true,
      label: {},
    }));

    if (seriesDataSource.isShowChart()) {
      this._axis.setMarginOptions(seriesDataSource.getMarginOptions(canvas));
    }
    this._axis.updateCanvas(canvas);

    seriesDataSource.createPoints();
  }

  _updateContent(canvas: Canvas): void {
    const chartOptions = this.option('chart');
    const seriesDataSource = this._createSeriesDataSource(chartOptions);
    const isCompactMode = !((seriesDataSource && seriesDataSource.isShowChart())
      || this.option('background.image.url'));
    const scaleOptions = prepareScaleOptions(
      this._getOption('scale'),
      seriesDataSource && seriesDataSource.getCalculatedValueType(),
      this._incidentOccurred,
      this._getOption('containerBackgroundColor', true),
    );
    if (seriesDataSource) {
      this._completeSeriesDataSourceCreation(scaleOptions, seriesDataSource);
    }
    const argTranslatorRange = calculateTranslatorRange(seriesDataSource, scaleOptions);
    const tickIntervalsInfo = updateTickIntervals(
      scaleOptions,
      canvas.width,
      this._incidentOccurred,
      argTranslatorRange,
    );
    const chartThemeManager = seriesDataSource && seriesDataSource.isShowChart()
      && seriesDataSource.getThemeManager();

    if (chartThemeManager) {
      // TODO: Looks like usage of "chartThemeManager" can be replaced with
      // "that._getOption("chart").valueAxis.logarithmBase - check it
      checkLogarithmicOptions(
        chartOptions && chartOptions.valueAxis,
        chartThemeManager.getOptions('valueAxis').logarithmBase,
        this._incidentOccurred,
      );
    }

    updateScaleOptions(
      scaleOptions,
      seriesDataSource,
      argTranslatorRange,
      tickIntervalsInfo,
      getDateMarkerVisibilityChecker(canvas.width),
    );
    updateTranslatorRangeInterval(argTranslatorRange, scaleOptions);
    const sliderMarkerOptions = this._prepareSliderMarkersOptions(
      scaleOptions,
      canvas.width,
      tickIntervalsInfo,
      argTranslatorRange,
    );
    const indents = calculateIndents(
      this._renderer,
      scaleOptions,
      sliderMarkerOptions,
      this.option('indent'),
      tickIntervalsInfo,
    );
    const scaleAreaHeight = calculateScaleAreaHeight(
      this._renderer,
      scaleOptions,
      showScaleMarkers(scaleOptions),
      tickIntervalsInfo,
    );
    const rangeContainerCanvas: Canvas = {
      left: canvas.left + indents.left,
      top: canvas.top + indents.top,
      width: canvas.left + indents.left + Math.max(canvas.width - indents.left - indents.right, 1),
      height: Math.max(!isCompactMode
        ? canvas.height - indents.top - indents.bottom - scaleAreaHeight
        : HEIGHT_COMPACT_MODE, 0),
      right: 0,
      bottom: 0,
    };

    // TODO: There should be one call to some axis method (not 4 methods)
    this._axis.update(
      scaleOptions,
      isCompactMode,
      rangeContainerCanvas,
      argTranslatorRange,
      seriesDataSource,
    );

    scaleOptions.minorTickInterval = scaleOptions.isEmpty ? 0 : scaleOptions.minorTickInterval;

    // RangeContainer
    this._updateElements(
      scaleOptions,
      sliderMarkerOptions,
      isCompactMode,
      rangeContainerCanvas,
      seriesDataSource,
    );

    if (chartThemeManager) {
      chartThemeManager.dispose(); // TODO: Move it inside "SeriesDataSource"
    }
  }

  _updateElements(
    scaleOptions: ThemeValue,
    sliderMarkerOptions: ThemeValue,
    isCompactMode: boolean,
    canvas: Canvas,
    seriesDataSource: ThemeValue,
  ): void {
    const behavior = this._getOption('behavior');
    const shutterOptions = this._getOption('shutter');
    const isNotSemiDiscrete = scaleOptions.type !== SEMIDISCRETE;

    shutterOptions.color = shutterOptions.color
      || this._getOption(CONTAINER_BACKGROUND_COLOR, true);

    this._rangeView.update(
      this.option('background'),
      this._themeManager.theme('background'),
      canvas,
      isCompactMode,
      behavior.animationEnabled && this._renderer.animationEnabled(),
      seriesDataSource,
    );

    // TODO: Is entire options bag really needed for SlidersContainer?
    this._isUpdating = true;
    this._slidersController.update(
      [canvas.top, canvas.top + canvas.height],
      behavior,
      isCompactMode,
      this._getOption('sliderHandle'),
      sliderMarkerOptions,
      shutterOptions,
      {
        minRange: isNotSemiDiscrete ? this.option('scale.minRange') : undefined,
        maxRange: isNotSemiDiscrete ? this.option('scale.maxRange') : undefined,
      },
      this._axis.getFullTicks(),
      this._getOption('selectedRangeColor', true),
    );

    this._requestChange(['SLIDER_SELECTION']);
    this._isUpdating = false;
    this._tracker.update(!this._axis.getTranslator().getBusinessRange().isEmpty(), behavior);
  }

  _createSeriesDataSource(chartOptions: ThemeValue): ThemeValue {
    // TODO: This code can be executed when data source is not loaded (it is an error)!
    const dataSource = this._dataSourceItems();
    const scaleOptions = this._getOption('scale');
    const valueType = scaleOptions.valueType
      || calculateValueType(scaleOptions.startValue, scaleOptions.endValue);
    const valueAxis = new Axis({
      renderer: this._renderer,
      axisType: 'xyAxes',
      drawingType: 'linear',
    });

    valueAxis.updateOptions({
      isHorizontal: false,
      label: {},
      categoriesSortingMethod: this._getOption('chart').valueAxis.categoriesSortingMethod,
    });

    if (!dataSource && !(chartOptions && chartOptions.series)) {
      return undefined;
    }

    const options = extend({}, chartOptions, {
      theme: this.option('theme'),
    });
    return new SeriesDataSource({
      renderer: this._renderer,
      dataSource,
      valueType: normalizeEnum(valueType),
      axisType: scaleOptions.type,
      chart: options,
      dataSourceField: this.option('dataSourceField'),
      incidentOccurred: this._incidentOccurred,
      categories: scaleOptions.categories,
      argumentAxis: this._axis,
      valueAxis,
    });
  }

  _prepareSliderMarkersOptions(
    scaleOptions: ThemeValue,
    screenDelta: number,
    tickIntervalsInfo: TickIntervalsInfo,
    argRange: ThemeValue,
  ): ThemeValue {
    const { minorTickInterval, tickInterval } = tickIntervalsInfo;
    let interval = tickInterval;
    const { endValue, startValue } = scaleOptions;
    const sliderMarkerOptions = this._getOption(SLIDER_MARKER);
    const doNotSnap = !this._getOption('behavior').snapToTicks;
    const isTypeDiscrete = scaleOptions.type === DISCRETE;
    const isValueTypeDatetime = scaleOptions.valueType === DATETIME;

    sliderMarkerOptions.borderColor = this._getOption(CONTAINER_BACKGROUND_COLOR, true);

    if (!sliderMarkerOptions.format && !argRange.isEmpty()) {
      if (doNotSnap && isNumeric(scaleOptions.startValue)) {
        sliderMarkerOptions.format = {
          type: 'fixedPoint',
          precision: getPrecisionForSlider(startValue, endValue, screenDelta),
        };
      }
      if (isValueTypeDatetime && !isTypeDiscrete) {
        if (isDefined(minorTickInterval) && minorTickInterval !== 0) {
          interval = getMinorTickIntervalUnit(tickInterval, minorTickInterval, doNotSnap);
        }

        const dateFormat = getSliderMarkerDateFormat(
          scaleOptions.marker.visible,
          startValue,
          endValue,
          interval,
        );
        if (dateFormat !== undefined) {
          sliderMarkerOptions.format = dateFormat;
        }
      }
      // T347293
      if (isValueTypeDatetime && isTypeDiscrete && tickIntervalsInfo.ticks.length) {
        sliderMarkerOptions.format = formatHelper.getDateFormatByTicks(tickIntervalsInfo.ticks);
      }
    }
    return sliderMarkerOptions;
  }

  getValue(): ThemeValue {
    return convertVisualRangeObject(this._slidersController.getSelectedRange());
  }

  setValue(value: ThemeValue, e?: ThemeValue): void {
    const visualRange = parseValue(value);
    if (!this._isUpdating && value) {
      this._validateRange(visualRange.startValue, visualRange.endValue);
      if (!rangesAreEqual(visualRange, this._slidersController.getSelectedRange())) {
        this._slidersController.setSelectedRange(visualRange, e);
      }
    }
  }

  _setContentSize(...args: unknown[]): void {
    this.__isResizing = this._changes.count() === 2;
    super._setContentSize(...args);
  }
}

setupWidgetPrototype(RangeSelector, {
  _eventsMap: {
    onValueChanged: { name: VALUE_CHANGED },
  },
  _rootClassPrefix: 'dxrs',
  _rootClass: 'dxrs-range-selector',
  _initialChanges: ['DATA_SOURCE', 'VALUE'],
  _themeDependentChanges: ['MOSTLY_TOTAL'],
  _themeSection: 'rangeSelector',
  _fontFields: ['scale.label.font', 'sliderMarker.font'],
  _optionChangesMap: {
    scale: 'SCALE',
    value: 'VALUE',
    dataSource: 'DATA_SOURCE',
  },
  _optionChangesOrder: ['SCALE', 'DATA_SOURCE'],
  _customChangesOrder: ['MOSTLY_TOTAL', 'VALUE', 'SLIDER_SELECTION'],
});

[
  'selectedRangeColor', CONTAINER_BACKGROUND_COLOR, SLIDER_MARKER, 'sliderHandle',
  'shutter', OPTION_BACKGROUND, 'behavior', 'chart', 'indent',
].forEach((name) => {
  RangeSelector.prototype._optionChangesMap[name] = 'MOSTLY_TOTAL';
});

registerComponent('dxRangeSelector', RangeSelector);

RangeSelector.addPlugin(exportPlugin);
RangeSelector.addPlugin(titlePlugin);
RangeSelector.addPlugin(LoadingIndicatorPlugin);
RangeSelector.addPlugin(dataSourcePlugin);

export default RangeSelector;
