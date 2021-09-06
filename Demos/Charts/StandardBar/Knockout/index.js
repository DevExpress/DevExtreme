window.onload = function () {
  const viewModel = {
    chartOptions: {
      dataSource,
      series: {
        argumentField: 'day',
        valueField: 'oranges',
        name: 'My oranges',
        type: 'bar',
        color: '#ffaa66',
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};
