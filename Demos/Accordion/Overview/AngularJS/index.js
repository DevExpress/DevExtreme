var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.animationDuration = 300;
    $scope.collapsible = false;
    $scope.multiple = false;
    $scope.selectedItems = [accordionItems[0]];
    
    $scope.accordionOptions = {
        dataSource: accordionItems,
        itemTemplate: "customer",
        bindingOptions: {
            animationDuration: "animationDuration",
            collapsible: "collapsible",
            multiple: "multiple",
            selectedItems: "selectedItems"
        }
    };
    
    $scope.tagBoxOptions = {
        dataSource: accordionItems,
        displayExpr: "CompanyName",
        bindingOptions: {
            value: "selectedItems",
            disabled: "!multiple"
        }
    };
});