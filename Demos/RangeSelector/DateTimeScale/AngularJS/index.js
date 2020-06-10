var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.rangeSelectorOptions = {
        dataSource: dataSource,
        margin: {
            top: 50
        },
        chart: {
            commonSeriesSettings: {
                type: "steparea",
                argumentField: "date"
            },
            series: [
              { valueField: "dayT", color: "yellow" },
              { valueField: "nightT" }
            ]
        },
        scale: {
            minorTickInterval: "day",
            tickInterval: { days: 2 },
            valueType: "datetime"
        },
        sliderMarker: {
            format: "day"
        },
        value: ["2013/03/01", "2013/03/07"],
        title: "Select a Month Period"
    };
});