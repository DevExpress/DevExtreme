var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var columnChooserModes = [{
        key: "dragAndDrop",
        name: "Drag and drop"
    }, {
        key: "select",
        name: "Select"
    }];

    $scope.columnChooser = {
        enabled: true,
        mode: "dragAndDrop",
        allowSearch: true
    };
    
    $scope.allowSearch = true;

    $scope.treeListOptions = {
        dataSource: employees,
        bindingOptions: {
            columnChooser: "columnChooser"
        },
        keyExpr: "ID",
        parentIdExpr: "Head_ID",
        columns: [{
                dataField: "Title",
                caption: "Position"
            }, {
                dataField: "Full_Name",
                allowHiding: false
            }, "City", "State", "Mobile_Phone", {
                dataField: "Email",
                visible: false
            }, {
                dataField: "Hire_Date",
                dataType: "date"
            }, {
                dataField: "Skype",
                visible: false
            }],
        columnAutoWidth: true,
        showRowLines: true,
        showBorders: true,
        expandedRowKeys: [1]
    };

    $scope.columnChooserOptions = {
        items: columnChooserModes,
        valueExpr: "key",
        displayExpr: "name",
        bindingOptions: {
            value: "columnChooser.mode" 
        }
    };
    
    $scope.allowSearchOptions = {
        text: "Allow search",
        bindingOptions: {
            value: "columnChooser.allowSearch"
        },
    };
});