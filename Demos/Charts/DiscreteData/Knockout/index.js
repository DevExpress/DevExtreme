window.onload = function () {
  const seriesType = ko.observable('scatter');

  const viewModel = {
    polarChartOptions: {
      margin: {
        top: 50,
        bottom: 50,
        left: 100,
      },
      dataSource,
      series: [{ valueField: 'day', name: 'Day', color: '#ba4d51' },
        { valueField: 'night', name: 'Night', color: '#5f8b95' }],
      commonSeriesSettings: {
        type: seriesType,
      },
    },
    selectBoxOptions: {
      width: 200,
      dataSource: types,
      value: seriesType,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};
