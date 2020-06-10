var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.circularGaugeOptions = {
        geometry: {
            startAngle: 135,
            endAngle: 45
        },
        scale: {
            startValue: 45, 
            endValue: -45,
            tickInterval: 45,
            label: {
                customizeText: function (arg) {
                    return arg.valueText + "°";
                }
            }
        },
        valueIndicator: {
            type: "rangebar",
            baseValue: 0
        },
        value: 20
    };
    
    $scope.linearGaugeOptions = {
        geometry: { orientation: "vertical" },
        scale: {
            startValue: -45, 
            endValue: 45,
            tickInterval: 45,
            label: {
                customizeText: function (arg) {
                    return arg.valueText + "°";
                }
            }
        },
        valueIndicator: { 
            baseValue: 0
        },
        value: -10
    };
});