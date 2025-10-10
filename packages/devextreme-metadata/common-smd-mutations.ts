import { replaceTypes, ReplaceTypesMutation } from 'devextreme-internal-tools/ts/config/metadata';

const commonSeriesOptions = [
  'area',
  'bar',
  'bubble',
  'candlestick',
  'fullStackedArea',
  'fullStackedBar',
  'fullStackedLine',
  'fullStackedSplineArea',
  'fullStackedSpline',
  'line',
  'rangeArea',
  'rangeBar',
  'scatter',
  'splineArea',
  'spline',
  'stackedArea',
  'stackedBar',
  'stackedLine',
  'stackedSplineArea',
  'stackedSpline',
  'stepArea',
  'stepLine',
  'stock',
].map((i) => i.toLowerCase());

export const replaceTypesMutations: ReplaceTypesMutation[] = [
  replaceTypes(
    commonSeriesOptions.map((p) => `viz/chart:CommonSeriesSettings.${p}`),
    ['any'],
    [{ kind: 'unknown', customName: 'ChartCommonSeriesSettings' }],
  ),

  replaceTypes(
    commonSeriesOptions.map((p) => `viz/polar_chart:CommonSeriesSettings.${p}`),
    ['any'],
    [{ kind: 'unknown', customName: 'PolarChartCommonSeriesSettings' }],
  ),

  replaceTypes(
    ['viz/range_selector:dxRangeSelectorOptions.chart.commonSeriesSettings'],
    ['*'],
    [{ kind: 'unknown', customName: 'ChartCommonSeriesSettings' }],
  ),
];
