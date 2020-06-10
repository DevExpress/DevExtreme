var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.speedValue = 40;
    $scope.gaugeValue = 20;
    $scope.linearGaugeValue = 42.8;

    $scope.$watch("speedValue", function(speedValue) {
        $scope.gaugeValue = speedValue / 2;
    });

    $scope.$watch("speedValue", function(speedValue) {
        $scope.linearGaugeValue = 50 - speedValue * 0.24;
    });

    $scope.options = {
        speed: {
            geometry: {
                startAngle: 225,
                endAngle: 315
            },
            scale: {
                startValue: 20,
                endValue: 200,
                tickInterval: 20,
                minorTickInterval: 10
            },
            valueIndicator: {
                type: "twoColorNeedle",
                color: "none",
                secondFraction: 0.24,
                secondColor: "#f05b41"
            },
            bindingOptions: {
               value: "speedValue"
            },
            size: {
                width: 260 
            }
        },
        coolant: {
            geometry: { 
                startAngle: 180,
                endAngle: 90 
            },
            scale: {
                startValue: 0, 
                endValue: 100,
                tickInterval: 50
            },
            valueIndicator: {
                color: "#f05b41"
            },
            bindingOptions: {
                value: "gaugeValue",
            },
            size: {
                width: 90,
                height: 90 
            }
        },
        psi: {
            scale: { 
                startValue: 100,
                endValue: 0,
                tickInterval: 50 
             },
            geometry: { 
                startAngle: 90,
                endAngle: 0 
            },
            valueIndicator: {
                color: "#f05b41"
            },
            bindingOptions: {
                value: "gaugeValue",
            },
            size: {
                width: 90,
                height: 90 
            }
        },
        rpm: {
            scale: { 
                startValue: 100,
                endValue: 0,
                tickInterval: 50 
            },
            geometry: { 
                startAngle: -90,
                endAngle: -180 
            },
            valueIndicator: {
                color: "#f05b41"
            },
            bindingOptions: {
                value: "gaugeValue",
            },
            size: {
                width: 90,
                height: 90 
            }
        },
        instantFuel: {
            scale: {
                startValue: 0, 
                endValue: 100,
                tickInterval: 50
            },
            geometry: { 
                startAngle: 0, 
                endAngle: -90 
            },
            valueIndicator: {
                color: "#f05b41"
            },
            bindingOptions: {
                value: "gaugeValue",
            },
            size: {
                width: 90,
                height: 90 
            }
        },
        fuel: {
            scale: {
                startValue: 0,
                endValue: 50,
                tickInterval: 25,
                minorTickInterval: 12.5,
                minorTick: {
                    visible: true
                },
                label: {
                    visible: false
                }
            },
            valueIndicator: {
                color: "#f05b41",
                size: 8,
                offset: 7 
            },
            bindingOptions: {
                value: "linearGaugeValue",
            },
            size: {
                width: 90,
                height: 20
            }
        },
        slider: {
            min: 0,
            max: 200,
            bindingOptions: {
                value: "speedValue"
            },
            width: 155
        }
    };
});