var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.dataGridOptions = {
        dataSource: employees,
        keyExpr: "ID",
        showBorders: true,
        paging: {
            enabled: false
        },
        editing: {
            mode: "form",
            allowUpdating: true,
            allowAdding: true,
            allowDeleting: true
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
            }, {
                dataField: "Notes",
                visible: false,
                formItem: {
                    colSpan: 2,
                    editorType: "dxTextArea",
                    editorOptions: {
                        height: 100
                    }
                }
            }
        ]
    };
    
});