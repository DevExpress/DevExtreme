window.onload = function () {
  const viewModel = {
    chartOptions: {
      palette: 'violet',
      title: 'Crude Oil Prices in 2005',
      dataSource,
      commonSeriesSettings: {
        argumentField: 'date',
        type: 'rangeBar',
        minBarSize: 2,
      },
      series: [
        {
          rangeValue1Field: 'aVal1',
          rangeValue2Field: 'aVal2',
          name: 'ANS West Coast',
        }, {
          rangeValue1Field: 'tVal1',
          rangeValue2Field: 'tVal2',
          name: 'West Texas Intermediate',
        },
      ],
      valueAxis: {
        title: {
          text: '$ per barrel',
        },
      },
      argumentAxis: {
        label: {
          format: 'month',
        },
      },
      export: {
        enabled: true,
      },
      tooltip: {
        enabled: true,
      },
      legend: {
        verticalAlignment: 'bottom',
        horizontalAlignment: 'center',
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};
