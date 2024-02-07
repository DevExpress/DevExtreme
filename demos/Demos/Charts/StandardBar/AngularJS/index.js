const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.chartOptions = {
    dataSource,
    series: {
      argumentField: 'day',
      valueField: 'oranges',
      name: 'My oranges',
      type: 'bar',
      color: '#ffaa66',
    },
  };
});
