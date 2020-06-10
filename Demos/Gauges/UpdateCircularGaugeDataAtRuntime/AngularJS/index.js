var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.value = dataSource[0].mean;
    $scope.subvalues = [dataSource[0].min, dataSource[0].max];
    
    $scope.gaugeOptions = {
        bindingOptions: {
            value: "value",
            subvalues: "subvalues"
        },
        scale: {
            startValue: 10,
            endValue: 40,
            tickInterval: 5,
            label: {
                customizeText: function (arg) {
                    return arg.valueText + " °C";
                }
            }
        },
        rangeContainer: {
            ranges: [
                { startValue: 10, endValue: 20, color: "#0077BE" },
                { startValue: 20, endValue: 30, color: "#E6E200" },
                { startValue: 30, endValue: 40, color: "#77DD77" }
            ]
        },
        tooltip: { enabled: true },
        title: {
            text: "Temperature in the Greenhouse",
            font: { size: 28 }
        }
    };
    
    $scope.selectBoxOptions = {
        width: 150,
        dataSource: dataSource,
        displayExpr: "name",
        value: dataSource[0],
        onValueChanged: function(e) {
            var value = e.value;
            $scope.value = value.mean;
            $scope.subvalues = [value.min, value.max];
        }
    };
});