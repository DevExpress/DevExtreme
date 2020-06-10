var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var resizingModes = ["nextColumn", "widget"];

    $scope.columnResizingMode = resizingModes[0];

    $scope.treeListOptions = {
        dataSource: employees,
        keyExpr: "ID",
        parentIdExpr: "Head_ID",
        allowColumnResizing: true,
        columnMinWidth: 50,
        columnAutoWidth: true,
        columns: [{
            dataField: "Title",
            caption: "Position"
        }, "Full_Name", "City", "State", {
            dataField: "Hire_Date",
            dataType: "date"
        }],
        showRowLines: true,
        showBorders: true,
        expandedRowKeys: [1, 3, 6],
        bindingOptions: {
            columnResizingMode: "columnResizingMode",
        }
    };

    $scope.resizingOptions = {
        items: resizingModes,
        width: 250,
        onValueChanged: function(data) {
            $scope.columnResizingMode = data.value;   
        },
        bindingOptions: {
            value: "columnResizingMode",
        }
    };
});