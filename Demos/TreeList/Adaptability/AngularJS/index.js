var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.treeListOptions = {
        dataSource: employees,
        keyExpr: "ID",
        parentIdExpr: "Head_ID",
        showBorders: true,
        columns: [{
            dataField: "Title",
            caption: "Position"
        }, "Full_Name", "City", {
            dataField: "State",
            hidingPriority: 0
        }, { 
            dataField: "Mobile_Phone", 
            hidingPriority: 1
        }, { 
            dataField: "Hire_Date",
            dataType: "date", 
            hidingPriority: 2
        }],
        columnHidingEnabled: true,
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        showRowLines: true,
        expandedRowKeys: [1]
    };
});