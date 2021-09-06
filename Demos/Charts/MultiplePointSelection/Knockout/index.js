window.onload = function () {
  const viewModel = {
    chartOptions: {
      rotated: true,
      pointSelectionMode: 'multiple',
      dataSource,
      commonSeriesSettings: {
        argumentField: 'country',
        type: 'stackedbar',
        selectionStyle: {
          hatching: {
            direction: 'left',
          },
        },
      },
      series: [
        { valueField: 'gold', name: 'Gold Medals', color: '#ffd700' },
        { valueField: 'silver', name: 'Silver Medals', color: '#c0c0c0' },
        { valueField: 'bronze', name: 'Bronze Medals', color: '#cd7f32' },
      ],
      title: {
        text: 'Olympic Medals in 2008',
      },
      export: {
        enabled: true,
      },
      legend: {
        verticalAlignment: 'bottom',
        horizontalAlignment: 'center',
      },
      onPointClick(e) {
        const point = e.target;
        if (point.isSelected()) {
          point.clearSelection();
        } else {
          point.select();
        }
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};
