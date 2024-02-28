$(() => {
  $('#chart').dxChart({
    dataSource,
    commonSeriesSettings: {
      argumentField: 'state',
      type: 'stackedBar',
    },
    series: [
      { valueField: 'young', name: '0-14' },
      { valueField: 'middle', name: '15-64' },
      { valueField: 'older', name: '65 and older' },
    ],
    legend: {
      verticalAlignment: 'bottom',
      horizontalAlignment: 'center',
      itemTextPosition: 'top',
    },
    valueAxis: {
      title: {
        text: 'millions',
      },
      position: 'right',
    },
    title: 'Male Age Structure',
    export: {
      enabled: true,
    },
    tooltip: {
      enabled: true,
      location: 'edge',
      customizeTooltip(arg) {
        return {
          text: `${arg.seriesName} years: ${arg.valueText}`,
        };
      },
    },
  });
});
