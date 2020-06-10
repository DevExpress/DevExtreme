var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.treeListOptions = {
        dataSource: employees,        
        keyExpr: "ID",
        parentIdExpr: "Head_ID",
        expandedRowKeys: [1],
        filterRow: { visible: true },
        filterPanel: { visible: true },
        headerFilter: { visible: true },
        filterValue: ["City", "=", "Bentonville"],
        showBorders: true,
        columns:  [{
            dataField: "Full_Name",
            dataType: "string"
        }, {
            dataField: "Title",
            caption: "Position",
            dataType: "string"
        }, {
            dataField: "City",
            dataType: "string"
        }, {
            dataField: "State",
            dataType: "string"
        }, {
            dataField: "Mobile_Phone",
            dataType: "string"
        }, {
            dataField: "Hire_Date",
            dataType: "date"
        }]
    };
});