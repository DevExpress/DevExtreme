var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.chartOptions = {
        palette: "bright",
        dataSource: dataSource,
        title: "Olympic Medals in 2008",
        legend: {
            orientation: "horizontal",
            itemTextPosition: "right",
            horizontalAlignment: "center",
            verticalAlignment: "bottom",
            columnCount: 4
        },
        "export": {
            enabled: true
        },
        series: [{
            argumentField: "country",
            valueField: "medals",
            label: {
                visible: true,
                font: {
                    size: 16
                },
                connector: {
                    visible: true,
                    width: 0.5
                },
                position: "columns",
                customizeText: function(arg) {
                    return arg.valueText + " (" + arg.percentText + ")";
                }
            }
        }]
    };
});