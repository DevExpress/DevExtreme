window.onload = function () {
  const viewModel = {
    chartOptions: {
      palette: 'bright',
      dataSource,
      title: 'Top internet languages',
      legend: {
        horizontalAlignment: 'center',
        verticalAlignment: 'bottom',
      },
      export: {
        enabled: true,
      },
      series: [{
        argumentField: 'language',
        valueField: 'percent',
        label: {
          visible: true,
          connector: {
            visible: true,
            width: 0.5,
          },
          format: 'fixedPoint',
          customizeText(point) {
            return `${point.argumentText}: ${point.valueText}%`;
          },
        },
        smallValuesGrouping: {
          mode: 'smallValueThreshold',
          threshold: 4.5,
        },
      }],
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};
