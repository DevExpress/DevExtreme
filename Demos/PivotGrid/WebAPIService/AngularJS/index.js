var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.pivotGridOptions = {
        allowSorting: true,
        allowSortingBySummary: true,
        allowFiltering: true,
        height: 620,
        showBorders: true,
        rowHeaderLayout: "tree",
        scrolling: {
            mode: "virtual"
        },
        dataSource: {
            remoteOperations: true,
            store: DevExpress.data.AspNet.createStore({
                key: "OrderID",
                loadUrl: "https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/Sales/Orders"
            }),
            fields: [{
                caption: "Category",
                dataField: "ProductCategoryName",
                width: 250,
                expanded: true,
                sortBySummaryField: "SalesAmount",
                sortBySummaryPath: [],
                sortOrder: "desc",
                area: "row"
            }, {
                caption: "Subcategory",
                dataField: "ProductSubcategoryName",
                width: 250,
                sortBySummaryField: "SalesAmount",
                sortBySummaryPath: [],
                sortOrder: "desc",
                area: "row"
            }, {
                caption: "Product",
                dataField: "ProductName",
                area: "row",
                sortBySummaryField: "SalesAmount",
                sortBySummaryPath: [],
                sortOrder: "desc",
                width: 250
            }, {
                caption: "Date",
                dataField: "DateKey",
                dataType: "date",
                area: "column"
            }, {
                caption: "Amount",
                dataField: "SalesAmount",
                summaryType: "sum",
                format: "currency",
                area: "data"
            }, {
                caption: "Store",
                dataField: "StoreName"
            }, {
                caption: "Quantity",
                dataField: "SalesQuantity",
                summaryType: "sum"
            }, {
                caption: "Unit Price",
                dataField: "UnitPrice",
                format: "currency",
                summaryType: "sum"
            }, {
                dataField: "Id",
                visible: false
            }]
        }
    };
});