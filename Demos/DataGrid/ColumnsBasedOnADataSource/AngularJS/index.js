const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.gridOptions = {
    dataSource: orders,
    keyExpr: 'OrderNumber',
    showBorders: true,
  };
});
