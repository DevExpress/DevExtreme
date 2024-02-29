$(() => {
  $('#pie').dxPieChart({
    type: 'doughnut',
    dataSource,
    palette: 'Soft Pastel',
    title: 'Olympic Medals in 2008',
    legend: {
      horizontalAlignment: 'right',
      verticalAlignment: 'top',
      margin: 0,
    },
    onPointClick(arg) {
      arg.target.select();
    },
    export: {
      enabled: true,
    },
    series: [{
      argumentField: 'country',
      valueField: 'medals',
      hoverStyle: {
        color: '#ffd700',
      },
    }],
  });
});
