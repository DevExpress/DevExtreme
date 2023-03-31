$(() => {
  $('#chart').dxChart({
    dataSource,
    title: {
      text: 'Production of Crude Oil',
      subtitle: '(in Barrels)',
    },
    commonSeriesSettings: {
      aggregation: {
        enabled: true,
        method: 'sum',
      },
      argumentField: 'state',
      valueField: 'value',
      type: 'bar',
    },
    seriesTemplate: {
      nameField: 'year',
    },
  });
});
