var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.defaultOptions = {
        target: "#link1",        
        showEvent: "mouseenter",
        hideEvent: "mouseleave",
        position: "top",
        width: 300,
        visible: false
    };
    
    $scope.withTitleOptions =  {
        target: "#link2",
        showEvent: "mouseenter",
        hideEvent: "mouseleave",
        position: "bottom",
        width: 300,
        showTitle: true,
        title: "Details:",
        visible: false
    };
    
    $scope.withAnimationOptions = {
    	target: "#link3",
        showEvent: "mouseenter",
        hideEvent: "mouseleave",
        position: "top",
        width: 300,
        animation: { 
            show: {
                type: "pop",
                from: {  scale: 0 },
                to: { scale: 1 }
            },
            hide: {
                type: "fade",
                from: 1,
                to: 0
            }
        },
        visible: false
    };
    
    $scope.withShadingOptions = {
    	target: "#link4",
        showEvent: "dxclick",
        position: "top",
        width: 300,
        shading: true,
        shadingColor: "rgba(0, 0, 0, 0.5)",
        visible: false
    };
    
});