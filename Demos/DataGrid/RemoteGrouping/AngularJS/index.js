var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "Id",
            loadUrl: "https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/Sales"
        }),
        remoteOperations: { groupPaging: true },
        scrolling: {
            mode: "virtual"
        },
        wordWrapEnabled: true,
        showBorders: true,
        grouping: {
            autoExpandAll: false
        },
        groupPanel: {
            visible: true
        },
        columns: [{
            dataField: "Id",
            dataType: "number",
            width: 75
        }, {
            caption: "Subcategory",
            dataField: "ProductSubcategoryName",
            width: 150
        }, {
            caption: "Store",
            dataField: "StoreName",
            width: 150,
            groupIndex: 0
        }, {
            caption: "Category",
            dataField: "ProductCategoryName",
            width: 120,
            groupIndex: 1
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
    };
});