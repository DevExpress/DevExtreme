var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.chartOptions = {
        palette: "bright",
        dataSource: dataSource,
        title: "Top internet languages",
        legend: {
            horizontalAlignment: "center",
            verticalAlignment: "bottom"
        },
        "export": {
            enabled: true
        },
        series: [{
            argumentField: "language",
            valueField: "percent",
            label: {
                visible: true,
                connector: {
                    visible: true,
                    width: 0.5
                },
                format: "fixedPoint",
                customizeText: function (point) {
                    return point.argumentText + ": " + point.valueText + "%";
                }
            },
            smallValuesGrouping: {
                mode: "smallValueThreshold",
                threshold: 4.5
            }
        }]
    };
});