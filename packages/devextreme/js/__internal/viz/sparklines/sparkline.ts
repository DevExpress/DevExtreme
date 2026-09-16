// PLUGINS_SECTION
import componentRegistrator from '@js/core/component_registrator';
import { isDefined } from '@js/core/utils/type';
import { validateData } from '@ts/viz/components/data_validator';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { plugin } from '@ts/viz/core/data_source';
import { setupWidgetPrototype } from '@ts/viz/core/helpers';
import { map, normalizeEnum } from '@ts/viz/core/utils';
import { Series } from '@ts/viz/series/base_series';
import BaseSparkline from '@ts/viz/sparklines/base_sparkline';

const MIN_BAR_WIDTH = 1;
const MAX_BAR_WIDTH = 50;
const DEFAULT_BAR_INTERVAL = 4;

const DEFAULT_CANVAS_WIDTH = 250;
const DEFAULT_CANVAS_HEIGHT = 30;

const DEFAULT_POINT_BORDER = 2;

const ALLOWED_TYPES: Record<string, boolean> = {
  line: true,
  spline: true,
  stepline: true,
  area: true,
  steparea: true,
  splinearea: true,
  bar: true,
  winloss: true,
};

type DataItem = Record<string, ThemeValue>;

interface MinMaxIndexes {
  minIndexes: number[];
  maxIndexes: number[];
}

interface PointIndexes {
  first?: number;
  last?: number;
  min?: number[];
  max?: number[];
}

function findMinMax(data: DataItem[], valField: string): MinMaxIndexes {
  const firstItem = data[0] || {};
  const firstValue = firstItem[valField] || 0;
  let min = firstValue;
  let max = firstValue;
  let minIndexes = [0];
  let maxIndexes = [0];

  for (let i = 1; i < data.length; i += 1) {
    const value = data[i][valField];
    if (value < min) {
      min = value;
      minIndexes = [i];
    } else if (value === min) {
      minIndexes.push(i);
    }
    if (value > max) {
      max = value;
      maxIndexes = [i];
    } else if (value === max) {
      maxIndexes.push(i);
    }
  }

  if (max === min) {
    minIndexes = [];
    maxIndexes = [];
  }
  return { minIndexes, maxIndexes };
}

function parseNumericValue(value: ThemeValue, ignoreEmptyPoints: boolean): ThemeValue {
  if (value === null) {
    return ignoreEmptyPoints ? undefined : value;
  }
  return Number(value);
}

function parseNumericDataSource(
  data: ThemeValue[],
  argField: string,
  valField: string,
  ignoreEmptyPoints: boolean,
): DataItem[] {
  const result: DataItem[] = map(data, (dataItem, index) => {
    if (dataItem === undefined) {
      return null;
    }
    const isDataNumber = isFinite(dataItem);
    const item: DataItem = {};
    item[argField] = isDataNumber ? String(index) : dataItem[argField];
    const value = isDataNumber ? dataItem : dataItem[valField];
    item[valField] = parseNumericValue(value, ignoreEmptyPoints);
    return item[argField] !== undefined && item[valField] !== undefined ? item : null;
  });
  return result;
}

function parseWinlossDataSource(
  data: DataItem[],
  argField: string,
  valField: string,
  target: number,
): DataItem[] {
  const lowBarValue = -1;
  const zeroBarValue = 0;
  const highBarValue = 1;
  const delta = 0.0001;

  const result: DataItem[] = map(data, (dataItem) => {
    const item: DataItem = {};
    item[argField] = dataItem[argField];
    if (Math.abs(dataItem[valField] - target) < delta) {
      item[valField] = zeroBarValue;
    } else if (dataItem[valField] > target) {
      item[valField] = highBarValue;
    } else {
      item[valField] = lowBarValue;
    }
    return item;
  });
  return result;
}

function selectPointColor(
  color: ThemeValue,
  options: ThemeValue,
  index: number,
  pointIndexes: PointIndexes,
): ThemeValue {
  let result = color;
  if (index === pointIndexes.first || index === pointIndexes.last) {
    result = options.firstLastColor;
  }
  if ((pointIndexes.min || []).includes(index)) {
    result = options.minColor;
  }
  if ((pointIndexes.max || []).includes(index)) {
    result = options.maxColor;
  }
  return result;
}

function createLineCustomizeFunction(
  pointIndexes: PointIndexes,
  options: ThemeValue,
): (this: ThemeValue) => ThemeValue {
  return function customizeLinePoint(this: ThemeValue): ThemeValue {
    const color = selectPointColor(undefined, options, this.index, pointIndexes);

    return color ? { visible: true, border: { color } } : {};
  };
}

