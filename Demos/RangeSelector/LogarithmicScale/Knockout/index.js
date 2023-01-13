window.onload = function () {
  const dataSource = [];
  const max = 100;

  for (let i = 0; i < max; i += 1) {
    dataSource.push({
      arg: 10 ** i * 0.1,
      val: Math.log(i + 1) / Math.log(0.5) + (Math.random() - 0.5) * (100 / (i + 1)) + 10,
    });
  }

  const viewModel = {
    chartOptions: {
      dataSource,
      resizePanesOnZoom: true,
      argumentAxis: {
        valueMarginsEnabled: false,
        type: 'logarithmic',
        label: { format: 'exponential' },
        grid: {
          visible: true,
        },
        minorGrid: {
          visible: true,
        },
        minorTickCount: 10,
      },
      legend: {
        visible: false,
      },
      series: {},
    },
    rangeSelectorOptions: {
      dataSource,
      chart: {
        series: {},
      },
      scale: {
        type: 'logarithmic',
        label: { format: 'exponential' },
        minRange: 1,
        minorTickCount: 10,
      },
      sliderMarker: {
        format: 'exponential',
      },
      behavior: {
        valueChangeMode: 'onHandleMove',
        snapToTicks: false,
      },
      onValueChanged(e) {
        $('#zoomed-chart').dxChart('instance').getArgumentAxis().visualRange(e.value);
      },
    },
  };

  ko.applyBindings(viewModel, $('#range-selector-demo').get(0));
};
