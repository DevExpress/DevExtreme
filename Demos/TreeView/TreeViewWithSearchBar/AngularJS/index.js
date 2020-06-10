var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.searchMode = "contains";
    
    $scope.treeViewOptions = {
        bindingOptions: {
            searchMode: "searchMode",
        },
        items: products,
        width: 500,
        searchEnabled: true
    };

    $scope.searchModeOptions = {
        bindingOptions: {
            value: "searchMode"
        },
    	items: ["contains", "startswith"]
    };
});