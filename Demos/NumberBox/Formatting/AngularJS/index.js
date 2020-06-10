var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.currencyFormat = {
        format: "$ #,##0.##",
        value: 14500.55
    };

    $scope.accountingFormat = {
        format: "$ #,##0.##;($ #,##0.##)",
        value: -2314.12,
    };

    $scope.percentFormat = {
        format: "#0%",
        value: 0.15,
        step: 0.01
    };

    $scope.fixedPointFormat = {
        format: "#,##0.00",
        value: 13415.24
    };

    $scope.weightFormat = {
        format: "#0.## kg",
        value: 3.14
    };
});