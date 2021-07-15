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
            { valueField: "year2018", name: "2018" },
            { valueField: "year2017", name: "2017" },
            { valueField: "year2016", name: "2016" }
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