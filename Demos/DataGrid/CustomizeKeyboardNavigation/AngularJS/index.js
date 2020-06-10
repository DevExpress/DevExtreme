var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.dataGridOptions = {
        dataSource: employees,
        keyExpr: "ID",
        showBorders: true,
        keyboardNavigation: {
            enterKeyAction: "moveFocus",
            enterKeyDirection: "column",
            editOnKeyPress: true
        },
        paging: {
            enabled: false
        },
        editing: {
            mode: "batch",
            allowUpdating: true,
            startEditAction: "dblClick"
        },
        onFocusedCellChanging: function (e) {
            e.isHighlighted = true;
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
        ],
        onInitialized: function(e) {
            $scope.dataGrid = e.component;
        }
    };

    $scope.enterKeyActions = ["startEdit", "moveFocus"];
    $scope.enterKeyDirections = ["none", "column", "row"];

    $scope.editOnKeyPressOptions = {
        text: "Edit On Key Press",
        value: true,
        onValueChanged: function(data) {
            $scope.dataGrid.option("keyboardNavigation.editOnKeyPress", data.value);
        }
    };

    $scope.enterKeyActionOptions = {
        items: $scope.enterKeyActions,
        value: $scope.enterKeyActions[1],
        onValueChanged: function(data) {
            $scope.dataGrid.option("keyboardNavigation.enterKeyAction", data.value);
        }
    };

    $scope.enterKeyDirectionOptions = {
        items: $scope.enterKeyDirections,
        value: $scope.enterKeyDirections[1],
        onValueChanged: function(data) {
            $scope.dataGrid.option("keyboardNavigation.enterKeyDirection", data.value);
        }
    };
});