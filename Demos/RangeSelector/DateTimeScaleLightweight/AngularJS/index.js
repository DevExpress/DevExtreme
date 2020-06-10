var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.rangeSelectorOptions = {
        margin: {
            top: 50
        },
        scale: {
            startValue: new Date(2011, 1, 1),
            endValue: new Date(2011, 6, 1),
            minorTickInterval: "day",
            tickInterval: "week",
            minRange: "week",
            maxRange: "month",
            minorTick: {
                visible: false,
            }
        },
        sliderMarker: {
            format: "monthAndDay"
        },
        value: [new Date(2011, 1, 5), new Date(2011, 2, 5)],
        title: "Select a Vacation Period"
    };
});