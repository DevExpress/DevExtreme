var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.maxDisplayedTags = {
        items: products,
        value: [1, 2, 3, 4],
        displayExpr: "Name",
        valueExpr: "ID",
        showSelectionControls: true,
        maxDisplayedTags: 3
    };
    
    $scope.onMultiTagPreparing = {
        items: products.slice(0, 5),
        value: [1, 2, 3, 4, 5],
        displayExpr: "Name",
        valueExpr: "ID",
        showSelectionControls: true,
        maxDisplayedTags: 3,
        onMultiTagPreparing: function(args){
            var selectedItemsLength = args.selectedItems.length,
                totalCount = 5;
    
            if (selectedItemsLength < totalCount) {
                args.cancel = true;
            } else {
                args.text = "All selected (" + selectedItemsLength + ")";
            }
        }
    };
    
    $scope.showMultiTagOnly = {
        items: products,
        value: [1, 2, 3, 4, 5, 6, 7],
        displayExpr: "Name",
        valueExpr: "ID",
        showSelectionControls: true,
        maxDisplayedTags: 2,
        showMultiTagOnly: false
    };
});