$(() => {
  const chart = $('#chart').dxChart({
    palette: 'violet',
    dataSource,
    commonSeriesSettings: {
      type: types[0],
      argumentField: 'year',
    },
    commonAxisSettings: {
      grid: {
        visible: true,
      },
    },
    margin: {
      bottom: 20,
    },
    series: [
      { valueField: 'smp', name: 'SMP' },
      { valueField: 'mmp', name: 'MMP' },
      { valueField: 'cnstl', name: 'Cnstl' },
      { valueField: 'cluster', name: 'Cluster' },
    ],
    tooltip: {
      enabled: true,
    },
    legend: {
      verticalAlignment: 'top',
      horizontalAlignment: 'right',
    },
    export: {
      enabled: true,
    },
    argumentAxis: {
      label: {
        format: {
          type: 'decimal',
        },
      },
      allowDecimals: false,
      axisDivisionFactor: 60,
    },
    title: 'Architecture Share Over Time (Count)',
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
