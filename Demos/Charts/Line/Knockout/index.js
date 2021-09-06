window.onload = function () {
  const currentType = ko.observable(types[0]);

  const viewModel = {
    chartOptions: {
      palette: 'Violet',
      dataSource,
      commonSeriesSettings: {
        argumentField: 'country',
        type: currentType,
      },
      margin: {
        bottom: 20,
      },
      argumentAxis: {
        valueMarginsEnabled: false,
        discreteAxisDivisionMode: 'crossLabels',
        grid: {
          visible: true,
        },
      },
      series: [
        { valueField: 'hydro', name: 'Hydro-electric' },
        { valueField: 'oil', name: 'Oil' },
        { valueField: 'gas', name: 'Natural gas' },
        { valueField: 'coal', name: 'Coal' },
        { valueField: 'nuclear', name: 'Nuclear' },
      ],
      legend: {
        verticalAlignment: 'bottom',
        horizontalAlignment: 'center',
        itemTextPosition: 'bottom',
      },
      title: {
        text: 'Energy Consumption in 2004',
        subtitle: {
          text: '(Millions of Tons, Oil Equivalent)',
        },
      },
      export: {
        enabled: true,
      },
      tooltip: {
        enabled: true,
      },
    },
    typesOptions: {
      dataSource: types,
      value: currentType,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};
