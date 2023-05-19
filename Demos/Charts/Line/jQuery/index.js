$(() => {
  const chart = $('#chart').dxChart({
    palette: 'Violet',
    dataSource,
    commonSeriesSettings: {
      argumentField: 'country',
      type: types[0],
    },
    margin: {
      bottom: 20,
    },
    argumentAxis: {
      valueMarginsEnabled: false,
      discreteAxisDivisionMode: 'crossLabels',
      grid: {
        visible: true,
      },
    },
    series: [
      { valueField: 'hydro', name: 'Hydro-electric' },
      { valueField: 'oil', name: 'Oil' },
      { valueField: 'gas', name: 'Natural gas' },
      { valueField: 'coal', name: 'Coal' },
      { valueField: 'nuclear', name: 'Nuclear' },
    ],
    legend: {
      verticalAlignment: 'bottom',
      horizontalAlignment: 'center',
      itemTextPosition: 'bottom',
    },
    title: {
      text: 'Energy Consumption in 2004',
      subtitle: {
        text: '(Millions of Tons, Oil Equivalent)',
      },
    },
    export: {
      enabled: true,
    },
    tooltip: {
      enabled: true,
    },
  }).dxChart('instance');

  $('#types').dxSelectBox({
    dataSource: types,
    value: types[0],
    inputAttr: { 'aria-label': 'Series Type' },
    onValueChanged(e) {
      chart.option('commonSeriesSettings.type', e.value);
    },
  });
});
