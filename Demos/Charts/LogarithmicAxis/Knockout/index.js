window.onload = function () {
  const viewModel = {
    chartOptions: {
      dataSource,
      commonPaneSettings: {
        border: {
          visible: true,
        },
      },
      series: {
        type: 'scatter',
        valueField: 'mass',
        argumentField: 'name',
        point: {
          size: 20,
        },
      },
      customizePoint() {
        let color; let
          hoverStyle;
        switch (this.data.type) {
          case 'Star':
            color = 'red';
            hoverStyle = { border: { color: 'red' } };
            break;
          case 'Satellite':
            color = 'gray';
            hoverStyle = { border: { color: 'gray' } };
            break;
          default:
            break;
        }
        return { color, hoverStyle };
      },
      export: {
        enabled: true,
      },
      argumentAxis: {
        grid: {
          visible: true,
        },
        label: {
          rotationAngle: 20,
          overlappingBehavior: 'rotate',
        },
      },
      valueAxis: {
        type: 'logarithmic',
        title: 'Mass Relative to the Earth',
      },
      title: 'Relative Masses of the Heaviest Solar System Objects',
      legend: {
        visible: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};
