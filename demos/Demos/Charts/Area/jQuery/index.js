$(() => {
  const chart = $('#chart').dxChart({
    palette: 'Harmony Light',
    dataSource,
    commonSeriesSettings: {
      type: types[0],
      argumentField: 'country',
    },
    series: [
      { valueField: 'y1564', name: '15-64 years' },
      { valueField: 'y014', name: '0-14 years' },
      { valueField: 'y65', name: '65 years and older' },
    ],
    margin: {
      bottom: 20,
    },
    title: 'Population: Age Structure (2018)',
    argumentAxis: {
      valueMarginsEnabled: false,
    },
    export: {
      enabled: true,
    },
    legend: {
      verticalAlignment: 'bottom',
      horizontalAlignment: 'center',
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
