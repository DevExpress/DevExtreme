const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.polarChartOptions = {
    dataSource,
    series: [{ type: 'area', name: 'Function' }],
    legend: {
      visible: false,
    },
    argumentAxis: {
      inverted: true,
      startAngle: 90,
      tickInterval: 30,
    },
    valueAxis: {
      inverted: true,
    },
    export: {
      enabled: true,
    },
    title: 'Inverted Rose in Polar Coordinates',
  };
});
