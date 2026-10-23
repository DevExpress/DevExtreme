$(() => {
  const chart = $('#chart').dxChart({
    dataSource,
    title: {
      text: 'Production of Crude Oil',
      subtitle: '(in Barrels)',
    },
    commonSeriesSettings: {
      aggregation: {
        enabled: true,
        method: 'avg',
      },
      argumentField: 'state',
      valueField: 'value',
      type: 'bar',
    },
    seriesTemplate: {
      nameField: 'series',
      customizeSeries(seriesName) {
        const isMaxSeries = seriesName.endsWith(MAX_SUFFIX);
        const year = isMaxSeries ? seriesName.slice(0, -MAX_SUFFIX.length) : seriesName;

        return {
          barOverlapGroup: year,
          ...(isMaxSeries && {
            aggregation: { enabled: true, method: 'max' },
            color: '#d3d3d3',
            showInLegend: false,
          }),
        };
      },
    },
    tooltip: {
      enabled: true,
      format: {
        type: 'millions',
        precision: 1,
      },
      customizeTooltip({
        argumentText, seriesName, valueText, point,
      }) {
        const { month } = point.data;

        return {
          text: `<b>${argumentText}</b><br/>${seriesName}${month ? ` (${month})` : ''}: ${valueText}`,
        };
      },
    },
  }).dxChart('instance');

  const aggregationFunctions = [
    { displayName: 'Average', func: 'avg' },
    { displayName: 'Sum', func: 'sum' },
    { displayName: 'Minimum', func: 'min' },
  ];

  $('#useAggregationToggle').dxCheckBox({
    text: 'Aggregation enabled',
    value: true,
    onValueChanged({ value }) {
      chart.option('commonSeriesSettings.aggregation.enabled', value);
      methodSelector.option('disabled', !value);
    },
  });

  const methodSelector = $('#aggregateFunctionSelector').dxSelectBox({
    items: aggregationFunctions,
    value: 'avg',
    valueExpr: 'func',
    displayExpr: 'displayName',
    inputAttr: { 'aria-label': 'Method' },
    onValueChanged({ value }) {
      chart.option('commonSeriesSettings.aggregation.method', value);
    },
  }).dxSelectBox('instance');
});
