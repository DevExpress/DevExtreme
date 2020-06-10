var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.dataGridOptions = {
        dataSource: {
            store: productsStore,
            reshapeOnPush: true
        },
        repaintChangesOnly: true,
        twoWayBindingEnabled: false,
        columnAutoWidth: true,
        showBorders: true,
        paging: {
            pageSize: 10
        },
        columns: [
            { dataField: "ProductName", dataType: "string" },
            { dataField: "UnitPrice", dataType: "number", format: "currency" },
            { dataField: "OrderCount", dataType: "number" },
            { dataField: "Quantity", dataType: "number" },
            { dataField: "Amount", dataType: "number", format: "currency", allowSorting: true }
        ],
        summary: {
            totalItems: [{
                summaryType: "count",
                column: "ProductName"
            }, {
                summaryType: "sum",
                displayFormat: "{0}",
                valueFormat: "currency",
                column: "Amount"
            }, {
                summaryType: "sum",
                displayFormat: "{0}",
                column: "OrderCount"
            }]
        },
        masterDetail: {
            enabled: true,
            template: function(container, options) {
                $("<div>").appendTo(container).dxDataGrid({
                    dataSource: {
                        store: ordersStore,
                        filter: ["ProductID", "=", options.key],
                        reshapeOnPush: true
                    },
                    repaintChangesOnly: true,
                    twoWayBindingEnabled: false,
                    columnAutoWidth: true,
                    showBorders: true,
                    paging: {
                        pageSize: 5
                    },
                    columns: [{
                        dataField: "OrderID",
                        dataType: "number"
                    }, {
                        dataField: "ShipCity",
                        dataType: "string"
                    }, {
                        dataField: "OrderDate",
                        dataType: "datetime",
                        format: "yyyy/MM/dd HH:mm:ss"
                    }, {
                        dataField: "UnitPrice",
                        dataType: "number"
                    }, {
                        dataField: "Quantity",
                        dataType: "number"
                    }, {
                        caption: "Amount",
                        dataType: "number",
                        format: "currency",
                        allowSorting: true,
                        calculateCellValue: function(rowData) {
                            return rowData.UnitPrice * rowData.Quantity;
                        }
                    }],
                    summary: {
                        totalItems: [{
                            summaryType: "count",
                            column: "OrderID"
                        }, {
                            summaryType: "sum",
                            displayFormat: "{0}",
                            column: "Quantity"
                        }, {
                            summaryType: "sum",
                            displayFormat: "{0}",
                            valueFormat: "currency",
                            column: "Amount"
                        }]
                    }
                });
            }
        }
    };

    $scope.updatesPerSecond = 100;

    $scope.speedSliderOptions = {
        min: 10,
        step: 10,
        max: 5000,
        value: $scope.updatesPerSecond,
        onValueChanged: function(e) {
            $scope.updatesPerSecond = e.value;
        },
        tooltip: {
            enabled: true,
            format: "#0 per second",
            showMode: "always",
            position: "top"
        }
    };

    setInterval(function() {
        if(orders.length > 500000) {
            return;
        }

        for(var i = 0; i < $scope.updatesPerSecond / 20; i++) {
            addOrder();
        }
    }, 50);    
});