var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.filterMode = "matchOnly";

    $scope.treeListOptions = {
        dataSource: employees,
        keyExpr: "ID",
        parentIdExpr: "Head_ID",
        columns: [
            {
                dataField: "Title",
                caption: "Position",
                dataType: "string"
            }, {
                dataField: "Full_Name",
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
            }
        ],
        searchPanel: {
            visible: true,
            text: "Manager"
        },
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        bindingOptions: {
            filterMode: "filterMode"
        }
    };

    $scope.filterModeOptions = {
        items: ["matchOnly", "withAncestors", "fullBranch"],
        bindingOptions: {
            value: "filterMode"
        }
    };
});