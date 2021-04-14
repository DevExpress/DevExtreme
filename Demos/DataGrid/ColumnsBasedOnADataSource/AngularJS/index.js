var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.gridOptions = {
        dataSource: orders,
        keyExpr: 'OrderNumber',
        showBorders: true
    };
    
});