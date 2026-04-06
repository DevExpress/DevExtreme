$(() => {
  $('#chart').dxChart({
    dataSource,
    commonSeriesSettings: {
      argumentField: 'state',
      type: 'bar',
      hoverMode: 'allArgumentPoints',
      selectionMode: 'allArgumentPoints',
      label: {
        visible: true,
        format: {
          type: 'fixedPoint',
          precision: 0,
        },
      },
    },
    series: [
      { valueField: 'year2024', name: '2024' },
      { valueField: 'year2023', name: '2023' },
      { valueField: 'year2022', name: '2022' },
    ],
    title: 'Gross State Product within the Great Lakes Region (Billions USD)',
    legend: {
      verticalAlignment: 'bottom',
      horizontalAlignment: 'center',
    },
    export: {
      enabled: true,
    },
    onPointClick(e) {
      e.target.select();
    },
  });
});