function createBarCustomizeFunction(
  pointIndexes: PointIndexes,
  options: ThemeValue,
  winlossData: ThemeValue,
): (this: ThemeValue) => ThemeValue {
  return function customizeBarPoint(this: ThemeValue): ThemeValue {
    const { index } = this;
    const isWinloss = options.type === 'winloss';
    const target = isWinloss ? options.winlossThreshold : 0;
    const value = isWinloss ? winlossData[index][options.valueField] : this.value;
    const positiveColor = isWinloss ? options.winColor : options.barPositiveColor;
    const negativeColor = isWinloss ? options.lossColor : options.barNegativeColor;

    return {
      color: selectPointColor(
        value >= target ? positiveColor : negativeColor,
        options,
        index,
        pointIndexes,
      ),
    };
  };
}

class Sparkline extends BaseSparkline {
  _series;

  _seriesGroup;

  _seriesLabelGroup;

  _simpleDataSource!: DataItem[];

  _winlossDataSource?: DataItem[] | null;

  _minMaxIndexes!: MinMaxIndexes;

  _groupsDataCategories: ThemeValue;

  _initCore(): void {
    super._initCore();
    this._createSeries();
  }

  _dataSourceChangedHandler(): void {
    this._requestChange(['UPDATE']);
  }

  _updateWidgetElements(): void {
    this._updateSeries();
    super._updateWidgetElements();
  }

  _disposeWidgetElements(): void {
    if (this._series) {
      this._series.dispose();
    }
    this._series = null;
    this._seriesGroup = null;
    this._seriesLabelGroup = null;
  }

  _cleanWidgetElements(): void {
    this._seriesGroup.remove();
    this._seriesLabelGroup.remove();
    this._seriesGroup.clear();
    this._seriesLabelGroup.clear();

    this._series.removeGraphicElements();
    this._series.removePointElements();
    this._series.removeBordersGroup();
  }

  _drawWidgetElements(): void {
    if (this._dataIsLoaded()) {
      this._drawSeries();
      this._drawn();
    }
  }

  _getCorrectCanvas(): ThemeValue {
    const options = this._allOptions;
    const canvas = this._canvas;
    const halfPointSize = options.pointSize
      && Math.ceil(options.pointSize / 2) + DEFAULT_POINT_BORDER;
    const { type } = options;
    if (type !== 'bar' && type !== 'winloss' && (options.showFirstLast || options.showMinMax)) {
      return {
        width: canvas.width,
        height: canvas.height,
        left: canvas.left + halfPointSize,
        right: canvas.right + halfPointSize,
        top: canvas.top + halfPointSize,
        bottom: canvas.bottom + halfPointSize,
      };
    }
    return canvas;
  }

  _prepareOptions(): void {
    this._allOptions = super._prepareOptions();

    this._allOptions.type = normalizeEnum(this._allOptions.type);
    if (!ALLOWED_TYPES[this._allOptions.type]) {
      this._allOptions.type = 'line';
    }
  }

  _createHtmlElements(): void {
    this._seriesGroup = this._renderer.g().attr({ class: 'dxsl-series' });
    this._seriesLabelGroup = this._renderer.g().attr({ class: 'dxsl-series-labels' });
  }

  _createSeries(): void {
    this._series = new Series({
      renderer: this._renderer,
      seriesGroup: this._seriesGroup,
      labelsGroup: this._seriesLabelGroup,

      argumentAxis: this._argumentAxis,
      valueAxis: this._valueAxis,
      incidentOccurred: this._incidentOccurred,
    }, {
      widgetType: 'chart',
      type: 'line',
    });
  }

  /// #DEBUG
  getSeriesOptions(): ThemeValue {
    return this._series.getOptions();
  }
  /// #ENDDEBUG

  _updateSeries(): void {
    const singleSeries = this._series;

    this._prepareDataSource();
    const seriesOptions = this._prepareSeriesOptions();
    singleSeries.updateOptions(seriesOptions);

    const groupsData: ThemeValue = { groups: [{ series: [singleSeries] }] };
    groupsData.argumentOptions = {
      type: seriesOptions.type === 'bar' ? 'discrete' : undefined,
    };

    this._simpleDataSource = validateData(
      this._simpleDataSource,
      groupsData,
      this._incidentOccurred,
      {
        checkTypeForAllData: false,
        convertToAxisDataType: true,
        sortingMethod: true,
      },
    )[singleSeries.getArgumentField()];

    seriesOptions.customizePoint = this._getCustomizeFunction();
    singleSeries.updateData(this._simpleDataSource);
    singleSeries.createPoints();
    this._groupsDataCategories = groupsData.categories;
  }

