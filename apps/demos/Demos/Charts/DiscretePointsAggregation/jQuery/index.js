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
      nameField: 'year',
      customizeSeries(seriesName) {
        const isGhost = seriesName.endsWith(' (max)');
        const year = isGhost ? seriesName.slice(0, -6) : seriesName;

        return {
          barOverlapGroup: year,
          ...(isGhost && {
            aggregation: { enabled: true, method: 'max' },
            color: '#d3d3d3',
            name: `${year} max`,
            showInLegend: false,
          }),
        };
      },
    },
  }).dxChart('instance');

  const aggregationFunctions = [
    { displayName: 'Average', func: 'avg' },
    { displayName: 'Maximum', func: 'max' },
    { displayName: 'Minimum', func: 'min' },
  ];

  $('#useAggregationToggle').dxCheckBox({
    text: 'Aggregation enabled',
    value: true,
    onValueChanged({ value }) {
      chart.option('commonSeriesSettings.aggregation.enabled', value);
    },
  });

  $('#aggregateFunctionSelector').dxSelectBox({
    items: aggregationFunctions,
    value: 'avg',
    valueExpr: 'func',
    displayExpr: 'displayName',
    inputAttr: { 'aria-label': 'Method' },
    onValueChanged({ value }) {
      chart.option('commonSeriesSettings.aggregation.method', value);
    },
  });
});
