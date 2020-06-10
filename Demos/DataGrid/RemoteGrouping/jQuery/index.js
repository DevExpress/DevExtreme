$(function() {
    $("#gridContainer").dxDataGrid({
        dataSource: DevExpress.data.AspNet.createStore({
            key: "Id",
            loadUrl: "https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/Sales"
        }),
        remoteOperations: { groupPaging: true },
        scrolling: {
            mode: "virtual"
        },
        grouping: { 
            autoExpandAll: false
        },
        groupPanel: {
            visible: true
        },
        wordWrapEnabled: true,
        showBorders: true,
        columns: [{
            dataField: "Id",
            dataType: "number",
            width: 75
        },{
            caption: "Subcategory", 
            dataField: "ProductSubcategoryName",
            width: 150,
        },{
            caption: "Store",
            dataField: "StoreName",
            groupIndex: 0,
            width: 150
        }, {
            caption: "Category",
            dataField: "ProductCategoryName",
            groupIndex: 1,
            width: 120
        }, {
            caption: "Product",
            dataField: "ProductName"
        }, {
            caption: "Date",
            dataField: "DateKey",
            dataType: "date",
            format: "yyyy-MM-dd",
            width: 100
        }, {
            caption: "Amount",
            dataField: "SalesAmount",
            format: "currency",
            width: 100
        }],
        summary: {
            groupItems: [{
                column: "Id",
                summaryType: "count"
            }]
        }
    });
});