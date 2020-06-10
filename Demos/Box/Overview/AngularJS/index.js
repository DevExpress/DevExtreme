var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.boxOptions1 = {
        direction: "row", 
        width: "100%", 
        height: 75
    };
    
    $scope.boxOptions2 = {
        direction: "row", 
        width: "100%", 
        height: 75, 
        align: "center", 
        crossAlign: "center"
    };
    
    $scope.boxOptions3 = {
        direction: "col", 
        width: "100%", 
        height: 250
    };
    
    $scope.boxOptions4 = {
        direction: "row", 
        width: "100%", 
        height: 125
    };
});