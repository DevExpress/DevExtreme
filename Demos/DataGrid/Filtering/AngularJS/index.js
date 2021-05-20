var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var applyFilterTypes = [{
            key: "auto",
            name: "Immediately"
        }, {
            key: "onClick",
            name: "On Button Click"
        }],
        dataGrid;
    
    function getOrderDay(rowData) {
        return (new Date(rowData.OrderDate)).getDay();
    }
    
    $scope.filterRow = {
        visible: true,
        applyFilter: "auto"
    };
    
    $scope.headerFilter = {
        visible: true
    };
    
    $scope.gridOptions = {
        onInitialized: function(e) {
            dataGrid = e.component;
        },
        dataSource: orders,
        keyExpr: "ID",
        showBorders: true,
        bindingOptions: {
            filterRow: "filterRow",
            headerFilter: "headerFilter"
        },
        searchPanel: {
            visible: true,
            width: 240,
            placeholder: "Search..."
        },    
        columns: [{
            dataField: "OrderNumber",
            width: 140,
            caption: "Invoice Number",
            headerFilter: {
                groupInterval: 10000
            }
        }, {
            dataField: "OrderDate",
            alignment: "right",
            dataType: "date",
            width: 120,
            calculateFilterExpression: function(value, selectedFilterOperations, target) {
                if(target === "headerFilter" && value === "weekends") {
                    return [[getOrderDay, "=", 0], "or", [getOrderDay, "=", 6]];
                }
                return this.defaultCalculateFilterExpression.apply(this, arguments);
            },
            headerFilter: {
                dataSource: function(data) {
                    data.dataSource.postProcess = function(results) {
                        results.push({
                            text: "Weekends",
                            value: "weekends"
                        });                        
                        return results;
                    };
                }
            }
        }, {
            dataField: "DeliveryDate",
            alignment: "right",
            dataType: "datetime",
            width: 180,
            format: "M/d/yyyy, HH:mm"
        }, {
            dataField: "SaleAmount",
            alignment: "right",
            format: "currency",
            editorOptions: {
                format: "currency",
                showClearButton: true
            },
            headerFilter: {
                dataSource: [ {
                    text: "Less than $3000",
                    value: ["SaleAmount", "<", 3000]
                }, {
                    
                    text: "$3000 - $5000",
                    value: [["SaleAmount", ">=", 3000], ["SaleAmount", "<", 5000]]
                }, {
                    
                    text: "$5000 - $10000",
                    value: [["SaleAmount", ">=", 5000], ["SaleAmount", "<", 10000]]
                }, {
                    
                    text: "$10000 - $20000",
                    value: [["SaleAmount", ">=", 10000], ["SaleAmount", "<", 20000]]
                }, {
                    
                    text: "Greater than $20000",
                    value: ["SaleAmount", ">=", 20000]
                }]
            }
        }, "Employee", {
            caption: "City",
            dataField: "CustomerStoreCity",
            headerFilter: {
                allowSearch: true
            }
        }]
    };
    
    $scope.filterTypesOptions = {
        items: applyFilterTypes,
        value: applyFilterTypes[0].key,
        valueExpr: "key",
        displayExpr: "name",
        bindingOptions: {
            value: "filterRow.applyFilter",
            disabled: "!filterRow.visible"
        }
    };
    
    $scope.filterVisibleOptions = {
        text: "Filter Row",
        bindingOptions: {
            value: "filterRow.visible"
        },
        onValueChanged: function(data) {
            dataGrid.clearFilter();
        }
    };
    
    $scope.headerFilterOptions = {
        text: "Header Filter",
        bindingOptions: {
            value: "headerFilter.visible"
        },
        onValueChanged: function() {
            dataGrid.clearFilter();
        }
    };
    
    
});