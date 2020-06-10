var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var geometry = {
            startAngle: 180, 
            endAngle: 0
        },
        scale = {
            startValue: 0,
            endValue: 100,
            tickInterval: 50,
            label: {
                customizeText: function (arg) {
                    return arg.valueText + " %";
                }
            }
        };
    
    $scope.gauge = {
        rectangleNeedleIndicator: {
            geometry: geometry,
            scale: scale,
            value: 75,
            valueIndicator: {
                type: "rectangleNeedle",
                color: "#9B870C"
            }
        },
        twoColorNeedleIndicator: {
            geometry: geometry,
            scale: scale,
            value: 80,
            valueIndicator: {
                type: "twoColorNeedle",
                color: "#779ECB",
                secondColor: "#734F96"
            }
        },
        triangleNeedleIndicator: {
            geometry: geometry,
            scale: scale,
            value: 65,
            valueIndicator: {
                type: "triangleNeedle",
                color: "#8FBC8F"
            }
        },
        rangebarIndicator: {
            geometry: geometry,
            scale: scale,
            value: 90,
            valueIndicator: {
                type: "rangebar",
                color: "#f05b41"
            }
        },
        textCloudIndicator: {
            geometry: geometry,
            scale: scale,
            value: 70,
            valueIndicator: {
                type: "textCloud",
                color: "#483D8B"
            }
        },
        triangleMarkerIndicator: {
            geometry: geometry,
            scale: scale,
            value: 85,
            valueIndicator: {
                type: "triangleMarker",
                color: "#e0e33b"
            }
        }
    };
});