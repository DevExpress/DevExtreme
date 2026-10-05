/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable default-case */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { noop as _noop } from '@js/core/utils/common';
/// #DEBUG
import { debug } from '@js/core/utils/console';
/// #ENDDEBUG
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { each as _each } from '@js/core/utils/iterator';
import { sign } from '@js/core/utils/math';
import { isDefined, isNumeric } from '@js/core/utils/type';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';

import { map as _map, normalizeEnum as _normalizeEnum } from './utils';

interface SeriesFamilyOptions {
  type: string;
  pane?: string;
  minBubbleSize?: number;
  maxBubbleSize?: number;
  barGroupPadding?: number;
  barGroupWidth?: number;
  negativesAsZeroes?: boolean;
  rotated?: boolean;
}

interface BarParameters {
  width: number;
  spacing: number;
  middleIndex: number;
  rawWidth: number;
}

type StackValues = Record<string, Record<string, number>>;

interface StackKeepers {
  positive: StackValues;
  negative: StackValues;
}

type StackIndexCallback = (index: number, stackCount: number) => number;

const {
  round, abs, sqrt,
} = Math;
const _min = Math.min;

const DEFAULT_BAR_GROUP_PADDING = 0.3;

function validateBarPadding(barPadding: ThemeValue): ThemeValue {
  return barPadding < 0 || barPadding > 1 ? undefined : barPadding;
}

function validateBarGroupPadding(barGroupPadding: number): number {
  return barGroupPadding < 0 || barGroupPadding > 1 ? DEFAULT_BAR_GROUP_PADDING : barGroupPadding;
}

function isStackExist(series: ThemeValue[], arg: ThemeValue): boolean {
  return series.some((s) => !s.getOptions().ignoreEmptyPoints || s.getPointsByArg(arg, true).some((point) => point.hasValue()));
}

function correctStackCoordinates(series: ThemeValue[], currentStacks: string[], arg: ThemeValue, stack: string, parameters: BarParameters, barsArea: number, seriesStackIndexCallback: StackIndexCallback): void {
  series.forEach((series) => {
    const stackIndex = seriesStackIndexCallback(currentStacks.indexOf(stack), currentStacks.length);
    const points = series.getPointsByArg(arg, true);
    const barPadding = validateBarPadding(series.getOptions().barPadding);
    const barWidth = series.getOptions().barWidth;
    let offset = getOffset(stackIndex, parameters);
    let width = parameters.width;
    let extraParameters;

    if (stackIndex === -1) {
      return;
    }

    if (isDefined(barPadding) || isDefined(barWidth)) {
      extraParameters = calculateParams(barsArea, currentStacks.length, 1 - barPadding, barWidth);
      width = extraParameters.width;
      if (!series.getBarOverlapGroup()) {
        offset = getOffset(stackIndex, extraParameters);
      }
    }

    correctPointCoordinates(points, width, offset);
  });
}

function getStackName(series: ThemeValue): ThemeValue {
  return series.getStackName() || series.getBarOverlapGroup();
}

