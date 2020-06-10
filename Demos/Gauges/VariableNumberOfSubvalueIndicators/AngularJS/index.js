var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.gaugeValue = dataSource[0].primary;
    $scope.gaugeSubvalues = dataSource[0].secondary;
    
    $scope.linearGaugeOptions = {
        bindingOptions: {
            value: "gaugeValue",
            subvalues: "gaugeSubvalues"
        },
        scale: {
            startValue: 0, 
            endValue: 10,
            tickInterval: 2,
            label: {
                customizeText: function (arg) {
                    return arg.valueText + " kW";
                }
            }
        },
        tooltip: { 
            enabled: true,
            customizeTooltip: function (arg) {
                var result = arg.valueText + " kW";
                if (arg.index >= 0) {
                    result = "Secondary " + (arg.index + 1) + ": " + result;
                } else {
                    result = "Primary: " + result;
                }
                return {
                    text: result
                };
            }
        },
        "export": {
            enabled: true
        },
        title: {
            text: "Power of Air Conditioners in Store Departments (kW)",
            font: { size: 28 }
        }
    };
    
    $scope.selectBoxOptions = {
        dataSource: dataSource,
        displayExpr: "name",
        onValueChanged: function(e) {
            var value = e.value;
    
            $scope.gaugeValue = value.primary;
            $scope.gaugeSubvalues = value.secondary;
        },
        value: dataSource[0],
        width: 200
    };
});