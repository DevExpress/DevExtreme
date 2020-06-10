var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.currentType = types[0];
    
    $scope.chartOptions = {
        palette: "Violet",
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: "country"
        },
        bindingOptions: { 
            "commonSeriesSettings.type": "currentType"
        },
        margin: {
            bottom: 20
        },
        argumentAxis: {
            valueMarginsEnabled: false,
            discreteAxisDivisionMode: "crossLabels",
            grid: {
                visible: true
            }
        },
        series: [
            { valueField: "hydro", name: "Hydro-electric" },
            { valueField: "oil", name: "Oil" },
            { valueField: "gas", name: "Natural gas" },
            { valueField: "coal", name: "Coal" },
            { valueField: "nuclear", name: "Nuclear" }
        ],
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            itemTextPosition: "bottom"
        },
        title: { 
            text: "Energy Consumption in 2004",
            subtitle: {
                text: "(Millions of Tons, Oil Equivalent)"
            }
        },
        "export": {
            enabled: true
        },
        tooltip: {
            enabled: true
        }
    };
    
    $scope.typesOptions = {
        dataSource: types,
        bindingOptions: { 
            value: "currentType"
        }
    };
});