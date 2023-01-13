window.onload = function () {
  const series = [{
    argumentField: 'arg',
    valueField: 'y1',
  }, {
    argumentField: 'arg',
    valueField: 'y2',
  }, {
    argumentField: 'arg',
    valueField: 'y3',
  }];

  const model = {};
  model.chartOptions = {
    palette: 'Harmony Light',
    dataSource: zoomingData,
    commonSeriesSettings: {
      point: {
        size: 7,
      },
    },
    series,
    legend: {
      visible: false,
    },
  };

  model.rangeOptions = {
    size: {
      height: 120,
    },
    margin: {
      left: 10,
    },
    scale: {
      minorTickCount: 1,
    },
    dataSource: zoomingData,
    chart: {
      series,
      palette: 'Harmony Light',
    },
    behavior: {
      valueChangeMode: 'onHandleMove',
    },
    onValueChanged(e) {
      const zoomedChart = $('#container #zoomedChart').dxChart('instance');
      zoomedChart.getArgumentAxis().visualRange(e.value);
    },
  };

  ko.applyBindings(model, $('#container')[0]);
};
