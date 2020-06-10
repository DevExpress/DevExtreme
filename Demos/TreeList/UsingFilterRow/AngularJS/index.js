var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.treeListOptions = {
        dataSource: employees,
        keyExpr: "ID",
        parentIdExpr: "Head_ID",
        filterRow: {
            visible: true
        },
        selection: {
            mode: "single"
        },
        columns: [
            "Full_Name", {
            dataField: "Title",
            caption: "Position"
        }, "City", "State", "Mobile_Phone", {
            dataField: "Hire_Date",
            dataType: "date"
        }],
        columnAutoWidth: true,
        showRowLines: true,
        showBorders: true,
        expandedRowKeys: [1]
    };
});