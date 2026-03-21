$(() => {
  $('#pie').dxPieChart({
    palette: 'bright',
    dataSource,
    title: 'Olympic Medals in 2024',
    legend: {
      orientation: 'horizontal',
      itemTextPosition: 'right',
      horizontalAlignment: 'center',
      verticalAlignment: 'bottom',
      columnCount: 4,
    },
    export: {
      enabled: true,
    },
    series: [{
      argumentField: 'country',
      valueField: 'medals',
      label: {
        visible: true,
        font: {
          size: 16,
        },
        connector: {
          visible: true,
          width: 0.5,
        },
        position: 'columns',
        customizeText(arg) {
          return `${arg.valueText} (${arg.percentText})`;
        },
      },
    }],
  });
});