function adjustBarSeriesDimensionsCore(series: ThemeValue[], options: ThemeValue, seriesStackIndexCallback: StackIndexCallback): void {
  const commonStacks: string[] = [];
  const allArguments: ThemeValue[] = [];
  const seriesInStacks = {};
  const barGroupWidth = options.barGroupWidth;
  const argumentAxis = series[0]?.getArgumentAxis();
  let interval;

  if (series[0]?.useAggregation()) {
    const isDateArgAxis = series[0]?.argumentType === 'datetime';
    let tickInterval = argumentAxis.getTickInterval();
    let aggregationInterval = argumentAxis.getAggregationInterval();

    tickInterval = isDateArgAxis ? dateUtils.dateToMilliseconds(tickInterval) : tickInterval;
    aggregationInterval = isDateArgAxis ? dateUtils.dateToMilliseconds(aggregationInterval) : aggregationInterval;
    interval = aggregationInterval < tickInterval ? aggregationInterval : tickInterval;
  }

  interval = argumentAxis?.getTranslator().getInterval(interval);

  const barsArea = barGroupWidth ? interval > barGroupWidth ? barGroupWidth : interval : interval * (1 - validateBarGroupPadding(options.barGroupPadding));

  series.forEach((s, i) => {
    const stackName = getStackName(s) || i.toString();
    let argument;

    for (argument in s.pointsByArgument) {
      if (!allArguments.includes(argument.valueOf())) {
        allArguments.push(argument.valueOf());
      }
    }
    if (!commonStacks.includes(stackName)) {
      commonStacks.push(stackName);
      seriesInStacks[stackName] = [];
    }
    seriesInStacks[stackName].push(s);
  });

  allArguments.forEach((arg) => {
    const currentStacks = commonStacks.reduce<string[]>((stacks, stack) => {
      if (isStackExist(seriesInStacks[stack], arg)) {
        stacks.push(stack);
      }

      return stacks;
    }, []);

    const parameters = calculateParams(barsArea, currentStacks.length);
    commonStacks.forEach((stack) => {
      correctStackCoordinates(seriesInStacks[stack], currentStacks, arg, stack, parameters, barsArea, seriesStackIndexCallback);
    });
  });
}

function calculateParams(barsArea: number, count: number, percentWidth?: number, fixedBarWidth?: number): BarParameters {
  let spacing;
  let width;

  if (fixedBarWidth) {
    width = _min(fixedBarWidth, barsArea / count);
    spacing = count > 1 ? round((barsArea - round(width) * count) / (count - 1)) : 0;
  } else if (isDefined(percentWidth)) {
    width = barsArea * percentWidth / count;
    spacing = count > 1 ? round((barsArea - barsArea * percentWidth) / (count - 1)) : 0;
  } else {
    spacing = round(barsArea / count * 0.2);
    width = (barsArea - spacing * (count - 1)) / count;
  }

  return {
    width: width > 1 ? round(width) : 1, spacing, middleIndex: count / 2, rawWidth: width,
  };
}

function getOffset(stackIndex: number, parameters: BarParameters): number {
  const width = parameters.rawWidth < 1 ? parameters.rawWidth : parameters.width;
  return ((stackIndex - parameters.middleIndex) + 0.5) * width - (((parameters.middleIndex - stackIndex) - 0.5) * parameters.spacing);
}

function correctPointCoordinates(points: ThemeValue[], width: number, offset: number): void {
  _each(points, (_, point) => {
    point.correctCoordinates({
      width,
      offset,
    });
  });
}

function getValueType(value: number): string {
  return value >= 0 ? 'positive' : 'negative';
}

function getVisibleSeries(that: ThemeValue): ThemeValue[] {
  return that.series.filter((s) => s.isVisible());
}

function getAbsStackSumByArg(stackKeepers: StackKeepers, stackName: string, argument: ThemeValue): number {
  const positiveStackValue = (stackKeepers.positive[stackName] || {})[argument] || 0;
  const negativeStackValue = -(stackKeepers.negative[stackName] || {})[argument] || 0;
  return positiveStackValue + negativeStackValue;
}

function getStackSumByArg(stackKeepers: StackKeepers, stackName: string, argument: ThemeValue): number {
  const positiveStackValue = (stackKeepers.positive[stackName] || {})[argument] || 0;
  const negativeStackValue = (stackKeepers.negative[stackName] || {})[argument] || 0;
  return positiveStackValue + negativeStackValue;
}

function getSeriesStackIndexCallback(inverted: boolean): StackIndexCallback {
  if (!inverted) {
    return function (index: number): number { return index; };
  } else {
    return function (index: number, stackCount: number): number { return stackCount - index - 1; };
  }
}

function isInverted(series: ThemeValue[]): boolean {
  return series[0] && series[0].getArgumentAxis().getTranslator().isInverted();
}

function adjustBarSeriesDimensions(): void {
  const series = getVisibleSeries(this);
  adjustBarSeriesDimensionsCore(series, this._options, getSeriesStackIndexCallback(isInverted(series)));
}

