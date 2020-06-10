var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.filterBuilderValue = filter;
    $scope.dataGridFilter = filter;

    $scope.filterBuilderOptions = {
        fields: fields,
        bindingOptions: {
            value: "filterBuilderValue"
        }
    };

    $scope.buttonOptions = {
        text: "Apply Filter",
        type: "default",
        onClick: function() {
            $scope.dataGridFilter = $scope.filterBuilderValue;
        },
    };

    $scope.dataGridOptions = {
        columns: fields,
        showBorders: true,
        dataSource: {
            store: {
                type: "odata",
                fieldTypes: {
                    "Product_Cost": "Decimal",
                    "Product_Sale_Price": "Decimal",
                    "Product_Retail_Price": "Decimal"
                },
                url: "https://js.devexpress.com/Demos/DevAV/odata/Products"
            },
            select: [
                "Product_ID",
                "Product_Name",
                "Product_Cost",
                "Product_Sale_Price",
                "Product_Retail_Price",
                "Product_Current_Inventory"
            ]
        },
        bindingOptions: {
            "filterValue": "dataGridFilter"
        },
        height: 300
    };

});