const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.chartOptions = {
    palette: 'soft',
    title: 'The Chemical Composition of the Earth Layers',
    valueAxis: {
      label: {
        customizeText() {
          return `${this.valueText}%`;
        },
      },
    },
    dataSource,
    series,
    commonSeriesSettings: {
      type: 'bar',
      ignoreEmptyPoints: true,
    },
    legend: {
      border: {
        visible: true,
      },
      visible: true,
      verticalAlignment: 'top',
      horizontalAlignment: 'right',
      orientation: 'horizontal',
    },
  };

  $scope.rangeOptions = {
    size: {
      height: 120,
    },
    margin: {
      left: 10,
    },
    scale: {
      minorTickCount: 1,
    },
    dataSource,
    chart: {
      palette: 'soft',
      commonSeriesSettings: {
        type: 'bar',
        ignoreEmptyPoints: true,
      },
      series,
    },
    behavior: {
      valueChangeMode: 'onHandleMove',
    },
    onValueChanged(e) {
      const zoomedChart = $('#chart-demo #zoomedChart').dxChart('instance');
      zoomedChart.getArgumentAxis().visualRange(e.value);
    },
  };
});
