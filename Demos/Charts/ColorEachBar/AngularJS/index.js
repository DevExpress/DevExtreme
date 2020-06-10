var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.chartOptions = {
        dataSource: dataSource,
        palette: "soft",
        title: {
            text: "Age Breakdown of Facebook Users in the U.S.",
            subtitle: "as of January 2017"
        },
        commonSeriesSettings: {
            type: "bar",
            valueField: "number",
            argumentField: "age",
            ignoreEmptyPoints: true
        },
        seriesTemplate: {
            nameField: "age"
        }
    };
});