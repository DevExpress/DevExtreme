var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.selectedItemsText = "Nobody has been selected";
    $scope.recursiveSelectionEnabled = false;
    $scope.selectionMode = "all";
    $scope.selectedRowKeys = [];

    function getEmployeeNames(employees) {
        if (employees.length > 0) {
            return employees.map(employee => employee.Full_Name).join(", ");
        } else {
            return "Nobody has been selected";
        }
    }

    $scope.$watch("recursiveSelectionEnabled", function(value) {
        $scope.selectedRowKeys = [];
    });

    $scope.$watch("selectionMode", function(value) {
        $scope.selectedRowKeys = [];
    });

    $scope.treeListOptions = {
        dataSource: employees,
        keyExpr: "ID",
        parentIdExpr: "Head_ID",
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        selection: {
            mode: "multiple"
        },
        bindingOptions: {
            "selectedRowKeys": "selectedRowKeys",
            "selection.recursive": "recursiveSelectionEnabled"
        },
        columns: [{ 
                dataField: "Full_Name"
            }, {
                dataField: "Title",
                caption: "Position"
            }, "City", "State",
            {
                dataField: "Hire_Date",
                dataType: "date",
                width: 120
            }
        ],
        expandedRowKeys: [1, 2, 10],
        onSelectionChanged: function(e) {
            var selectedData = e.component.getSelectedRowsData($scope.selectionMode);
            $scope.selectedItemsText = getEmployeeNames(selectedData);
        }
    };

    $scope.recursiveOptions = {
        text: "Recursive Selection",
        bindingOptions: {
            value: "recursiveSelectionEnabled"
        }
    };

    $scope.selectionModeOptions = {
        items: ["all", "excludeRecursive", "leavesOnly"],
        bindingOptions: {
            value: "selectionMode"
        }
    }
});