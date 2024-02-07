const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.tileViewOptions = {
    items: homes,
    height: 390,
    baseItemHeight: 120,
    baseItemWidth: 185,
    itemMargin: 10,
  };
});
