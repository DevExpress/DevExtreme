var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.chartOptions = {
        title: "Stock Price",
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: "date",
            type: "stock"
        },
        series: [
            {
                name: "DELL",
                openValueField: "o", 
                highValueField: "h", 
                lowValueField: "l", 
                closeValueField: "c", 
                reduction: {
                    color: "red"
                }
            }
        ],    
        valueAxis: {
            tickInterval: 1,
            title: { 
                text: "US dollars"
            },
            label: {
                format: {
                    type: "currency",
                    precision: 0
                }
            }
        },
        argumentAxis: {
            workdaysOnly: true,
            label: {
                format: "shortDate"
            }
        },
        "export": {
            enabled: true
        },
        tooltip: {
            enabled: true,
            location: "edge",
            customizeTooltip: function (arg) {
                return {
                    text: "Open: $" + arg.openValue + "<br/>" +
                            "Close: $" + arg.closeValue + "<br/>" +
                            "High: $" + arg.highValue + "<br/>" +
                            "Low: $" + arg.lowValue + "<br/>"
                };
            }
        }
    };
});