var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.gaugeOptions = {
        scale: {
            startValue: 0, endValue: 100,
            tick: {
                color: "#536878"
            },
            tickInterval: 10,
            label: {
                indentFromTick: 3
            }
        },
        rangeContainer: {
            offset: 10,
            ranges: [
                { startValue: 0, endValue: 30, color: "#92000A" },
                { startValue: 30, endValue: 70, color: "#E6E200" },
                { startValue: 70, endValue: 100, color: "#77DD77" }
            ]
        },
        valueIndicator: {
            offset: 50
        },
        subvalueIndicator: {
            offset: -25
        },
        title: {
            text: "Amount of Tickets Sold (with Min and Max Expected)",
            font: { size: 28 }
        },
        "export": {
            enabled: true
        },
        value: 85,
        subvalues: [40, 90]
    };
});