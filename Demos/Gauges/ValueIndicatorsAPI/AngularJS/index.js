var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.mainGenerator = 34;
    $scope.subValueOne = 12;
    $scope.subValueTwo = 23;
    $scope.additionalGenerators = [12, 23];
    $scope.gauge = {
        value: $scope.mainGenerator,
        subvalues: $scope.additionalGenerators
    };
    
    $scope.gaugeOptions = {
        bindingOptions: {
            value: "gauge.value",
            subvalues: "gauge.subvalues"
        },
        scale: {
            startValue: 10, 
            endValue: 40,
            tickInterval: 5,
            label: {
                customizeText: function (arg) {
                    return arg.valueText + " kV";
                }
            }
        },
        tooltip: { enabled: true },
        title: {
            text: "Generators Voltage (kV)",
            font: { size: 28 }
        }
    };
    
    $scope.mainGeneratorOptions = {
        bindingOptions: {
            value: "mainGenerator"
        },
        min: 10,
        max: 40,
        width: 100,
        showSpinButtons: true
    };
    
    $scope.additionalGeneratorOne = {
        bindingOptions: {
            value: "subValueOne"
        },
        min: 10,
        max: 40,
        width: 100,
        showSpinButtons: true
    };
    
    $scope.additionalGeneratorTwo = {
        bindingOptions: {
            value: "subValueTwo"
        },
        min: 10,
        max: 40,
        width: 100,
        showSpinButtons: true
    };
    
    $scope.editButton = {
        text: "Apply",
        width: 100,
        onClick: function(e) {
             $scope.additionalGenerators = [$scope.subValueOne, $scope.subValueTwo];        
             $scope.gauge = {
                 value: $scope.mainGenerator,
                 subvalues: $scope.additionalGenerators
             };
        }
    };
});