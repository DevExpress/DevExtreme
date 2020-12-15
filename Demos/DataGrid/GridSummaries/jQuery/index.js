$(function(){
    $("#gridContainer").dxDataGrid({
        dataSource: orders,
        keyExpr: "ID",
        showBorders: true,
        selection: {
            mode: "single"
        },
        columns: [{
                dataField: "OrderNumber",
                width: 130,
                caption: "Invoice Number"
            }, {
                dataField: "OrderDate",
                dataType: "date",
                width: 160
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
                format: "currency"
            }
        ],
        summary: {
            totalItems: [{
                column: "OrderNumber",
                summaryType: "count"
            }, {
                column: "OrderDate",
                summaryType: "min",
                customizeText: function(data) {
                    return "First: " + DevExpress.localization.formatDate(data.value, "MMM dd, yyyy");
                }
            }, {
                column: "SaleAmount",
                summaryType: "sum",
                valueFormat: "currency"
            }]
        }
    });
});