function getFirstValueSign(series: ThemeValue): number {
  const points = series.getPoints();
  let value;
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    value = point.initialValue && point.initialValue.valueOf();
    if (abs(value) > 0) {
      break;
    }
  }

  return sign(value);
}

function adjustStackedSeriesValues(): void {
  const that = this;
  const negativesAsZeroes = that._options.negativesAsZeroes;
  const series = getVisibleSeries(that);
  const stackKeepers = {
    positive: {},
    negative: {},
  };
  const holesStack = {
    left: {},
    right: {},
  };
  const lastSeriesInPositiveStack = {};
  const lastSeriesInNegativeStack = {};

  series.forEach((singleSeries) => {
    const stackName = getStackName(singleSeries);
    let hole = false;

    const stack = getFirstValueSign(singleSeries) < 0 ? lastSeriesInNegativeStack : lastSeriesInPositiveStack;

    singleSeries._prevSeries = stack[stackName];
    stack[stackName] = singleSeries;

    singleSeries.holes = extend(true, {}, holesStack);

    singleSeries.getPoints().forEach((point, index, points) => {
      let value = point.initialValue && point.initialValue.valueOf();
      let argument = point.argument.valueOf();
      let stacks = value >= 0 ? stackKeepers.positive : stackKeepers.negative;
      const isNotBarSeries = singleSeries.type !== 'bar';

      if (negativesAsZeroes && value < 0) {
        stacks = stackKeepers.positive;
        value = 0;
        point.resetValue();
      }

      stacks[stackName] = stacks[stackName] || {};
      const currentStack = stacks[stackName];

      if (currentStack[argument]) {
        if (isNotBarSeries) point.correctValue(currentStack[argument]);
        currentStack[argument] += value;
      } else {
        currentStack[argument] = value;
        if (isNotBarSeries) point.resetCorrection();
      }
      if (!point.hasValue()) {
        const prevPoint = points[index - 1];
        if (!hole && prevPoint && prevPoint.hasValue()) {
          argument = prevPoint.argument.valueOf();
          prevPoint._skipSetRightHole = true;
          holesStack.right[argument] = (holesStack.right[argument] || 0) + (prevPoint.value.valueOf() - (isFinite(prevPoint.minValue) ? prevPoint.minValue.valueOf() : 0));
        }
        hole = true;
      } else if (hole) {
        hole = false;
        holesStack.left[argument] = (holesStack.left[argument] || 0) + (point.value.valueOf() - (isFinite(point.minValue) ? point.minValue.valueOf() : 0));
        point._skipSetLeftHole = true;
      }
    });
  });
  series.forEach((singleSeries) => {
    const holes = singleSeries.holes;
    singleSeries.getPoints().forEach((point) => {
      const argument = point.argument.valueOf();
      point.resetHoles();
      !point._skipSetLeftHole && point.setHole(holes.left[argument] || holesStack.left[argument] && 0, 'left');
      !point._skipSetRightHole && point.setHole(holes.right[argument] || holesStack.right[argument] && 0, 'right');
      point._skipSetLeftHole = null;
      point._skipSetRightHole = null;
    });
  });

  that._stackKeepers = stackKeepers;
  series.forEach((singleSeries) => {
    singleSeries.getPoints().forEach((point) => {
      const argument = point.argument.valueOf();
      const stackName = getStackName(singleSeries);
      const absTotal = getAbsStackSumByArg(stackKeepers, stackName, argument);
      const total = getStackSumByArg(stackKeepers, stackName, argument);

      point.setPercentValue(absTotal, total, holesStack.left[argument], holesStack.right[argument]);
    });
  });
}

