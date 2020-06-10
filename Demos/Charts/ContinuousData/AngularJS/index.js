var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.polarChartOptions = {
        dataSource: dataSource,
        series: [{type: "line"}],
        legend: {
            visible: false
        },
        argumentAxis: {
            inverted: true,
            startAngle: 90,
            tickInterval: 30
        },
        "export": {
            enabled: true
        },
        title: "Rose in Polar Coordinates"
    };
});