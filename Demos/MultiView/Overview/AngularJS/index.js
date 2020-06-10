var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.itemCount = multiViewItems.length;
    $scope.selectedIndex = 0;
    $scope.animationEnabled = true;
    $scope.loop = false;
    
    $scope.multiViewOptions = {
    	height: 300,
        dataSource: multiViewItems,
        itemTemplate: "customer",
        bindingOptions: {
            selectedIndex: "selectedIndex",
            loop: "loop",
            animationEnabled: "animationEnabled"
        }    
    };
});