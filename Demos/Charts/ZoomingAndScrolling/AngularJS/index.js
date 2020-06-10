var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.chartOptions = {
        palette: "Harmony Light",
        dataSource: zoomingData,
        series: [{
            argumentField: "arg",
            valueField: "y1"
        }, {
            argumentField: "arg",
            valueField: "y2"
        }],
        argumentAxis: {
            visualRange: {
                startValue: 300,
                endValue: 500
            }
        },
        scrollBar: {
            visible: true
        },
        zoomAndPan: {
            argumentAxis: "both"
        },
        legend:{
            visible: false
        }
    };
});