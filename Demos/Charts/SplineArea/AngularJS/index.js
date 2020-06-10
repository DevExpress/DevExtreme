var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.currentType = types[0];
    
    $scope.chartOptions = {
        palette: "Harmony Light",
        title: "Corporations with Highest Market Value",
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: "company"
        },
        bindingOptions: { 
            "commonSeriesSettings.type": "currentType"
        },
        argumentAxis: {
            valueMarginsEnabled: false
        },
        margin: {
            bottom: 20
        },
        series: [
            { valueField: "y2005", name: "2005" },
            { valueField: "y2004", name: "2004" }
        ],
        "export": {
            enabled: true
        },
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        }
    };
    
    $scope.typesOptions = {
        dataSource: types,
        bindingOptions: { 
            value: "currentType"
        }
    };
});