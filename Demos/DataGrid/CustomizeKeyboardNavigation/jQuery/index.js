$(function() {
    var dataGrid = $("#gridContainer").dxDataGrid({
        dataSource: employees,
        keyExpr: "ID",
        keyboardNavigation: {
            enterKeyAction: "moveFocus",
            enterKeyDirection: "column",
            editOnKeyPress: true
        },
        showBorders: true,
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
        ]
    }).dxDataGrid("instance");

    var enterKeyActions = ["startEdit", "moveFocus"],
        enterKeyDirections = ["none", "column", "row"];

    $("#editOnKeyPress").dxCheckBox({
        text: "Edit On Key Press",
        value: true,
        onValueChanged: function(data) {
            dataGrid.option("keyboardNavigation.editOnKeyPress", data.value);
        }
    });

    $("#enterKeyAction").dxSelectBox({
        items: enterKeyActions,
        value: enterKeyActions[1],
        onValueChanged: function(data) {
            dataGrid.option("keyboardNavigation.enterKeyAction", data.value);
        }
    });

    $("#enterKeyDirection").dxSelectBox({
        items: enterKeyDirections,
        value: enterKeyDirections[1],
        onValueChanged: function(data) {
            dataGrid.option("keyboardNavigation.enterKeyDirection", data.value);
        }
    });
});