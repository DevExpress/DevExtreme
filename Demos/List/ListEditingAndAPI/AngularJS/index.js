var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.itemDeleteMode = "toggle";
    $scope.allowDeletion = false;

    $scope.listOptions = {
        dataSource: tasks,
        height: 400,
        bindingOptions: {
            allowItemDeleting: "allowDeletion",
            itemDeleteMode: "itemDeleteMode"
        }
    };

    $scope.itemDeleteModeOptions = {
        dataSource: ["static", "toggle", "slideButton", "slideItem", "swipe", "context"],
        bindingOptions: {
            disabled: "!allowDeletion",
            value: "itemDeleteMode"
        }
    };

    $scope.allowDeletionOptions = {
        text: "Allow deletion",
        bindingOptions: {
            value: "allowDeletion"
        }
    };
});