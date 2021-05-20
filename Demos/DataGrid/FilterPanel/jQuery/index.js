$(function() {
    $("#gridContainer").dxDataGrid({
        dataSource: orders,
        keyExpr: "ID",
        columnsAutoWidth: true,
        filterRow: { visible: true },
        filterPanel: { visible: true },
        headerFilter: { visible: true },
        filterValue: [["Employee", "=", "Clark Morgan"], "and", ["OrderDate", "weekends"]],
        filterBuilder: {
            customOperations: [{
                name: "weekends",
                caption: "Weekends",
                dataTypes: ["date"],
                icon: "check",
                hasValue: false,
                calculateFilterExpression: function() {
                    return [[getOrderDay, "=", 0], "or", [getOrderDay, "=", 6]];
                }
            }],
            allowHierarchicalFields: true
        },
        filterBuilderPopup: {
            position: { of: window, at: "top", my: "top", offset: { y: 10 } },
        },
        scrolling: { mode: "infinite" },
        showBorders: true,
        columns: [{
            caption: "Invoice Number",
            dataField: "OrderNumber",
            dataType: "number",
            headerFilter: {
                groupInterval: 10000
            }
        }, {
            dataField: "OrderDate",
            dataType: "date"
        }, {
            dataField: "SaleAmount",
            dataType: "number",
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
        }, {
            dataField: "Employee",
            dataType: "string"
        }, {
            caption: "City",
            dataField: "CustomerInfo.StoreCity",
            dataType: "string"
        }, {
            caption: "State",
            dataField: "CustomerInfo.StoreState",
            dataType: "string"
        }]
    });

    function getOrderDay(rowData) {
        return (new Date(rowData.OrderDate)).getDay();
    }
});
