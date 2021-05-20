$(function(){
    var dataGrid = $("#gridContainer").dxDataGrid({
        dataSource: orders,
        keyExpr: "ID",
        columnsAutoWidth: true,
        showBorders: true,
        filterRow: {
            visible: true,
            applyFilter: "auto"
        },
        searchPanel: {
            visible: true,
            width: 240,
            placeholder: "Search..."
        },
        headerFilter: {
            visible: true
        },
        columns: [{
            dataField: "OrderNumber",
            caption: "Invoice Number",
            width: 140,
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
    }).dxDataGrid('instance');
    
    var applyFilterTypes = [{
        key: "auto",
        name: "Immediately"
    }, {
        key: "onClick",
        name: "On Button Click"
    }];
    
    var applyFilterModeEditor = $("#useFilterApplyButton").dxSelectBox({
        items: applyFilterTypes,
        value: applyFilterTypes[0].key,
        valueExpr: "key",
        displayExpr: "name",
        onValueChanged: function(data) {
            dataGrid.option("filterRow.applyFilter", data.value);
        }
    }).dxSelectBox("instance");
    
    $("#filterRow").dxCheckBox({
        text: "Filter Row",
        value: true,
        onValueChanged: function(data) {
            dataGrid.clearFilter();
            dataGrid.option("filterRow.visible", data.value);
            applyFilterModeEditor.option("disabled", !data.value);
        }
    });
    
    $("#headerFilter").dxCheckBox({
        text: "Header Filter",
        value: true,
        onValueChanged: function(data) {
            dataGrid.clearFilter();
            dataGrid.option("headerFilter.visible", data.value);
        }
    });
    
    function getOrderDay(rowData) {
        return (new Date(rowData.OrderDate)).getDay();
    }
});