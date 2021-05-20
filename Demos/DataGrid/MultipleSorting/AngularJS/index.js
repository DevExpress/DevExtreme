var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.gridOptions = {
        dataSource: employees,
        keyExpr: "ID",
        showBorders: true,
        sorting: {
            mode: "multiple"
        },
        columns: [ 
            { 
                dataField: "Prefix",
                caption: "Title",
                width: 70
            }, {
                dataField: "FirstName",
                sortOrder: "asc"
            }, {
                dataField: "LastName",
                sortOrder: "asc"
            }, "City",
            "State", {
                dataField: "Position",
                width: 130
            }, {
                dataField: "HireDate",
                dataType: "date"
            }
        ]
    };
    
    $scope.positionSortingOptions = {
        value: false,
        text: "Disable Sorting for the Position Column",
        onValueChanged: function(data) {
            var dataGrid = $("#gridContainer").dxDataGrid("instance");
            dataGrid.columnOption(5, "sortOrder", undefined);
            dataGrid.columnOption(5, "allowSorting", !data.value);
        }
    }; 
});