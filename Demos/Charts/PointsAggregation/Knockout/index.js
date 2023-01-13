window.onload = function () {
  const dataSource = [];
  const max = 5000;
  let i;

  for (i = 0; i < max; i += 1) {
    dataSource.push({ arg: i, val: i + i * (Math.random() - 0.5) });
  }

  const model = {};
  model.chartOptions = {
    dataSource,
    argumentAxis: {
      valueMarginsEnabled: false,
    },
    valueAxis: {
      label: {
        format: {
          type: 'fixedPoint',
        },
      },
    },
    legend: {
      visible: false,
    },
    series: {
      point: {
        size: 7,
      },
      aggregation: {
        enabled: true,
      },
    },
  };

  model.rangeOptions = {
    size: {
      height: 120,
    },
    dataSource,
    chart: {
      series: {
        aggregation: {
          enabled: true,
        },
      },
    },
    scale: {
      minRange: 1,
    },
    sliderMarker: {
      format: {
        type: 'decimal',
        precision: 0,
      },
    },
    behavior: {
      valueChangeMode: 'onHandleMove',
      snapToTicks: false,
    },
    onValueChanged(e) {
      const zoomedChart = $('#chart-demo #zoomedChart').dxChart('instance');
      zoomedChart.zoomArgument(e.value[0], e.value[1]);
    },
  };

  ko.applyBindings(model, $('#chart-demo')[0]);
};
