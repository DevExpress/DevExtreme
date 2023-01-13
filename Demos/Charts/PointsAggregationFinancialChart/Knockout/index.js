window.onload = function () {
  const viewModel = {
    chartOptions: {
      title: 'Google Inc. Stock Prices',
      dataSource,
      valueAxis: {
        valueType: 'numeric',
      },
      margin: {
        right: 10,
      },
      argumentAxis: {
        grid: {
          visible: true,
        },
        label: {
          visible: false,
        },
        valueMarginsEnabled: false,
        argumentType: 'datetime',
      },
      tooltip: {
        enabled: true,
      },
      legend: {
        visible: false,
      },
      series: [{
        type: 'candleStick',
        openValueField: 'Open',
        highValueField: 'High',
        lowValueField: 'Low',
        closeValueField: 'Close',
        argumentField: 'Date',
        aggregation: {
          enabled: true,
        },
      }],
    },
    rangeOptions: {
      size: {
        height: 120,
      },
      dataSource,
      chart: {
        valueAxis: { valueType: 'numeric' },
        series: {
          type: 'line',
          valueField: 'Open',
          argumentField: 'Date',
          aggregation: {
            enabled: true,
          },
        },
      },
      scale: {
        minorTickInterval: 'day',
        tickInterval: 'month',
        valueType: 'datetime',
        aggregationInterval: 'week',
        placeholderHeight: 20,
      },
      behavior: {
        valueChangeMode: 'onHandleMove',
        snapToTicks: false,
      },
      onValueChanged(e) {
        const zoomedChart = $('#chart-demo #zoomedChart').dxChart('instance');
        zoomedChart.zoomArgument(new Date(e.value[0]), new Date(e.value[1]));
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('chart-demo'));
};
