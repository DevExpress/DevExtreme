window.onload = function () {
  const currentType = ko.observable(types[0]);

  const viewModel = {
    chartOptions: {
      palette: 'violet',
      dataSource,
      commonSeriesSettings: {
        type: currentType,
        argumentField: 'year',
      },
      commonAxisSettings: {
        grid: {
          visible: true,
        },
      },
      margin: {
        bottom: 20,
      },
      series: [
        { valueField: 'smp', name: 'SMP' },
        { valueField: 'mmp', name: 'MMP' },
        { valueField: 'cnstl', name: 'Cnstl' },
        { valueField: 'cluster', name: 'Cluster' },
      ],
      tooltip: {
        enabled: true,
      },
      legend: {
        verticalAlignment: 'top',
        horizontalAlignment: 'right',
      },
      export: {
        enabled: true,
      },
      argumentAxis: {
        label: {
          format: {
            type: 'decimal',
          },
        },
        allowDecimals: false,
        axisDivisionFactor: 60,
      },
      title: 'Architecture Share Over Time (Count)',
    },
    typesOptions: {
      dataSource: types,
      value: currentType,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};
