/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */

import { extend } from '@ts/core/utils/m_extend';
import { each } from '@ts/core/utils/m_iterator';
import { isDate, isDefined, isNumeric } from '@ts/core/utils/m_type';
import { ThemeManager as ChartThemeManager } from '@ts/viz/components/chart_theme_manager';
import { validateData } from '@ts/viz/components/data_validator';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { SeriesFamily } from '@ts/viz/core/series_family';
import { mergeMarginOptions, processSeriesTemplate } from '@ts/viz/core/utils';
import { Series } from '@ts/viz/series/base_series';
import { Range } from '@ts/viz/translators/range';

type ChartThemeManagerInstance = InstanceType<typeof ChartThemeManager>;

interface SeriesDataSourceOptions {
  renderer: ThemeValue;
  chart: ThemeValue;
  dataSource?: ThemeValue[];
  dataSourceField?: string;
  valueType?: string;
  axisType?: string;
  categories?: ThemeValue[];
  incidentOccurred: ThemeValue;
  argumentAxis: ThemeValue;
  valueAxis: ThemeValue;
}

interface BarOptions {
  barGroupPadding: number;
  barGroupWidth: number;
}

interface BoundRange {
  arg: ThemeValue;
  val: ThemeValue;
}

const createThemeManager = function (chartOptions: ThemeValue): ChartThemeManagerInstance {
  return new ChartThemeManager({
    options: chartOptions,
    themeSection: 'rangeSelector.chart',
    fontFields: ['commonSeriesSettings.label.font'],
  });
};

const processSeriesFamilies = function (series: ThemeValue[], minBubbleSize: number, maxBubbleSize: number, barOptions: BarOptions, negativesAsZeroes: boolean): ThemeValue[] {
  const families: ThemeValue[] = [];
  const types: string[] = [];

  each(series, (i, item) => {
    if (!types.includes(item.type)) {
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
    families.push(family);
  });

  return families;
};

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let SeriesDataSource = class SeriesDataSource {
  declare _themeManager: ChartThemeManagerInstance;

  declare _indent: { top: number; bottom: number };

  declare _valueAxis: ThemeValue;

  declare _hideChart: boolean;

  declare _series: ThemeValue[];

  declare _seriesFamilies: ThemeValue[];

  declare argCategories?: ThemeValue[];

  constructor(options: SeriesDataSourceOptions) {
    const themeManager = this._themeManager = createThemeManager(options.chart);

    themeManager.setTheme(options.chart.theme);
    const topIndent = themeManager.getOptions('topIndent');
    const bottomIndent = themeManager.getOptions('bottomIndent');

    this._indent = {
      top: topIndent >= 0 && topIndent < 1 ? topIndent : 0,
      bottom: bottomIndent >= 0 && bottomIndent < 1 ? bottomIndent : 0,
    };
    this._valueAxis = themeManager.getOptions('valueAxisRangeSelector') || {};
    this._hideChart = false;

    this._series = this._calculateSeries(options);
    this._seriesFamilies = [];
  }

  _calculateSeries(options: SeriesDataSourceOptions): ThemeValue[] {
    const series: ThemeValue[] = [];
    let particularSeriesOptions;
    let seriesTheme;
    const data = options.dataSource || [];
    let parsedData;
    const chartThemeManager = this._themeManager;
    const seriesTemplate = chartThemeManager.getOptions('seriesTemplate');
    let allSeriesOptions = seriesTemplate ? processSeriesTemplate(seriesTemplate, data) : options.chart.series;
    let dataSourceField;
    const valueAxis = this._valueAxis;
    let i;
    let newSeries;
    let groupsData;

    if (options.dataSource && !allSeriesOptions) {
      dataSourceField = options.dataSourceField || 'arg';
      allSeriesOptions = {
        argumentField: dataSourceField,
        valueField: dataSourceField,
      };
      this._hideChart = true;
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
      this.argCategories = groupsData.categories;
      for (i = 0; i < series.length; i++) {
        series[i].updateData(parsedData[series[i].getArgumentField()]);
      }
    }
    return series;
  }

  createPoints(): void {
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
  }

  adjustSeriesDimensions(): void {
    each(this._seriesFamilies, (_, family) => {
      family.adjustSeriesDimensions();
    });
  }

  getBoundRange(): BoundRange {
    let rangeData;
    const valueAxis = this._valueAxis;
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

    each(this._series, (_, series) => {
      rangeData = series.getRangeData();
      valRange.addRange(rangeData.val);
      argRange.addRange(rangeData.arg);
    });

    if (!valRange.isEmpty() && !argRange.isEmpty()) {
      minIndent = valueAxis.inverted ? this._indent.top : this._indent.bottom;
      maxIndent = valueAxis.inverted ? this._indent.bottom : this._indent.top;
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
  }

  getMarginOptions(canvas: { width: number; height: number }): ThemeValue {
    const bubbleSize = Math.min(canvas.width, canvas.height) * this._themeManager.getOptions('maxBubbleSize');

    return this._series.reduce((marginOptions, series) => {
      const seriesOptions = series.getMarginOptions();

      if (seriesOptions.processBubbleSize === true) {
        seriesOptions.size = bubbleSize;
      }
      return mergeMarginOptions(marginOptions, seriesOptions);
    }, {});
  }

  getSeries(): ThemeValue[] {
    return this._series;
  }

  isEmpty(): boolean {
    return this.getSeries().length === 0;
  }

  isShowChart(): boolean {
    return !this._hideChart;
  }

  getCalculatedValueType(): ThemeValue {
    const series = this._series[0];
    return series?.argumentType;
  }

  getThemeManager(): ChartThemeManagerInstance {
    return this._themeManager;
  }
};

/// #DEBUG
/* eslint-disable-next-line @typescript-eslint/naming-convention
  -- description seam setter for tests stubs */
export function DEBUG_set_SeriesDataSource(value: typeof SeriesDataSource): void {
  SeriesDataSource = value;
}
/// #ENDDEBUG
