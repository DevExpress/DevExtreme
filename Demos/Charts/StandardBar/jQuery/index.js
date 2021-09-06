$(() => {
  $('#chart').dxChart({
    dataSource,
    series: {
      argumentField: 'day',
      valueField: 'oranges',
      name: 'My oranges',
      type: 'bar',
      color: '#ffaa66',
    },
  });
});