function updateStackedSeriesValues(): void {
  const that = this;
  const series = getVisibleSeries(that);
  const stack = that._stackKeepers;
  const stackKeepers = {
    positive: {},
    negative: {},
  };
  _each(series, (_, singleSeries) => {
    const minBarSize = singleSeries.getOptions().minBarSize;
    const valueAxisTranslator = singleSeries.getValueAxis().getTranslator();
    const minShownBusinessValue = minBarSize && valueAxisTranslator.getMinBarSize(minBarSize);
    const stackName = singleSeries.getStackName();

    _each(singleSeries.getPoints(), (index, point) => {
      if (!point.hasValue()) {
        return;
      }
      let value = point.initialValue && point.initialValue.valueOf();
      const argument = point.argument.valueOf();

      if (that.fullStacked) {
        value = (value / getAbsStackSumByArg(stack, stackName, argument)) || 0;
      }

      const updateValue = valueAxisTranslator.checkMinBarSize(value, minShownBusinessValue, point.value);
      const valueType = getValueType(updateValue);
      const currentStack = stackKeepers[valueType][stackName] = stackKeepers[valueType][stackName] || {};

      if (currentStack[argument]) {
        point.minValue = currentStack[argument];
        currentStack[argument] += updateValue;
      } else {
        currentStack[argument] = updateValue;
      }
      point.value = currentStack[argument];
    });
  });

  if (that.fullStacked) {
    updateFullStackedSeriesValues(series, stackKeepers);
  }
}

function updateFullStackedSeriesValues(series: ThemeValue[], stackKeepers: StackKeepers): void {
  _each(series, (_, singleSeries) => {
    const stackName = singleSeries.getStackName ? singleSeries.getStackName() : 'default';

    _each(singleSeries.getPoints(), (index, point) => {
      const stackSum = getAbsStackSumByArg(stackKeepers, stackName, point.argument.valueOf());
      if (stackSum !== 0) {
        point.value /= stackSum;
        if (isNumeric(point.minValue)) {
          point.minValue /= stackSum;
        }
      }
    });
  });
}

function updateRangeSeriesValues(): void {
  const that = this;
  const series = getVisibleSeries(that);
  _each(series, (_, singleSeries) => {
    const minBarSize = singleSeries.getOptions().minBarSize;
    const valueAxisTranslator = singleSeries.getValueAxis().getTranslator();
    const minShownBusinessValue = minBarSize && valueAxisTranslator.getMinBarSize(minBarSize);
    if (minShownBusinessValue) {
      _each(singleSeries.getPoints(), (_, point) => {
        if (!point.hasValue()) {
          return;
        }

        if (point.value.valueOf() - point.minValue.valueOf() < minShownBusinessValue) {
          point.value = valueAxisTranslator.toValue(point.value.valueOf() + minShownBusinessValue / 2);
          point.minValue = valueAxisTranslator.toValue(point.minValue.valueOf() - minShownBusinessValue / 2);
        }
      });
    }
  });
}

function updateBarSeriesValues(): void {
  _each(this.series, (_, singleSeries) => {
    const minBarSize = singleSeries.getOptions().minBarSize;
    const valueAxisTranslator = singleSeries.getValueAxis().getTranslator();
    const minShownBusinessValue = minBarSize && valueAxisTranslator.getMinBarSize(minBarSize);

    if (minShownBusinessValue) {
      _each(singleSeries.getPoints(), (index, point) => {
        if (point.hasValue()) {
          point.value = valueAxisTranslator.checkMinBarSize(point.initialValue, minShownBusinessValue);
        }
      });
    }
  });
}

function adjustCandlestickSeriesDimensions(): void {
  const series = getVisibleSeries(this);
  adjustBarSeriesDimensionsCore(series, { barGroupPadding: 0.3 }, getSeriesStackIndexCallback(isInverted(series)));
}

