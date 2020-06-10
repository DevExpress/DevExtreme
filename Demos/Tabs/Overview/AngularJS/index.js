var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.longTabsOptions = {
        dataSource: longtabs
    };
    
    $scope.scrolledTabsOptions = {
        dataSource: longtabs,
        width: 300,
        scrollByContent: true,
        showNavButtons: true
    };
    
    
    $scope.tabs = tabs;
    $scope.selectedTab = 0;
    $scope.$watch("selectedTab", function(newValue) {
        $scope.tabContent = tabs[newValue].content;
    });
    
});