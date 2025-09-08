/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDate, isDefined, isNumeric } from '@js/core/utils/type';
import { ThemeManager as ChartThemeManager } from '@ts/viz/components/chart_theme_manager';
import { validateData } from '@ts/viz/components/data_validator';
import { SeriesFamily } from '@ts/viz/core/series_family';
import { mergeMarginOptions, processSeriesTemplate } from '@ts/viz/core/utils';
import { Series } from '@ts/viz/series/base_series';
import { Range } from '@ts/viz/translators/range';

const createThemeManager = function (chartOptions) {
  return new ChartThemeManager({
    options: chartOptions,
    themeSection: 'rangeSelector.chart',
    fontFields: ['commonSeriesSettings.label.font'],
  });
};

const processSeriesFamilies = function (series, minBubbleSize, maxBubbleSize, barOptions, negativesAsZeroes) {
  const families = [];
  const types = [];

  each(series, (i, item) => {
    // @ts-expect-error
    if (!types.includes(item.type)) {
      // @ts-expect-error
      types.push(item.type);
    }
  });

  each(types, (_, type) => {
    const family = new SeriesFamily({
      type,
      minBubbleSize,
      maxBubbleSize,
      barGroupPadding: barOptions.barGroupPadding,
      barGroupWidth: barOptions.barGroupWidth,
      negativesAsZeroes,
    });
    family.add(series);
    family.adjustSeriesValues();
    // @ts-expect-error
    families.push(family);
  });

  return families;
};

export const SeriesDataSource = function (options) {
  const that = this;
  const themeManager = that._themeManager = createThemeManager(options.chart);

  themeManager.setTheme(options.chart.theme);
  const topIndent = themeManager.getOptions('topIndent');
  const bottomIndent = themeManager.getOptions('bottomIndent');

  that._indent = {
    top: topIndent >= 0 && topIndent < 1 ? topIndent : 0,
    bottom: bottomIndent >= 0 && bottomIndent < 1 ? bottomIndent : 0,
  };
  that._valueAxis = themeManager.getOptions('valueAxisRangeSelector') || {};
  that._hideChart = false;

  that._series = that._calculateSeries(options);
  that._seriesFamilies = [];
};

