$(() => {
  $('#chart').dxChart({
    dataSource,
    commonSeriesSettings: {
      argumentField: 'state',
      type: 'spline',
      hoverMode: 'includePoints',
      point: {
        hoverMode: 'allArgumentPoints',
      },
    },
    series: [
      { valueField: 'year2024', name: '2024' },
      { valueField: 'year2020', name: '2020' },
      { valueField: 'year2016', name: '2016' },
    ],
    stickyHovering: false,
    title: {
      text: 'Great Lakes Gross State Product',
    },
    export: {
      enabled: true,
    },
    legend: {
      verticalAlignment: 'bottom',
      horizontalAlignment: 'center',
      hoverMode: 'excludePoints',
    },
  });
});