  _change_DATA_SOURCE(): void {
    this._updateDataSource();
  }

  _prepareDataSource(): void {
    const options = this._allOptions;
    const argField = options.argumentField;
    const valField = options.valueField;
    const dataSource = this._dataSourceItems() || [];
    const data = parseNumericDataSource(
      dataSource,
      argField,
      valField,
      this.option('ignoreEmptyPoints'),
    );

    if (options.type === 'winloss') {
      this._winlossDataSource = data;
      this._simpleDataSource = parseWinlossDataSource(
        data,
        argField,
        valField,
        options.winlossThreshold,
      );
    } else {
      this._simpleDataSource = data;
    }
  }

  _prepareSeriesOptions(): ThemeValue {
    const options = this._allOptions;
    const type = options.type === 'winloss' ? 'bar' : options.type;

    return {
      visible: true,
      argumentField: options.argumentField,
      valueField: options.valueField,
      color: options.lineColor,
      width: options.lineWidth,
      widgetType: 'chart',
      name: '',
      type,
      opacity: type.indexOf('area') !== -1 ? this._allOptions.areaOpacity : undefined,
      point: {
        size: options.pointSize,
        symbol: options.pointSymbol,
        border: {
          visible: true,
          width: DEFAULT_POINT_BORDER,
        },
        color: options.pointColor,
        visible: false,
        hoverStyle: {
          border: {},
        },
        selectionStyle: {
          border: {},
        },
      },
      border: {
        color: options.lineColor,
        width: options.lineWidth,
        visible: type !== 'bar',
      },
    };
  }

  _getCustomizeFunction(): (this: ThemeValue) => ThemeValue {
    const options = this._allOptions;
    const dataSource = this._winlossDataSource || this._simpleDataSource;
    const drawnPointIndexes = this._getExtremumPointsIndexes(dataSource);

    if (options.type === 'winloss' || options.type === 'bar') {
      return createBarCustomizeFunction(drawnPointIndexes, options, this._winlossDataSource);
    }
    return createLineCustomizeFunction(drawnPointIndexes, options);
  }

  _getExtremumPointsIndexes(data: DataItem[]): PointIndexes {
    const options = this._allOptions;
    const lastIndex = data.length - 1;
    const indexes: PointIndexes = {};

    this._minMaxIndexes = findMinMax(data, options.valueField);

    if (options.showFirstLast) {
      indexes.first = 0;
      indexes.last = lastIndex;
    }
    if (options.showMinMax) {
      indexes.min = this._minMaxIndexes.minIndexes;
      indexes.max = this._minMaxIndexes.maxIndexes;
    }

    return indexes;
  }

  _getStick(): { stick: boolean } {
    return {
      stick: this._series.type !== 'bar',
    };
  }

  _updateRange(): void {
    const series = this._series;
    const { type } = series;
    const isBarType = type === 'bar';
    const isWinlossType = type === 'winloss';

    const DEFAULT_VALUE_RANGE_MARGIN = 0.15;
    const DEFAULT_ARGUMENT_RANGE_MARGIN = 0.1;
    const WINLOSS_MAX_RANGE = 1;
    const WINLOSS_MIN_RANGE = -1;

    const rangeData = series.getRangeData();
    const { minValue } = this._allOptions;
    const hasMinY = isDefined(minValue) && isFinite(minValue);
    const { maxValue } = this._allOptions;
    const hasMaxY = isDefined(maxValue) && isFinite(maxValue);

    const valCoef = (rangeData.val.max - rangeData.val.min) * DEFAULT_VALUE_RANGE_MARGIN;
    if (isBarType || isWinlossType || type === 'area') {
      if (rangeData.val.min !== 0) {
        rangeData.val.min -= valCoef;
      }
      if (rangeData.val.max !== 0) {
        rangeData.val.max += valCoef;
      }
    } else {
      rangeData.val.min -= valCoef;
      rangeData.val.max += valCoef;
    }

    if (hasMinY || hasMaxY) {
      if (hasMinY && hasMaxY) {
        rangeData.val.minVisible = Math.min(minValue, maxValue);
        rangeData.val.maxVisible = Math.max(minValue, maxValue);
      } else {
        rangeData.val.minVisible = hasMinY ? Number(minValue) : undefined;
        rangeData.val.maxVisible = hasMaxY ? Number(maxValue) : undefined;
      }

      if (isWinlossType) {
        rangeData.val.minVisible = hasMinY
          ? Math.max(rangeData.val.minVisible, WINLOSS_MIN_RANGE)
          : undefined;
        rangeData.val.maxVisible = hasMaxY
          ? Math.min(rangeData.val.maxVisible, WINLOSS_MAX_RANGE)
          : undefined;
      }
    }

    if (series.getPoints().length > 1) {
      if (isBarType) {
        const argCoef = (rangeData.arg.max - rangeData.arg.min) * DEFAULT_ARGUMENT_RANGE_MARGIN;
        rangeData.arg.min -= argCoef;
        rangeData.arg.max += argCoef;
      }
    }

    rangeData.arg.categories = this._groupsDataCategories;
    this._ranges = rangeData;
  }

