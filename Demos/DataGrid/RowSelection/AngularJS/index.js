var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.selectedEmployee = {};
    $scope.gridOptions = {
        dataSource: employees,
        keyExpr: "ID",
        selection: {
            mode: "single"
        },
        hoverStateEnabled: true,
        showBorders: true,
        columns: [{
            dataField: "Prefix",
            caption: "Title",
            width: 70
        }, 
        "FirstName",
        "LastName", {
            dataField: "Position",
            width: 180
        }, {
            dataField: "BirthDate",
            dataType: "date"
        }, {
            dataField: "HireDate",
            dataType: "date"
        }],
        onSelectionChanged: function (selectedItems) {
            $scope.selectedEmployee = selectedItems.selectedRowsData[0];
        }
    };
    
});