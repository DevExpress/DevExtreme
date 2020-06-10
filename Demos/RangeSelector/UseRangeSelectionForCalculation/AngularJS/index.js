var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.workingDaysCount = 260;
    $scope.behavior = {
        callValueChanged: "onMoving"
    };
    
    $scope.rangeSelectorOptions = {
        bindingOptions: {
           behavior: "behavior" 
        },
        margin: {
            top: 50
        },
        scale: {
            startValue: new Date(2011, 0, 1),
            endValue: new Date(2011, 11, 31),
            minorTickInterval: "day",
            tickInterval: "month",
            minorTick: {
                visible: false,
            },
            marker: { visible: false },
            label: {
                format: "MMM"
            }
        },
        sliderMarker: {
            format: "dd EEEE"
        },
        title: "Calculate the Working Days Count in a Date Period",
        onValueChanged: function (e) {
            var currentDate = new Date(e.value[0]),
                workingDaysCount = 0;
    
            while (currentDate <= e.value[1]) {
                if(currentDate.getDay() > 0 && currentDate.getDay() < 6) { 
                    workingDaysCount++;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            $scope.workingDaysCount = workingDaysCount.toFixed();
        }
    };
    
    $scope.selectBoxOptions = {
        bindingOptions: {
            value: "behavior.callValueChanged"
        },
        dataSource: ["onMoving", "onMovingComplete"],
        width: 210
    };
});