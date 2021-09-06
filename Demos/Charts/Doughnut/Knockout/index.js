window.onload = function () {
  const viewModel = {
    chartOptions: {
      type: 'doughnut',
      palette: 'Soft Pastel',
      dataSource,
      title: 'The Population of Continents and Regions',
      tooltip: {
        enabled: true,
        format: 'millions',
        customizeTooltip(arg) {
          return {
            text: `${arg.valueText} - ${(arg.percent * 100).toFixed(2)}%`,
          };
        },
      },
      legend: {
        horizontalAlignment: 'right',
        verticalAlignment: 'top',
        margin: 0,
      },
      export: {
        enabled: true,
      },
      series: [{
        argumentField: 'region',
        label: {
          visible: true,
          format: 'millions',
          connector: {
            visible: true,
          },
        },
      }],
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};
