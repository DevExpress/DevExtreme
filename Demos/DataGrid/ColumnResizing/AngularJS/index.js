var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var resizingModes = ["nextColumn", "widget"];

    $scope.columnResizingMode = resizingModes[0];

    $scope.dataGridOptions = {
        dataSource: customers,
        keyExpr: "ID",
        allowColumnResizing: true,
        showBorders: true,
        columnMinWidth: 50,
        columnAutoWidth: true,
        columns: ["CompanyName", "City", "State", "Phone", "Fax"],
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