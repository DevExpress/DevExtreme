const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.listOptions = {
    dataSource: products,
    height: '100%',
  };
});
