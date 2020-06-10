var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.pyramidOptions = {
        dataSource: dataSource,
        valueField: "count",
        argumentField: "level",
        title: {
            text: "Team Composition",
            margin: {
                bottom: 30
            }
        },
        tooltip: {
            enabled: true
        },
        inverted: true,
        algorithm: "dynamicHeight",
        item: {
            border: {
                visible: true
            }
        },
        legend: {
            visible: true
        },
        label: {
            visible: true,
            backgroundColor: "none",
            horizontalAlignment: "left",
            font: {
                size: 16
            }
        },
        palette: 'Harmony light',
        sortData: false
    };
});