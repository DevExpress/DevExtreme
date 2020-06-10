var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var scale = {
        startValue: 0, endValue: 100,
        tickInterval: 50,
        label: {
            customizeText: function (arg) {
                return arg.valueText + " %";
            }
        }
    };
    
    $scope.rectangleIndicator = {
        scale: scale,
        value: 75,
        valueIndicator: {
            type: "rectangle",
            color: "#9B870C"
        }
    };
    
    $scope.rhombusIndicator = {
        scale: scale,
        value: 80,
        valueIndicator: {
            type: "rhombus",
            color: "#779ECB"
        }
    };
    
    $scope.circleIndicator = {
        scale: scale,
        value: 65,
        valueIndicator: {
            type: "circle",
            color: "#8FBC8F"
        }
    };
    
    $scope.rangebarIndicator = {
        scale: scale,
        value: 90,
        valueIndicator: {
            type: "rangebar",
            color: "#483D8B"
        }
    };
    
    $scope.textCloudIndicator = {
        scale: scale,
        value: 70,
        valueIndicator: {
            type: "textCloud",
            color: "#734F96"
        }
    };
    
    $scope.triangleMarkerIndicator = {
        scale: scale,
        value: 85,
        valueIndicator: {
            type: "triangleMarker",
            color: "#f05b41"
        }
    };
});