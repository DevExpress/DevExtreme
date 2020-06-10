var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.employees = employees;
    $scope.currentEmployee = {};
    $scope.visiblePopup = false;
    
    $scope.popupOptions = {
        width: 300,
        height: 250,
        contentTemplate: "info",
        showTitle: true,
        title: "Information",    
        dragEnabled: false,
        closeOnOutsideClick: true,
        bindingOptions: {
            visible: "visiblePopup",
        }
    };
    
    $scope.showInfo = function (data) {
        $scope.currentEmployee = data.model.employee;
        $scope.visiblePopup = true;
    };     
});