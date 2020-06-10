var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.chartOptions = {
        dataSource: dataSource,
        commonSeriesSettings: {
            argumentField: "state",
            type: "fullStackedBar"
        },
        series: [
            { valueField: "maleyoung", name: "Male: 0-14", stack: "male" },
            { valueField: "malemiddle", name: "Male: 15-64", stack: "male" },
            { valueField: "maleolder", name: "Male: 65 and older", stack: "male" },
            { valueField: "femaleyoung", name: "Female: 0-14", stack: "female" },
            { valueField: "femalemiddle", name: "Female: 15-64", stack: "female" },
            { valueField: "femaleolder", name: "Female: 65 and older", stack: "female" }
        ],
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center"
        },
        title: "Population: Age Structure",
        "export": {
            enabled: true
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (arg) {
                return {
                    text: arg.percentText + " - " + arg.valueText
                };
            }
        }
    };
});