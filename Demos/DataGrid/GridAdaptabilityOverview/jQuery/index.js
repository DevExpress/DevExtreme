$(function(){
    $("#gridContainer").dxDataGrid({
        dataSource: orders, 
        keyExpr: "ID",
        columnHidingEnabled: true,
        showBorders: true,
        editing: {
            allowAdding: true,
            allowUpdating: true,
            mode: "batch"
        },
        grouping: {
            contextMenuEnabled: true,
            expandMode: "rowClick"
        },   
        groupPanel: {
            emptyPanelText: "Use the context menu of header columns to group data",
            visible: true
        },
        pager: {
            allowedPageSizes: [5, 8, 15, 30],
            showInfo: true,
            showNavigationButtons: true,
            showPageSizeSelector: true,
            visible: true
        },
        paging: {
            pageSize: 8
        },
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        columns: [{
            allowGrouping: false,
            dataField: "OrderNumber",
            caption: "Invoice Number",
            width: 130
        },  {
            caption: "City",
            dataField: "CustomerStoreCity"
        }, {
            caption: "State",
            dataField: "CustomerStoreState"
        }, 
        "Employee",{
            dataField: "OrderDate",
            dataType: "date"
        }, {
            dataField: "SaleAmount",
            format: "currency"
        }]
    });
});