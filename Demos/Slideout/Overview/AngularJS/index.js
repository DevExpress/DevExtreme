var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.data = products;
    $scope.menuVisible = true;
    $scope.swipeValue = true;
    
    $scope.showMenu = function() {
        $scope.menuVisible = !$scope.menuVisible;
    };
    
    $scope.toolbarItems = [{ 
        location: "before",
        widget: "dxButton",
        options: {
            icon: "menu",
            onClick: $scope.showMenu
        }
    }, { 
        location: "center",
        template: "title"
    }];
});