SeriesDataSource.prototype = {
  constructor: SeriesDataSource,

  _calculateSeries(options) {
    const that = this;
    const series = [];
    let particularSeriesOptions;
    let seriesTheme;
    const data = options.dataSource || [];
    let parsedData;
    const chartThemeManager = that._themeManager;
    const seriesTemplate = chartThemeManager.getOptions('seriesTemplate');
    let allSeriesOptions = seriesTemplate ? processSeriesTemplate(seriesTemplate, data) : options.chart.series;
    let dataSourceField;
    const valueAxis = that._valueAxis;
    let i;
    let newSeries;
    let groupsData;

    if (options.dataSource && !allSeriesOptions) {
      dataSourceField = options.dataSourceField || 'arg';
      allSeriesOptions = {
        argumentField: dataSourceField,
        valueField: dataSourceField,
      };
      that._hideChart = true;
    }

    allSeriesOptions = Array.isArray(allSeriesOptions) ? allSeriesOptions : allSeriesOptions ? [allSeriesOptions] : [];

    for (i = 0; i < allSeriesOptions.length; i++) {
      particularSeriesOptions = extend(true, {}, allSeriesOptions[i]);

      particularSeriesOptions.rotated = false;

      seriesTheme = chartThemeManager.getOptions('series', particularSeriesOptions, allSeriesOptions.length);
      seriesTheme.argumentField = seriesTheme.argumentField || options.dataSourceField;// B253068
      if (!seriesTheme.name) {
        seriesTheme.name = `Series ${(i + 1).toString()}`;
      }
      if (data && data.length > 0) {
        // TODO
        newSeries = new Series({
          renderer: options.renderer,
          argumentAxis: options.argumentAxis,
          valueAxis: options.valueAxis,
          incidentOccurred: options.incidentOccurred,
        }, seriesTheme);
        // @ts-expect-error
        series.push(newSeries);
      }
    }

    if (series.length) {
      groupsData = {
        groups: [{
          series,
          valueAxis: options.valueAxis,
          valueOptions: {
            type: valueAxis.type,
            valueType: dataSourceField ? options.valueType : valueAxis.valueType,
          },
        }],
        argumentOptions: {
          categories: options.categories,
          argumentType: options.valueType,
          type: options.axisType,
        },
      };
      parsedData = validateData(data, groupsData, options.incidentOccurred, chartThemeManager.getOptions('dataPrepareSettings'));
      that.argCategories = groupsData.categories;
      for (i = 0; i < series.length; i++) {
        // @ts-expect-error
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
    const viewport = new Range();
    const axis = series[0].getArgumentAxis();
    const themeManager = this._themeManager;
    const negativesAsZeroes = themeManager.getOptions('negativesAsZeroes');
    const negativesAsZeros = themeManager.getOptions('negativesAsZeros'); // misspelling case

    series.forEach((s) => {
      viewport.addRange(s.getArgumentRange());
    });

    axis.getTranslator().updateBusinessRange(viewport);

    series.forEach((s) => { s.createPoints(); });

    this._seriesFamilies = processSeriesFamilies(
      series,
      themeManager.getOptions('minBubbleSize'),
      themeManager.getOptions('maxBubbleSize'),
      {
        barGroupPadding: themeManager.getOptions('barGroupPadding'),
        barGroupWidth: themeManager.getOptions('barGroupWidth'),
      },
      isDefined(negativesAsZeroes) ? negativesAsZeroes : negativesAsZeros,
    );
  },

  adjustSeriesDimensions() {
    each(this._seriesFamilies, (_, family) => {
      family.adjustSeriesDimensions();
    });
  },

  getBoundRange() {
    const that = this;
    let rangeData;
    const valueAxis = that._valueAxis;
    const valRange = new Range({
      min: valueAxis.min,
      minVisible: valueAxis.min,
      max: valueAxis.max,
      maxVisible: valueAxis.max,
      axisType: valueAxis.type,
      base: valueAxis.logarithmBase,
    });
    const argRange = new Range({});
    let rangeYSize;
    let rangeVisibleSizeY;
    let minIndent;
    let maxIndent;

    each(that._series, (_, series) => {
      rangeData = series.getRangeData();
      valRange.addRange(rangeData.val);
      argRange.addRange(rangeData.arg);
    });

    if (!valRange.isEmpty() && !argRange.isEmpty()) {
      minIndent = valueAxis.inverted ? that._indent.top : that._indent.bottom;
      maxIndent = valueAxis.inverted ? that._indent.bottom : that._indent.top;
      rangeYSize = valRange.max - valRange.min;
      rangeVisibleSizeY = (isNumeric(valRange.maxVisible) ? valRange.maxVisible : valRange.max) - (isNumeric(valRange.minVisible) ? valRange.minVisible : valRange.min);
      // B253717
      if (isDate(valRange.min)) {
        valRange.min = new Date(valRange.min.valueOf() - rangeYSize * minIndent);
      } else {
        valRange.min -= rangeYSize * minIndent;
      }
      if (isDate(valRange.max)) {
        valRange.max = new Date(valRange.max.valueOf() + rangeYSize * maxIndent);
      } else {
        valRange.max += rangeYSize * maxIndent;
      }

      if (isNumeric(rangeVisibleSizeY)) {
        valRange.maxVisible = isDefined(valRange.maxVisible) ? valRange.maxVisible + rangeVisibleSizeY * maxIndent : undefined;
        valRange.minVisible = isDefined(valRange.minVisible) ? valRange.minVisible - rangeVisibleSizeY * minIndent : undefined;
      }
      valRange.invert = valueAxis.inverted;
    }

    return { arg: argRange, val: valRange };
  },

  getMarginOptions(canvas) {
    const bubbleSize = Math.min(canvas.width, canvas.height) * this._themeManager.getOptions('maxBubbleSize');

    return this._series.reduce((marginOptions, series) => {
      const seriesOptions = series.getMarginOptions();

      if (seriesOptions.processBubbleSize === true) {
        seriesOptions.size = bubbleSize;
      }
      return mergeMarginOptions(marginOptions, seriesOptions);
    }, {});
  },

  getSeries() {
    return this._series;
  },

  isEmpty() {
    return this.getSeries().length === 0;
  },

  isShowChart() {
    return !this._hideChart;
  },

  getCalculatedValueType() {
    const series = this._series[0];
    return series?.argumentType;
  },

  getThemeManager() {
    return this._themeManager;
  },
};
