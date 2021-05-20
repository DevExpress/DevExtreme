var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.grouping = {
        autoExpandAll: true
    };
    
    $scope.dataGridOptions = {
        dataSource: customers,
        keyExpr: "ID",
        allowColumnReordering: true,
        showBorders: true,   
        bindingOptions: {
            grouping: "grouping"
        },
        searchPanel: {
            visible: true
        },
        paging: {
            pageSize: 10
        },  
        groupPanel: {
            visible: true
        },
        columns: [
            "CompanyName",
            "Phone",
            "Fax",
            "City",
            {
                dataField: "State",
                groupIndex: 0
            }
        ]
    };
    $scope.checkBoxOptions = {
        text: "Expand All Groups",
        bindingOptions: {
            value: "grouping.autoExpandAll"
        }
    };
    
});