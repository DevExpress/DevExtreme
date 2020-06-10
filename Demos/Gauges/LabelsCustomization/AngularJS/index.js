var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.barGaugeOptions = {
        startValue: 0,
        endValue: 100,
        values: [47.27, 65.32, 84.59, 71.86],
        label: {
            indent: 30,
            format: {
                type: "fixedPoint",
                precision: 1
            },
            customizeText: function (arg) {
                return arg.valueText + " %";
            }
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Series' Ratings",
            font: {
                size: 28
            }
        }
    };
});