var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.lineStyleValue = lineStyles[0];
    $scope.breaksCountValue = breaksCount[2];
    $scope.autoBreaksEnabledValue = true;

    $scope.chartOptions = {
        dataSource: dataSource,
        series: {
            type: "bar",
            valueField: "mass",
            argumentField: "name"
        },
        bindingOptions: {
            "valueAxis.autoBreaksEnabled": "autoBreaksEnabledValue",
            "valueAxis.maxAutoBreakCount": "breaksCountValue",
            "valueAxis.breakStyle.line": "lineStyleValue"
        },
        valueAxis: {
            visible: true
        },
        title: "Relative Masses of the Heaviest\n Solar System Objects",
        legend: {
            visible: false
        },
        tooltip: {
            enabled: true
        }
    };

    $scope.breaksCheckBoxOptions = {
        text: "Enable Breaks",
        bindingOptions: {
            value: "autoBreaksEnabledValue"
        }
    };

    $scope.maxCountSelectBoxOptions = {
        items: breaksCount,
        width: 60,
        bindingOptions: {
            value: "breaksCountValue"
        }
    };

    $scope.lineStyleSelectBoxOptions = {
        items: lineStyles,
        width: 120,
        bindingOptions: {
            value: "lineStyleValue"
        }
    };
});