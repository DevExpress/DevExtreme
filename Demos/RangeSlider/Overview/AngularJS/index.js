var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.startValue = 10;
    $scope.endValue = 90;
    $scope.numberBox = {
        startValue: {
            min: 0,
            max: 100,
            showSpinButtons: true,
            bindingOptions: { 
                value: "startValue"
            }
        },
        endValue: {
            min: 0,
            max: 100,
            showSpinButtons: true,
            bindingOptions: { 
                value: "endValue"
            }
        }
    };
    $scope.rangeSlider = {
        simple: {
            min: 0,
            max: 100,
            start: 20,
            end: 60
        },
        withLabel: {
            min: 0,
            max: 100,
            start: 35,
            end: 65,
            label: {
                visible: true,
                format: function(value) {
                    return value + "%";
                },
                position: "top"
            }
        },
        withTooltip: {
            min: 0,
            max: 100,
            start: 15,
            end: 65,
            tooltip: {
                enabled: true,
                format: function (value) {
                    return value + "%";
                },
                showMode: "always", 
                position: "bottom"
            }
        },
        withHideRange: {
            min: 0,
            max: 100,
            start: 20,
            end: 80,
            showRange: false
        },
        withStep: {
            min: 0,
            max: 100,
            start: 20,
            end: 70,
            step: 10,
            tooltip: {
                enabled: true
            }
        },
        disabled: {
            min: 0,
            max: 100,
            start: 25,
            end: 75,
            disabled: true
        },
        handler: {
            min: 0,
            max: 100,
            bindingOptions: { 
                start: "startValue",
                end: "endValue"
            }
        }
    };
});