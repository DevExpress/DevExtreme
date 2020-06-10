var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.dataGridOptions = {
        dataSource: orders,
        keyExpr: "ID",
        showBorders: true,
        repaintChangesOnly: true,
        editing: {
            mode: "batch",
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true
        },
        columns: [{
                dataField: "OrderNumber",
                width: 130,
                caption: "Invoice Number"
            }, {
                dataField: "OrderDate",
                dataType: "date"
            }, 
            "Employee", {
                caption: "City",
                dataField: "CustomerStoreCity"
            }, {
                caption: "State",
                dataField: "CustomerStoreState"
            }, {
                dataField: "SaleAmount",
                alignment: "right",
                format: "currency",
                editorOptions: {
                    format: "currency"
                }
            }
        ],
        summary: {
            recalculateWhileEditing: true,
            totalItems: [{
                column: "OrderNumber",
                summaryType: "count"
            }, {
                column: "SaleAmount",
                summaryType: "sum",
                valueFormat: "currency"
            }]
        }
    };
    
});