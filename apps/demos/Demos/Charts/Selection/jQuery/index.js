$(() => {
  $('#chart').dxChart({
    rotated: true,
    dataSource,
    commonSeriesSettings: {
      argumentField: 'country',
      type: 'bar',
      hoverMode: 'allArgumentPoints',
      selectionMode: 'allArgumentPoints',
      label: {
        visible: true,
        format: {
          type: 'percent',
          precision: 1,
        },
      },
    },
    valueAxis: {
      label: {
        format: {
          type: 'percent',
          precision: 1,
        },
      },
    },
    series: [
      { valueField: 'year2007', name: '2007 - 2008' },
      { valueField: 'year2008', name: '2008 - 2009' },
    ],
    title: {
      text: 'Economy - Export Change',
    },
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
    onLegendClick(e) {
      const series = e.target;
      if (series.isVisible()) {
        series.hide();
      } else {
        series.show();
      }
    },
  });
});
