var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.itemCount = tabPanelItems.length;
    $scope.selectedIndex = 0;
    $scope.animationEnabled = true;
    $scope.swipeEnabled = true;
    $scope.loop = false;
    
    $scope.tabPanelOptions = {
    	height: 260,
        dataSource: tabPanelItems,
        itemTemplate: "customer",
        bindingOptions: {
            selectedIndex: "selectedIndex",
            loop: "loop",
            animationEnabled: "animationEnabled",
            swipeEnabled: "swipeEnabled"
        }     
    };
    
});