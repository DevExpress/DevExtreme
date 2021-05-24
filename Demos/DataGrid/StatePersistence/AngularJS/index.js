var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.gridOptions = {
        dataSource: orders,
        keyExpr: "ID",
        onInitialized: function (e) {
            $scope.dataGrid = e.component;    
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        showBorders: true,
        selection: {
            mode: "single"
        },
        filterRow: {
            visible: true
        },
        groupPanel: {
            visible: true
        },
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "storage"
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [5, 10, 20]
        },
        columns: [{
            dataField: "OrderNumber",
            width: 130,
            caption: "Invoice Number"
        }, {
            dataField: "OrderDate",
            dataType: "date",
            sortOrder: "desc"
        }, {
            dataField: "SaleAmount",
            alignment: "right",
            format: "currency"
        }, 
        "Employee", {
            caption: "City",
            dataField: "CustomerStoreCity"
        }, {
            caption: "State",
            dataField: "CustomerStoreState",
            groupIndex: 0
        }]
    };

    $scope.onStateResetClick = function() {
        $scope.dataGrid.state(null);
    };

    $scope.onRefreshClick = function() {
        window.location.reload();
    };
    
});