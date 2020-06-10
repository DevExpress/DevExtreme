var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.gaugeOptions = {
        scale: {
            startValue: 0,
            endValue: 100,
            tickInterval: 10,
            label: {
                customizeText: function (arg) {
                    return arg.valueText + " %";
                }
            }
        },
        rangeContainer: {
            ranges: [
                { startValue: 0, endValue: 20, color: "#CE2029" },
                { startValue: 20, endValue: 50, color: "#FFD700" },
                { startValue: 50, endValue: 100, color: "#228B22" }
            ]
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Battery Charge",
            font: { size: 28 }
        },
        value: 45
    };
});