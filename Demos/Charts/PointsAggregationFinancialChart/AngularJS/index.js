var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.chartOptions = {
        title: "Google Inc. Stock Prices",
        dataSource: dataSource,
        valueAxis: {
            valueType: "numeric"
        },
        margin: {
            right: 10
        },
        argumentAxis: {
            grid: {
                visible: true
            },
            label: {
                visible: false
            },
            valueMarginsEnabled: false,
            argumentType: "datetime"
        },
        tooltip: {
            enabled: true
        },
        legend: {
            visible: false
        },
        series: [{
            type: "candleStick",
            openValueField: "Open",
            highValueField: "High",
            lowValueField: "Low",
            closeValueField: "Close",
            argumentField: "Date",
            aggregation: {
                enabled: true
            }
        }]
    };
    
    $scope.rangeOptions = {
        size: {
            height: 120
        },
        dataSource: dataSource,
        chart: {
            valueAxis: { valueType: "numeric" },
            series: {
                type: "line",
                valueField: "Open",
                argumentField: "Date",
                aggregation: {
                    enabled: true
                }
            }
        },
        scale: {
            minorTickInterval: "day",
            tickInterval: "month",
            valueType: "datetime",
            aggregationInterval: "week",
            placeholderHeight: 20
        },
        behavior: {
            callValueChanged: "onMoving",
            snapToTicks: false
        },
        onValueChanged: function (e) {
            var zoomedChart = $("#chart-demo #zoomedChart").dxChart("instance");
            zoomedChart.getArgumentAxis().visualRange(e.value);
        }
    };
});