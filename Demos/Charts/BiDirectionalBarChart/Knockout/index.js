window.onload = function () {
  const viewModel = {
    chartOptions: {
      title: 'Population Pyramid For Norway 2016',
      dataSource,
      rotated: true,
      barGroupWidth: 18,
      commonSeriesSettings: {
        type: 'stackedbar',
        argumentField: 'age',
      },
      series: [{
        valueField: 'male',
        name: 'Male',
        color: '#3F7FBF',
      }, {
        valueField: 'female',
        name: 'Female',
        color: '#F87CCC',
      }],
      tooltip: {
        enabled: true,
        customizeTooltip() {
          return {
            text: Math.abs(this.valueText),
          };
        },
      },
      valueAxis: {
        label: {
          customizeText() {
            return `${Math.abs(this.value)}%`;
          },
        },
      },
      legend: {
        verticalAlignment: 'bottom',
        horizontalAlignment: 'center',
        margin: { left: 50 },
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};
