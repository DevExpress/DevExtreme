var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.gaugeOptions = {
        scale: {
            startValue: 0, 
            endValue: 20,
            tickInterval: 5
        },
        value: 12,
        subvalues: [8, 18],
        tooltip: {
            enabled: true,
            customizeTooltip: function (arg) {
                return {
                    text: arg.valueText + " ohm"
                };
            },
            font: {
                color: "#DCD0FF",
                size: 40
            }
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Rheostat Resistance",
            font: { size: 28 }
        }
    };
});