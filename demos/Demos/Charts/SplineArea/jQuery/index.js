$(() => {
  const chart = $('#chart').dxChart({
    palette: 'Harmony Light',
    title: 'Corporations with Highest Market Value',
    dataSource,
    commonSeriesSettings: {
      type: types[0],
      argumentField: 'company',
    },
    argumentAxis: {
      valueMarginsEnabled: false,
    },
    margin: {
      bottom: 20,
    },
    series: [
      { valueField: 'y2005', name: '2005' },
      { valueField: 'y2004', name: '2004' },
    ],
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
    inputAttr: { 'aria-label': 'Series Type' },
    value: types[0],
    onValueChanged(e) {
      chart.option('commonSeriesSettings.type', e.value);
    },
  });
});
