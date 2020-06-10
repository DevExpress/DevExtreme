var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.chartOptions = {
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: "state",
            type: "bar",
            hoverMode: "allArgumentPoints",
            selectionMode: "allArgumentPoints",
            label: {
                visible: true,
                format: {
                    type: "fixedPoint",
                    precision: 0
                }
            }
        },
        series: [
            { valueField: "year2004", name: "2004" },
            { valueField: "year2001", name: "2001" },
            { valueField: "year1998", name: "1998" }
        ],
        title: "Gross State Product within the Great Lakes Region",
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        onPointClick: function (e) {
            e.target.select();
        }
    };
});