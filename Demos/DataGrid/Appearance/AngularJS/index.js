var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.showColumnLines = false;
    $scope.showRowLines = true;
    $scope.showBorders = true;
    $scope.rowAlternationEnabled = true;
    
    $scope.dataGridOptions = {
        dataSource: employees,
        keyExpr: "ID",
        bindingOptions: {
            showColumnLines: "showColumnLines",
            showRowLines: "showRowLines",
            showBorders: "showBorders",
            rowAlternationEnabled: "rowAlternationEnabled"
        },
        columns: [
            {
                dataField: "Prefix",
                caption: "Title",
                width: 80
            },
            "FirstName",
            "LastName",
            {
                dataField: "City",
            }, {
                dataField: "State",
            }, {
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
    
    $scope.columnLinesOptions = {
        text: "Show Column Lines",
        bindingOptions: {
            value: "showColumnLines"
        }
    };
    
    $scope.rowLinesOptions = {
        text: "Show Row Lines",
        bindingOptions: {
            value: "showRowLines"
        }
    };
    
    $scope.showBordersOptions = {
        text: "Show Borders",
        bindingOptions: {
            value: "showBorders"
        }
    };
    
    $scope.rowAlternationOptions = {
        text: "Alternating Row Color",
        bindingOptions: {
            value: "rowAlternationEnabled"
        }
    };
    
});