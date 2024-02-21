$(() => {
  $('#range-selector').dxRangeSelector({
    dataSource,
    margin: {
      top: 50,
    },
    chart: {
      commonSeriesSettings: {
        argumentField: 'year',
        valueField: 'oil',
        type: 'spline',
      },
      seriesTemplate: {
        nameField: 'country',
        customizeSeries(valueFromNameField) {
          return valueFromNameField === 'USA' ? { color: 'red' } : {};
        },
      },
    },
    scale: {
      label: {
        format: {
          type: 'decimal',
        },
      },
    },
    title: 'Select a Year Period',
  });
});
