const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.chartOptions = {
    title: 'Life Expectancy vs. Birth Rates',
    zoomAndPan: {
      valueAxis: 'both',
      argumentAxis: 'both',
      dragToZoom: true,
      allowMouseWheel: true,
      panKey: 'shift',
    },
    onInitialized(e) {
      $scope.chart = e.instance;
    },
    dataSource: birthLife,
    commonSeriesSettings: {
      type: 'scatter',
      argumentField: 'life_exp',
      valueField: 'birth_rate',
      point: {
        size: 8,
      },
    },
    seriesTemplate: {
      nameField: 'year',
    },
    valueAxis: {
      title: 'Birth Rate',
    },
    argumentAxis: {
      title: 'Life Expectancy',
    },
    crosshair: {
      enabled: true,
      label: {
        visible: true,
      },
    },
    tooltip: {
      enabled: true,
      customizeTooltip(arg) {
        const { data } = arg.point;
        return {
          text: `${data.country} ${data.year}`,
        };
      },
    },
    legend: {
      position: 'inside',
      border: {
        visible: true,
      },
    },
  };

  $scope.buttonOptions = {
    text: 'Reset',
    onClick() {
      $('#chart').dxChart('resetVisualRange');
    },
  };
});
