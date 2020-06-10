var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.currentType = types[0];
    
    $scope.chartOptions = {
        palette: "violet",
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: "year"
        },
        bindingOptions: { 
            "commonSeriesSettings.type": "currentType"
        },
        commonAxisSettings: {
            grid: {
                visible: true
            }
        },
        margin: {
            bottom: 20
        },
        series: [
            { valueField: "smp", name: "SMP" },
            { valueField: "mmp", name: "MMP" },
            { valueField: "cnstl", name: "Cnstl" },
            { valueField: "cluster", name: "Cluster" }
        ],
        tooltip:{
            enabled: true
        },
        legend: {
            verticalAlignment: "top",
            horizontalAlignment: "right"
        },
        "export": {
            enabled: true
        },
        argumentAxis: {
            label:{
                format: {
                    type: "decimal"
                }
            },
            allowDecimals: false,
            axisDivisionFactor: 60
        },
        title: "Architecture Share Over Time (Count)"
    };
    
    $scope.typesOptions = {
        dataSource: types,
        bindingOptions: { 
            value: "currentType"
        }
    };
});