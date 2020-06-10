var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.listOptions = {
        dataSource: products,
        height: "100%"
    }; 
});