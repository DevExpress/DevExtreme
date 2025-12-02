$(() => {
  const chart = $('#chart').dxChart({
    dataSource,
    rotated: true,
    title: {
      text: 'Most Popular US Cat Breeds',
    },
    commonSeriesSettings: {
      argumentField: 'breed',
      type: 'bar',
    },
    series: {
      valueField: 'count',
      name: 'breeds',
      color: '#a3d6d2',
      selectionStyle: {
        color: '#ec2e7a',
        hatching: { direction: 'none' },
      },
    },
    legend: {
      visible: false,
    },
    export: {
      enabled: true,
    },
    onPointClick(e) {
      const point = e.target;
      if (point.isSelected()) {
        point.clearSelection();
      } else {
        point.select();
      }
    },
  }).dxChart('instance');

  chart.getSeriesByPos(0).getPointsByArg('Siamese')[0].select();
});
