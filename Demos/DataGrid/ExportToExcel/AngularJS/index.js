var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.gridOptions = {
        dataSource: employees,
        keyExpr: "ID",
        showBorders: true,
        selection: {
            mode: "multiple"
        },
        export: {
            enabled: true,
            fileName: "Employees",
            allowExportSelectedData: true
        },
        groupPanel: {
            visible: true
        },
        columns: [
            {
                dataField: "Prefix",
                caption: "Title",
                width: 60
            }, "FirstName",
            "LastName", 
            "City",
            "State", {
                dataField: "Position",
                width: 130
            }, {
                dataField: "BirthDate",
                dataType: "date",
                width: 100
            }, {
                dataField: "HireDate",
                dataType: "date",
                width: 100
            }
        ]
    };
    
});