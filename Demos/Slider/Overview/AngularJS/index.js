var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.value = 10;
    $scope.numberBoxOptions = {
        min: 0,
        max: 100,
        showSpinButtons: true,
        bindingOptions: { 
            value: "value"
        }
    };
    $scope.slider = {
        simple: {
            min: 0,
            max: 100,
            value: 90,
        },
        withLabel: {
            min: 0,
            max: 100,
            value: 50,
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
            value: 35,
            rtlEnabled: false,
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
            value: 20,
            showRange: false
        },
        withStep: {
            min: 0,
            max: 100,
            value: 10,
            step: 10,
            tooltip: {
                enabled: true
            }
        },
        disabled: {
            min: 0,
            max: 100,
            value: 50,
            disabled: true
        },
        eventHandlingOptions: {
            min: 0,
            max: 100,
            bindingOptions: { 
                value: "value"
            }
        }
    };
});