  _getBarWidth(pointsCount: number): number {
    const canvas = this._canvas;
    const intervalWidth = pointsCount * DEFAULT_BAR_INTERVAL;
    const rangeWidth = canvas.width - canvas.left - canvas.right - intervalWidth;
    let width = Math.round(rangeWidth / pointsCount);

    if (width < MIN_BAR_WIDTH) {
      width = MIN_BAR_WIDTH;
    }
    if (width > MAX_BAR_WIDTH) {
      width = MAX_BAR_WIDTH;
    }
    return width;
  }

  _correctPoints(): void {
    const seriesType = this._allOptions.type;
    const seriesPoints = this._series.getPoints();
    const pointsLength = seriesPoints.length;

    if (seriesType === 'bar' || seriesType === 'winloss') {
      const barWidth = this._getBarWidth(pointsLength);
      for (let i = 0; i < pointsLength; i += 1) {
        seriesPoints[i].correctCoordinates({ width: barWidth, offset: 0 });
      }
    }
  }

  _drawSeries(): void {
    if (this._simpleDataSource.length > 0) {
      this._correctPoints();
      this._series.draw();
      this._seriesGroup.append(this._renderer.root);
    }
  }

  _isTooltipEnabled(): boolean {
    return !!this._simpleDataSource.length;
  }

  _getTooltipData(): ThemeValue {
    const options = this._allOptions;
    const dataSource = this._winlossDataSource || this._simpleDataSource;
    const tooltip = this._tooltip;

    if (dataSource.length === 0) {
      return {};
    }

    const minMax = this._minMaxIndexes;
    const { valueField } = options;
    const first = dataSource[0][valueField];
    const last = dataSource[dataSource.length - 1][valueField];
    const min = isDefined(minMax.minIndexes[0])
      ? dataSource[minMax.minIndexes[0]][valueField]
      : first;
    const max = isDefined(minMax.maxIndexes[0])
      ? dataSource[minMax.maxIndexes[0]][valueField]
      : first;
    const formattedFirst = tooltip.formatValue(first);
    const formattedLast = tooltip.formatValue(last);
    const formattedMin = tooltip.formatValue(min);
    const formattedMax = tooltip.formatValue(max);
    const customizeObject: ThemeValue = {
      firstValue: formattedFirst,
      lastValue: formattedLast,
      minValue: formattedMin,
      maxValue: formattedMax,
      originalFirstValue: first,
      originalLastValue: last,
      originalMinValue: min,
      originalMaxValue: max,
      valueText: [
        'Start:', formattedFirst, 'End:', formattedLast, 'Min:', formattedMin, 'Max:', formattedMax,
      ],
    };

    if (options.type === 'winloss') {
      customizeObject.originalThresholdValue = options.winlossThreshold;
      customizeObject.thresholdValue = tooltip.formatValue(options.winlossThreshold);
    }

    return customizeObject;
  }
}

setupWidgetPrototype(Sparkline, {
  _rootClassPrefix: 'dxsl',
  _rootClass: 'dxsl-sparkline',
  _themeSection: 'sparkline',
  _defaultSize: {
    width: DEFAULT_CANVAS_WIDTH,
    height: DEFAULT_CANVAS_HEIGHT,
  },
  _initialChanges: ['DATA_SOURCE'],
  _optionChangesMap: {
    dataSource: 'DATA_SOURCE',
  },
  _optionChangesOrder: ['DATA_SOURCE'],
});

[
  'lossColor', 'lineColor', 'lineWidth', 'areaOpacity', 'minColor', 'maxColor', 'barPositiveColor',
  'barNegativeColor', 'winColor', 'lessColor', 'firstLastColor', 'pointSymbol', 'pointColor', 'pointSize',
  'type', 'argumentField', 'valueField', 'winlossThreshold', 'showFirstLast', 'showMinMax',
  'ignoreEmptyPoints', 'minValue', 'maxValue',
].forEach((name) => {
  Sparkline.prototype._optionChangesMap[name] = 'OPTIONS';
});
componentRegistrator('dxSparkline', Sparkline);

Sparkline.addPlugin(plugin);

export default Sparkline;
