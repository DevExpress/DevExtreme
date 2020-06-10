var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.rangeSelectorOptions = {
        margin: {
            top: 50
        },
        scale: {
            startValue: 15000,
            endValue: 150000,
            minorTickInterval: 500,
            tickInterval: 15000,
            minorTick: {
                visible: false,
            },
            label: {
                format: "currency"
            }
        },
        sliderMarker: {
            format: "currency"
        },
        value: [40000, 80000],
        title: "Select House Price Range"
    };
});