var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var scale = {
        startValue: 10, endValue: 50,
        tickInterval: 10,
        label: {
            customizeText: function (arg) {
                return "$" + arg.valueText;
            }
        }
    };
    
    $scope.rectangleIndicator = {
        scale: scale,
        value: 24,
        subvalues: [18, 43],
        subvalueIndicator: {
            type: "rectangle",
            color: "#9B870C"
        }
    };
    
    $scope.rhombusIndicator = {
        scale: scale,
        value: 38,
        subvalues: [18, 43],
        subvalueIndicator: {
            type: "rhombus",
            color: "#779ECB"
        }
    };
    
    $scope.circleIndicator = {
        scale: scale,
        value: 21,
        subvalues: [18, 43],
        subvalueIndicator: {
            type: "circle",
            color: "#8FBC8F"
        }
    };
    
    $scope.textCloudIndicator = {
        scale: scale,
        value: 42,
        subvalues: [18, 43],
        subvalueIndicator: {
            type: "textCloud",
            color: "#734F96"
        }
    };
    
    $scope.triangleMarkerIndicator = {
        scale: scale,
        value: 28,
        subvalues: [18, 43],
        subvalueIndicator: {
            type: "triangleMarker",
            color: "#f05b41"
        }
    };
});