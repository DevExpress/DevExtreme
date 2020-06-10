var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.switchOn = {
        value: true
    };
    $scope.switchOff = {
        value: false
    };
    $scope.switchValue = false; 
    $scope.handlerSwitch = {
        bindingOptions: {
            value: "switchValue"
        }
    };
    $scope.disabled = {
        disabled: true,
        bindingOptions: {
            value: "switchValue"
        }
    };
                
});