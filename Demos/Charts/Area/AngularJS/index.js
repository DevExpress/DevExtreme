var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.currentType = types[0];

    $scope.chartOptions = {
        palette: "Harmony Light",
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: "country"
        },
        series: [
            { valueField: "y1564", name: "15-64 years" },
            { valueField: "y014", name: "0-14 years" },
            { valueField: "y65", name: "65 years and older" }
        ],
        margin: {
            bottom: 20
        },
        title: "Population: Age Structure (2000)",
        argumentAxis: {
            valueMarginsEnabled: false
        },
        "export": {
            enabled: true
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        bindingOptions: {
            "commonSeriesSettings.type": "currentType"
        }
    };

    $scope.typesOptions = {
        dataSource: types,
        bindingOptions: {
            value: "currentType"
        }
    };
});