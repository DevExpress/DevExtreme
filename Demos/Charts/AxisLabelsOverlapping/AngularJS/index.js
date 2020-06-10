var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.currentMode = overlappingModes[0];

    $scope.chartOptions = {
        dataSource: population,
        series: [{
            argumentField: "country"
        }],
        argumentAxis: { label: { wordWrap: "none" } },
        bindingOptions: {
            "argumentAxis.label.overlappingBehavior": "currentMode"
        },
        legend: {
            visible: false
        },
        title: "Population by Countries"
    };

    $scope.selectBoxOptions = {
        dataSource: overlappingModes,
        bindingOptions: {
            value: "currentMode"
        }
    };
});