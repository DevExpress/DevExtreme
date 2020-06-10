var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.chartOptions = {
        title: "Australian Medal Count",
        dataSource: dataSource,
        commonSeriesSettings: {
            type: "steparea",
            argumentField: "year",
            steparea: {
                border: {
                    visible: false
                }
            }
        },
        series: [
            { valueField: "bronze", name: "Bronze Medals", color: "#cd7f32" },
            { valueField: "silver", name: "Silver Medals", color: "#c0c0c0" },
            { valueField: "gold", name: "Gold Medals", color: "#ffd700" }
        ],
        argumentAxis: {
            valueMarginsEnabled: false,
            label: {
                format: {
                    type: "decimal"
                }
            }
        },
        "export": {
            enabled: true
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        }
    };
});