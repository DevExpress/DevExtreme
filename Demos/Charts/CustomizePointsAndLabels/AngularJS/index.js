var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var highAverage = 77,
        lowAverage = 58;

    $scope.chartOptions = {
        dataSource: dataSource,
        customizePoint: function () {
            if (this.value > highAverage) {
                return { color: "#ff7c7c", hoverStyle: { color: "#ff7c7c" } };
            } else if (this.value < lowAverage) {
                return { color: "#8c8cff", hoverStyle: { color: "#8c8cff" } };
            }
        },
        customizeLabel: function () {
            if (this.value > highAverage) {
                return {
                    visible: true,
                    backgroundColor: "#ff7c7c",
                    customizeText: function () {
                        return this.valueText + "&#176F";
                    }
                };
            }
        },
        "export": {
            enabled: true
        },
        valueAxis: {
            visualRange: {
                startValue: 40
            },
            maxValueMargin: 0.01,
            label: {
                customizeText: function () {
                    return this.valueText + "&#176F";
                }
            },
            constantLines: [{
                label: {
                    text: "Low Average"
                },
                width: 2,
                value: lowAverage,
                color: "#8c8cff",
                dashStyle: "dash"
            }, {
                label: {
                    text: "High Average"
                },
                width: 2,
                value: highAverage,
                color: "#ff7c7c",
                dashStyle: "dash"
            }]
        },
        series: [{
            argumentField: "day",
            valueField: "temperature",
            type: "bar",
            color: "#e7d19a"
        }],
        title: {
            text: "Daily Temperature in May"
        },
        legend: {
            visible: false
        }
    };
});