$(() => {
  const chart = $('#chart').dxChart({
    dataSource: population,
    series: [{
      argumentField: 'country',
    }],
    argumentAxis: {
      label: {
        wordWrap: 'none',
        overlappingBehavior: overlappingModes[0],
      },
    },
    legend: {
      visible: false,
    },
    title: 'Population by Countries',
  }).dxChart('instance');

  $('#overlapping-modes').dxSelectBox({
    dataSource: overlappingModes,
    inputAttr: { 'aria-label': 'Overlapping Mode' },
    value: overlappingModes[0],
    onValueChanged(e) {
      chart.option('argumentAxis.label.overlappingBehavior', e.value);
    },
  });
});
