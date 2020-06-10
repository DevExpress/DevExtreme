var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.deleteType = "toggle";
    $scope.allowEditing = false;
    $scope.selectedItems = [];

    $scope.listOptions = {
        dataSource: tasks,
        height: 400,
        showSelectionControls: true,
        selectionMode: "multiple",
        bindingOptions: {
            allowItemDeleting: "allowEditing",
            itemDeleteMode: "deleteType",
            selectedItems: "selectedItems"
        }
    };

    $scope.deleteTypeOptions = {
        dataSource: ["static", "toggle", "slideButton", "slideItem", "swipe", "context"],
        bindingOptions: {
            disabled: "!allowEditing",
            value: "deleteType"
        }
    };

    $scope.allowEditingOptions = {
        text: "Allow deleting",
        bindingOptions: {
            value: "allowEditing"
        }
    };
});