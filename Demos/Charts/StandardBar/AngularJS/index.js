var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.chartOptions = {
        dataSource: dataSource,
        series: {
            argumentField: "day",
            valueField: "oranges",
            name: "My oranges",
            type: "bar",
            color: '#ffaa66'
        }
    };
});