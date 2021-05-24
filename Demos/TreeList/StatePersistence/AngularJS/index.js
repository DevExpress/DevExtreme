var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.treeListOptions = {
        dataSource: employees,
        keyExpr: "ID",
        onInitialized: function (e) {
            $scope.treeList = e.component;    
        },
        parentIdExpr: "Head_ID",
        allowColumnReordering: true,
        allowColumnResizing: true,
        showBorders: true,
        selection: {
            mode: "multiple",
            recursive: true
        },
        filterRow: {
            visible: true
        },
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "treeListStorage"
        },
        expandedRowKeys: [1, 2, 10],
        columns: [{ 
                dataField: "Full_Name"
            }, {
                dataField: "Title",
                caption: "Position"
            }, "City", {
                dataField: "Hire_Date",
                dataType: "date",
                width: 160
            }
        ]
    };

    $scope.onStateResetClick = function() {
        $scope.treeList.state(null);
    };

    $scope.onRefreshClick = function() {
        window.location.reload();
    };
});