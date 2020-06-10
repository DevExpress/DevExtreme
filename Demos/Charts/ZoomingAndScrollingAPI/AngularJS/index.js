var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var series = [{
            argumentField: "arg",
            valueField: "y1"
        }, {
            argumentField: "arg",
            valueField: "y2"
        }, {
            argumentField: "arg",
            valueField: "y3"
        }];
    
    $scope.chartOptions = {
        palette: "Harmony Light",
        dataSource: zoomingData,
        commonSeriesSettings: {
            point: {
                size: 7
            }
        },
        series: series,
        legend:{
            visible: false
        }
    };
    
    $scope.rangeOptions = {
        size: {
            height: 120
        },
        margin: {
            left: 10
        },
        scale: {
            minorTickCount:1
        },
        dataSource: zoomingData,
        chart: {
            series: series,
            palette: "Harmony Light"
        },
        behavior: {
            callValueChanged: "onMoving"
        },
        onValueChanged: function (e) {
            var zoomedChart = $("#zoomedChart").dxChart("instance");
            zoomedChart.getArgumentAxis().visualRange(e.value);
        }
    };
});