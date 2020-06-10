var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    var isChief = function(position) {
        return position && ["CEO", "CMO"].indexOf(position.trim().toUpperCase()) >= 0;
    };

    $scope.dataGridOptions = {
        dataSource: employees,
        showBorders: true,
        keyExpr: "ID",
        paging: {
            enabled: false
        },
        editing: {
            mode: "row",
            allowUpdating: true,
            allowDeleting: function(e) {
                return !isChief(e.row.data.Position);
            },
            useIcons: true
        },
        onRowValidating: function(e) {
            var position = e.newData.Position;

            if(isChief(position)) {
                e.errorText = "The company can have only one " + position.toUpperCase() + ". Please choose another position.";
                e.isValid = false;
            }
        },
        onEditorPreparing: function(e) {
            if(e.parentType === "dataRow" && e.dataField === "Position") {
                e.editorOptions.readOnly = isChief(e.value);
            }
        },
        columns: [
            {
                type: "buttons",
                width: 110,
                buttons: ["edit", "delete", {
                    hint: "Clone",
                    icon: "repeat",
                    visible: function(e) {
                        return !e.row.isEditing && !isChief(e.row.data.Position);
                    },
                    onClick: function(e) {
                        var clonedItem = angular.copy(e.row.data);

                        clonedItem.ID = ++maxID;
                        employees.splice(e.row.rowIndex, 0, clonedItem);
                        e.component.refresh(true);
                        e.event.preventDefault();
                    }
                }]
            },
            {
                dataField: "Prefix",
                caption: "Title"
            },
            "FirstName",
            "LastName",
            {
                dataField: "Position",
                width: 130
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
                dataType: "date",
                width: 125
            }
        ]
    };  
});