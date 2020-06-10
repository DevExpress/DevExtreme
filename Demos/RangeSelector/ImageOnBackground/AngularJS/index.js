var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.rangeSelectorOptions = {
        margin: {
            top: 50,
            bottom: 0
        },
        background: {
            image: {
                url: "../../../../images/RangeImage.png",
                location: "full"
            }
        },
        indent: {
            left: 65,
            right: 65
        },
        sliderMarker: {
            placeholderHeight: 30,
            format: "shorttime"
        },
        scale: {
            startValue: new Date(2012, 8, 29, 0, 0, 0),
            endValue: new Date(2012, 8, 29, 24, 0, 0),
            tickInterval: { hours: 2 },
            minorTickInterval: "hour",
            placeholderHeight: 20,
            label: { format: "shorttime" }
        },
        value: [new Date(2012, 8, 29, 11, 0, 0), new Date(2012, 8, 29, 17, 0, 0)],
        title: "Select a Time Period"
    };
});