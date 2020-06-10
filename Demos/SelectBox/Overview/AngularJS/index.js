var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.currentProduct = simpleProducts[0];
    $scope.selectBox = {
        simple: {
            items: simpleProducts
        },
        withCustomPlaceholder: {
            items: simpleProducts,
            placeholder: "Choose Product",
            showClearButton: true
        },
        readOnly: {
            items: simpleProducts,
            value: simpleProducts[0],
            readOnly: true
        },
        disabled: {
            items: simpleProducts,
            value: simpleProducts[0],
            disabled: true
        },
        dataSourceUsage: {
            dataSource: new DevExpress.data.ArrayStore({ 
                data: products,
                key: "ID"
            }),
            displayExpr: "Name",
            valueExpr: "ID",
            value: products[0].ID,
        },
        customTemplates: {
            dataSource: products,
            displayExpr: "Name",
            valueExpr: "ID",
            value: products[3].ID,
            fieldTemplate: "field"
        },    
        eventHandler: {
            items: simpleProducts,
            bindingOptions: {
                value: "currentProduct"
            }
        }
    };
});