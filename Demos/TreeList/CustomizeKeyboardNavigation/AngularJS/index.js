var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.treeListOptions = {
        dataSource: employees,
        keyExpr: "ID",
        parentIdExpr: "Head_ID",
        columnAutoWidth: true,
        expandedRowKeys: [1, 2, 4, 5],
        onFocusedCellChanging: function (e) {
            e.isHighlighted = true;
        },
        keyboardNavigation: {
            enterKeyAction: "moveFocus",
            enterKeyDirection: "column",
            editOnKeyPress: true
        },
        editing: {
            mode: "batch",
            allowUpdating: true,
            startEditAction: "dblClick"
        },
        columns: [
            "Full_Name",
            {
                dataField: "Prefix",
                caption: "Title"
            },
            {
                dataField: "Title",
                caption: "Position"
            },
            "City",
            {
                dataField: "Hire_Date",
                dataType: "date"
            }],
        onInitialized: function (e) {
            $scope.treeList = e.component;
        }
    };

    $scope.enterKeyActions = ["startEdit", "moveFocus"];
    $scope.enterKeyDirections = ["none", "column", "row"];

    $scope.editOnKeyPressOptions = {
        text: "Edit On Key Press",
        value: true,
        onValueChanged: function(data) {
            $scope.treeList.option("keyboardNavigation.editOnKeyPress", data.value);
        }
    };

    $scope.enterKeyActionOptions = {
        items: $scope.enterKeyActions,
        value: $scope.enterKeyActions[1],
        onValueChanged: function(data) {
            $scope.treeList.option("keyboardNavigation.enterKeyAction", data.value);
        }
    };

    $scope.enterKeyDirectionOptions = {
        items: $scope.enterKeyDirections,
        value: $scope.enterKeyDirections[1],
        onValueChanged: function(data) {
            $scope.treeList.option("keyboardNavigation.enterKeyDirection", data.value);
        }
    };
});