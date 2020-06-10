var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.chartOptions = {
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: "country",
            type: "spline",        
            point: {
                hoverMode: "allArgumentPoints"
            }
        },
        argumentAxis: {
            valueMarginsEnabled: false,
            discreteAxisDivisionMode: "crossLabels",
            grid: {
                visible: true
            }
        },
        crosshair: {
            enabled: true,
            color: "#949494",
            width: 3,
            dashStyle:"dot",
            label: {
                visible: true,
                backgroundColor: "#949494",                
                font: {
                  color: "#fff",
                  size: 12,
                }
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
            itemTextPosition: "bottom",
            equalColumnWidth: true
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
});