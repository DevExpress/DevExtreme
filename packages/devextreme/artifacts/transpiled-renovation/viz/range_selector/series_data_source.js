"use strict";

exports.SeriesDataSource = void 0;
var _base_series = require("../series/base_series");
var _series_family = require("../core/series_family");
var _type = require("../../core/utils/type");
var _extend = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _utils = require("../core/utils");
var _range = require("../translators/range");
var _data_validator = require("../components/data_validator");
var _chart_theme_manager = require("../components/chart_theme_manager");
const createThemeManager = function (chartOptions) {
  return new _chart_theme_manager.ThemeManager({
    options: chartOptions,
    themeSection: 'rangeSelector.chart',
    fontFields: ['commonSeriesSettings.label.font']
  });
};
const processSeriesFamilies = function (series, minBubbleSize, maxBubbleSize, barOptions, negativesAsZeroes) {
  const families = [];
  const types = [];
  (0, _iterator.each)(series, function (i, item) {
    if (!types.includes(item.type)) {
      types.push(item.type);
    }
  });
  (0, _iterator.each)(types, function (_, type) {
    const family = new _series_family.SeriesFamily({
      type: type,
      minBubbleSize: minBubbleSize,
      maxBubbleSize: maxBubbleSize,
      barGroupPadding: barOptions.barGroupPadding,
      barGroupWidth: barOptions.barGroupWidth,
      negativesAsZeroes: negativesAsZeroes
    });
    family.add(series);
    family.adjustSeriesValues();
    families.push(family);
  });
  return families;
};
const SeriesDataSource = function (options) {
  const that = this;
  const themeManager = that._themeManager = createThemeManager(options.chart);
  themeManager.setTheme(options.chart.theme);
  const topIndent = themeManager.getOptions('topIndent');
  const bottomIndent = themeManager.getOptions('bottomIndent');
  that._indent = {
    top: topIndent >= 0 && topIndent < 1 ? topIndent : 0,
    bottom: bottomIndent >= 0 && bottomIndent < 1 ? bottomIndent : 0
  };
  that._valueAxis = themeManager.getOptions('valueAxisRangeSelector') || {};
  that._hideChart = false;
  that._series = that._calculateSeries(options);
  that._seriesFamilies = [];
};
exports.SeriesDataSource = SeriesDataSource;
SeriesDataSource.prototype = {
  constructor: SeriesDataSource,
  _calculateSeries: function (options) {
    const that = this;
    const series = [];
    let particularSeriesOptions;
    let seriesTheme;
    const data = options.dataSource || [];
    let parsedData;
    const chartThemeManager = that._themeManager;
    const seriesTemplate = chartThemeManager.getOptions('seriesTemplate');
    let allSeriesOptions = seriesTemplate ? (0, _utils.processSeriesTemplate)(seriesTemplate, data) : options.chart.series;
    let dataSourceField;
    const valueAxis = that._valueAxis;
    let i;
    let newSeries;
    let groupsData;
    if (options.dataSource && !allSeriesOptions) {
      dataSourceField = options.dataSourceField || 'arg';
      allSeriesOptions = {
        argumentField: dataSourceField,
        valueField: dataSourceField
      };
      that._hideChart = true;
    }
    allSeriesOptions = Array.isArray(allSeriesOptions) ? allSeriesOptions : allSeriesOptions ? [allSeriesOptions] : [];
    for (i = 0; i < allSeriesOptions.length; i++) {
      particularSeriesOptions = (0, _extend.extend)(true, {}, allSeriesOptions[i]);
      particularSeriesOptions.rotated = false;
      seriesTheme = chartThemeManager.getOptions('series', particularSeriesOptions, allSeriesOptions.length);
      seriesTheme.argumentField = seriesTheme.argumentField || options.dataSourceField; // B253068
      if (!seriesTheme.name) {
        seriesTheme.name = 'Series ' + (i + 1).toString();
      }
      if (data && data.length > 0) {
        // TODO
        newSeries = new _base_series.Series({
          renderer: options.renderer,
          argumentAxis: options.argumentAxis,
          valueAxis: options.valueAxis,
          incidentOccurred: options.incidentOccurred
        }, seriesTheme);
        series.push(newSeries);
      }
    }
    if (series.length) {
      groupsData = {
        groups: [{
          series: series,
          valueAxis: options.valueAxis,
          valueOptions: {
            type: valueAxis.type,
            valueType: dataSourceField ? options.valueType : valueAxis.valueType
          }
        }],
        argumentOptions: {
          categories: options.categories,
          argumentType: options.valueType,
          type: options.axisType
        }
      };
      parsedData = (0, _data_validator.validateData)(data, groupsData, options.incidentOccurred, chartThemeManager.getOptions('dataPrepareSettings'));
      that.argCategories = groupsData.categories;
      for (i = 0; i < series.length; i++) {
        series[i].updateData(parsedData[series[i].getArgumentField()]);
      }
    }
    return series;
  },
  createPoints() {
    if (this._series.length === 0) {
      return;
    }
    const series = this._series;
    const viewport = new _range.Range();
    const axis = series[0].getArgumentAxis();
    const themeManager = this._themeManager;
    const negativesAsZeroes = themeManager.getOptions('negativesAsZeroes');
    const negativesAsZeros = themeManager.getOptions('negativesAsZeros'); // misspelling case

    series.forEach(function (s) {
      viewport.addRange(s.getArgumentRange());
    });
    axis.getTranslator().updateBusinessRange(viewport);
    series.forEach(function (s) {
      s.createPoints();
    });
    this._seriesFamilies = processSeriesFamilies(series, themeManager.getOptions('minBubbleSize'), themeManager.getOptions('maxBubbleSize'), {
      barGroupPadding: themeManager.getOptions('barGroupPadding'),
      barGroupWidth: themeManager.getOptions('barGroupWidth')
    }, (0, _type.isDefined)(negativesAsZeroes) ? negativesAsZeroes : negativesAsZeros);
  },
  adjustSeriesDimensions: function () {
    (0, _iterator.each)(this._seriesFamilies, function (_, family) {
      family.adjustSeriesDimensions();
    });
  },
  getBoundRange: function () {
    const that = this;
    let rangeData;
    const valueAxis = that._valueAxis;
    const valRange = new _range.Range({
      min: valueAxis.min,
      minVisible: valueAxis.min,
      max: valueAxis.max,
      maxVisible: valueAxis.max,
      axisType: valueAxis.type,
      base: valueAxis.logarithmBase
    });
    const argRange = new _range.Range({});
    let rangeYSize;
    let rangeVisibleSizeY;
    let minIndent;
    let maxIndent;
    (0, _iterator.each)(that._series, function (_, series) {
      rangeData = series.getRangeData();
      valRange.addRange(rangeData.val);
      argRange.addRange(rangeData.arg);
    });
    if (!valRange.isEmpty() && !argRange.isEmpty()) {
      minIndent = valueAxis.inverted ? that._indent.top : that._indent.bottom;
      maxIndent = valueAxis.inverted ? that._indent.bottom : that._indent.top;
      rangeYSize = valRange.max - valRange.min;
      rangeVisibleSizeY = ((0, _type.isNumeric)(valRange.maxVisible) ? valRange.maxVisible : valRange.max) - ((0, _type.isNumeric)(valRange.minVisible) ? valRange.minVisible : valRange.min);
      // B253717
      if ((0, _type.isDate)(valRange.min)) {
        valRange.min = new Date(valRange.min.valueOf() - rangeYSize * minIndent);
      } else {
        valRange.min -= rangeYSize * minIndent;
      }
      if ((0, _type.isDate)(valRange.max)) {
        valRange.max = new Date(valRange.max.valueOf() + rangeYSize * maxIndent);
      } else {
        valRange.max += rangeYSize * maxIndent;
      }
      if ((0, _type.isNumeric)(rangeVisibleSizeY)) {
        valRange.maxVisible = valRange.maxVisible ? valRange.maxVisible + rangeVisibleSizeY * maxIndent : undefined;
        valRange.minVisible = valRange.minVisible ? valRange.minVisible - rangeVisibleSizeY * minIndent : undefined;
      }
      valRange.invert = valueAxis.inverted;
    }
    return {
      arg: argRange,
      val: valRange
    };
  },
  getMarginOptions: function (canvas) {
    const bubbleSize = Math.min(canvas.width, canvas.height) * this._themeManager.getOptions('maxBubbleSize');
    return this._series.reduce(function (marginOptions, series) {
      const seriesOptions = series.getMarginOptions();
      if (seriesOptions.processBubbleSize === true) {
        seriesOptions.size = bubbleSize;
      }
      return (0, _utils.mergeMarginOptions)(marginOptions, seriesOptions);
    }, {});
  },
  getSeries: function () {
    return this._series;
  },
  isEmpty: function () {
    return this.getSeries().length === 0;
  },
  isShowChart: function () {
    return !this._hideChart;
  },
  getCalculatedValueType: function () {
    const series = this._series[0];
    return series === null || series === void 0 ? void 0 : series.argumentType;
  },
  getThemeManager: function () {
    return this._themeManager;
  }
};