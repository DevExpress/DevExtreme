var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.checkBoxValue = undefined;
    $scope.checkBox = {
        checked: {
            value: true
        },
        unchecked: {
            value: false
        },
        indeterminate: {
            value: undefined
        },    
        handler: {
            bindingOptions: {
                value: "checkBoxValue"
            }
        },
        disabled: {
            disabled: true,
            bindingOptions: {
                value: "checkBoxValue"
            }
        },
        withText: {
            value: true,
            width: 80,
            text: "Check"
        }
    };
});