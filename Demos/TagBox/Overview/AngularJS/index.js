var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.editableProducts = simpleProducts.slice();
    
    $scope.tagBox = {
        simple: {
            items: simpleProducts
        },
        searchOptions: {
            items: simpleProducts,
            searchEnabled: true
        },
        selectionOptions: {
            items: simpleProducts,
            showSelectionControls: true,
            applyValueMode: "useButtons"
        },
        hideOptions: {
            items: simpleProducts,
            hideSelectedItems: true
        },
        lineOptions: {
            items: simpleProducts,
            multiline: false
        },
        fieldEditOptions: {
            acceptCustomValue: true,
            bindingOptions: {
                items: "editableProducts"
            },
            onCustomItemCreating: function(args) {
                var newValue = args.text;
                $scope.editableProducts.unshift(newValue);
                args.customItem = newValue;
            }
        },
        withCustomPlaceholder: {
            items: simpleProducts,
            placeholder: "Choose Product..."
        },
        disabled: {
            items: simpleProducts,
            value: [simpleProducts[0]],
            disabled: true
        },
        dataSourceUsage: {
            dataSource: new DevExpress.data.ArrayStore({ 
                data: products,
                key: "ID"
            }),
            displayExpr: "Name",
            valueExpr: "ID",
        },
        customTemplate: {
            dataSource: products,
            displayExpr: "Name",
            valueExpr: "ID",
            itemTemplate: "customItem"
        }
    };
});