window.onload = function () {
  const viewModel = {
    chartOptions: {
      type: 'doughnut',
      palette: 'Soft Pastel',
      title: 'Top Internet Languages',
      dataSource,
      legend: {
        horizontalAlignment: 'center',
        verticalAlignment: 'bottom',
      },
      export: {
        enabled: true,
      },
      series: [{
        smallValuesGrouping: {
          mode: 'topN',
          topCount: 3,
        },
        argumentField: 'language',
        valueField: 'percent',
        label: {
          visible: true,
          format: 'fixedPoint',
          customizeText(point) {
            return `${point.argumentText}: ${point.valueText}%`;
          },
          connector: {
            visible: true,
            width: 1,
          },
        },
      }],
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};
