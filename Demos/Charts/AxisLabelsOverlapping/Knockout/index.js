window.onload = function () {
  const currentMode = ko.observable(overlappingModes[0]);
  const viewModel = {
    chartOptions: {
      dataSource: population,
      series: [{
        argumentField: 'country',
      }],
      argumentAxis: {
        label: {
          wordWrap: 'none',
          overlappingBehavior: currentMode,
        },
      },
      legend: {
        visible: false,
      },
      title: 'Population by Countries',
    },
    overlappingModesOption: {
      dataSource: overlappingModes,
      value: currentMode,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};
