$(function() {
    var selectedRowIndex = -1;

    $("#action-add").dxSpeedDialAction({
        label: "Add row",
        icon: "add",
        index: 1,
        onClick: function() {
            grid.addRow();
            grid.deselectAll();
        }
    }).dxSpeedDialAction("instance");

    var deleteSDA = $("#action-remove").dxSpeedDialAction({
        icon: "trash",
        label: "Delete row",
        index: 2,
        visible: false,
        onClick: function() {
            grid.deleteRow(selectedRowIndex);
            grid.deselectAll();
        }
    }).dxSpeedDialAction("instance");

    var editSDA = $("#action-edit").dxSpeedDialAction({
        label: "Edit row",
        icon: "edit",
        index: 3,
        visible: false,
        onClick: function() {
            grid.editRow(selectedRowIndex);
            grid.deselectAll();
        }
    }).dxSpeedDialAction("instance");

    var grid = $("#grid").dxDataGrid({
        dataSource: employees,
        showBorders: true,
        keyExpr: "ID",
        selection: {
            mode: "single"
        },
        paging: {
            enabled: false
        },
        editing: {
            mode: "popup",
            texts: {
                confirmDeleteMessage: ""
            }
        },
        onSelectionChanged: function(e) {
            selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);

            deleteSDA.option("visible", selectedRowIndex !== -1);
            editSDA.option("visible", selectedRowIndex !== -1);
        },
        columns: [
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
    }).dxDataGrid("instance");

    $("#direction").dxSelectBox({
        dataSource: ["auto", "up", "down"],
        value: "auto",
        onSelectionChanged: function(e) {
            DevExpress.config({
                floatingActionButtonConfig: directions[e.selectedItem]
            });

            DevExpress.ui.repaintFloatingActionButton();
        }
    });
});