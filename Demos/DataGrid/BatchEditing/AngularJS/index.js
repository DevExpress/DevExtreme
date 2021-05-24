var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.startEditAction = "click";
    $scope.selectTextOnEditStart = true;

    $scope.dataGridOptions = {
        dataSource: employees,
        keyExpr: "ID",
        showBorders: true,
        paging: {
            enabled: false
        },
        editing: {
            mode: "batch",
            allowUpdating: true,
            allowAdding: true,
            allowDeleting: true
        },
        bindingOptions: {
            "editing.startEditAction": "startEditAction",
            "editing.selectTextOnEditStart": "selectTextOnEditStart"
        },
        columns: [
            {
                dataField: "Prefix",
                caption: "Title",
                width: 70
            },
            "FirstName",
            "LastName", {
                dataField: "Position",
                width: 170
            }, {
                dataField: "StateID",
                caption: "State",
                width: 125,
                lookup: {
                    dataSource: states,
                    displayExpr: "Name",
                    valueExpr: "ID"
                }
            }, {
                dataField: "BirthDate",
                dataType: "date"
            }
        ]
    };

    $scope.selectTextOnEditStartOptions = {
        text: "Select Text on Edit Start",
        bindingOptions: {
            value: "selectTextOnEditStart"
        }
    };

    $scope.startEditActionOptions = {
        items: ["click", "dblClick"],
        bindingOptions: {
            value: "startEditAction"
        }
    };    
});