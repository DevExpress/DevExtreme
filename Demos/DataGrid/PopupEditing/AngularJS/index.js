var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.dataGridOptions = {
        dataSource: employees,
        keyExpr: "ID",
        showBorders: true,
        editing: {
            mode: "popup",
            allowUpdating: true,
            popup: {
                title: "Employee Info",
                showTitle: true,
                width: 700,
                height: 525
            },
            form: {
                items: [{
                    itemType: "group",
                    colCount: 2,
                    colSpan: 2,
                    items: ["FirstName", "LastName", "Prefix", "BirthDate", "Position", "HireDate", {
                        dataField: "Notes",
                        editorType: "dxTextArea",
                        colSpan: 2,
                        editorOptions: {
                            height: 100
                        }
                    }]
                }, {
                    itemType: "group",
                    colCount: 2,
                    colSpan: 2,
                    caption: "Home Address",
                    items: ["StateID", "Address"]
                }]
            }
        },
        columns: [
            {
                dataField: "Prefix",
                caption: "Title",
                width: 70
            },
            "FirstName",
            "LastName", 
            {
                dataField: "BirthDate",
                dataType: "date"
            },
            {
                dataField: "Position",
                width: 170
            }, 
            {
                dataField: "HireDate",
                dataType: "date"
            },
            {
                dataField: "StateID",
                caption: "State",
                width: 125,
                lookup: {
                    dataSource: states,
                    displayExpr: "Name",
                    valueExpr: "ID"
                }
            }, 
            { 
                dataField: "Address", 
                visible: false
            },
            {
                dataField: "Notes",
                visible: false
            }
        ]
    };
    
});