function adjustBubbleSeriesDimensions(): void {
  const series = getVisibleSeries(this);

  if (!series.length) {
    return;
  }

  const options = this._options;
  const visibleAreaX = series[0].getArgumentAxis().getVisibleArea();
  const visibleAreaY = series[0].getValueAxis().getVisibleArea();
  const min = _min(visibleAreaX[1] - visibleAreaX[0], visibleAreaY[1] - visibleAreaY[0]);
  const minBubbleArea = options.minBubbleSize ** 2;
  const maxBubbleArea = (min * options.maxBubbleSize) ** 2;
  const equalBubbleSize = (min * options.maxBubbleSize + options.minBubbleSize) / 2;
  let minPointSize = Infinity;
  let maxPointSize = -Infinity;
  let pointSize;
  let bubbleArea;
  let sizeProportion;

  _each(series, (_, seriesItem) => {
    _each(seriesItem.getPoints(), (_, point) => {
      maxPointSize = maxPointSize > point.size ? maxPointSize : point.size;
      minPointSize = minPointSize < point.size ? minPointSize : point.size;
    });
  });
  const sizeDispersion = maxPointSize - minPointSize;
  const areaDispersion = abs(maxBubbleArea - minBubbleArea);

  _each(series, (_, seriesItem) => {
    _each(seriesItem.getPoints(), (_, point) => {
      if (maxPointSize === minPointSize) {
        pointSize = round(equalBubbleSize);
      } else {
        sizeProportion = abs(point.size - minPointSize) / sizeDispersion;
        bubbleArea = areaDispersion * sizeProportion + minBubbleArea;
        pointSize = round(sqrt(bubbleArea));
      }
      point.correctCoordinates(pointSize);
    });
  });
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let SeriesFamily = class SeriesFamily {
  declare type: string;

  declare pane?: string;

  declare series: ThemeValue[] | null;

  declare fullStacked?: boolean;

  declare _options: SeriesFamilyOptions;

  declare _stackKeepers: StackKeepers;

  declare adjustSeriesDimensions: () => void;

  declare adjustSeriesValues: () => void;

  declare updateSeriesValues: () => void;

  constructor(options: SeriesFamilyOptions) {
    /// #DEBUG
    debug.assert(options.type, 'type was not passed or empty');
    /// #ENDDEBUG

    this.type = _normalizeEnum(options.type);
    this.pane = options.pane;
    this.series = [];

    this.updateOptions(options);

    switch (this.type) {
      case 'bar':
        this.adjustSeriesDimensions = adjustBarSeriesDimensions;
        this.updateSeriesValues = updateBarSeriesValues;
        this.adjustSeriesValues = adjustStackedSeriesValues;
        break;
      case 'rangebar':
        this.adjustSeriesDimensions = adjustBarSeriesDimensions;
        this.updateSeriesValues = updateRangeSeriesValues;
        break;

      case 'fullstackedbar':
        this.fullStacked = true;
        this.adjustSeriesDimensions = adjustBarSeriesDimensions;
        this.adjustSeriesValues = adjustStackedSeriesValues;
        this.updateSeriesValues = updateStackedSeriesValues;
        break;

      case 'stackedbar':
        this.adjustSeriesDimensions = adjustBarSeriesDimensions;
        this.adjustSeriesValues = adjustStackedSeriesValues;
        this.updateSeriesValues = updateStackedSeriesValues;
        break;

      case 'fullstackedarea':
      case 'fullstackedline':
      case 'fullstackedspline':
      case 'fullstackedsplinearea':
        this.fullStacked = true;
        this.adjustSeriesValues = adjustStackedSeriesValues;
        break;

      case 'stackedarea':
      case 'stackedsplinearea':
      case 'stackedline':
      case 'stackedspline':
        this.adjustSeriesValues = adjustStackedSeriesValues;
        break;

      case 'candlestick':
      case 'stock':
        this.adjustSeriesDimensions = adjustCandlestickSeriesDimensions;
        break;

      case 'bubble':
        this.adjustSeriesDimensions = adjustBubbleSeriesDimensions;
        break;
    }
  }

  updateOptions(options: SeriesFamilyOptions): void {
    this._options = options;
  }

  dispose(): void {
    this.series = null;
  }

  add(series: ThemeValue[]): void {
    const type = this.type;
    this.series = _map(series, (singleSeries) => (singleSeries.type === type ? singleSeries : null));
  }
};

Object.assign(SeriesFamily.prototype, {
  adjustSeriesDimensions: _noop,

  adjustSeriesValues: _noop,

  updateSeriesValues: _noop,
});

/// #DEBUG
export function DEBUG_set_SeriesFamily(value: typeof SeriesFamily): void {
  SeriesFamily = value;
}
/// #ENDDEBUG
