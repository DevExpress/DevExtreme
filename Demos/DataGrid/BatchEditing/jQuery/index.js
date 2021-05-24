$(function(){
    var dataGrid = $("#gridContainer").dxDataGrid({
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
            allowDeleting: true,
            selectTextOnEditStart: true,
            startEditAction: "click"
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

    $("#selectTextOnEditStart").dxCheckBox({
        value: true,
        text: "Select Text on Edit Start",
        onValueChanged: function (data) {
            dataGrid.option("editing.selectTextOnEditStart", data.value);
        }
    });

    $("#startEditAction").dxSelectBox({
        value: "click",
        items: ["click", "dblClick"],
        onValueChanged: function (data) {
            dataGrid.option("editing.startEditAction", data.value);
        }
    });
});