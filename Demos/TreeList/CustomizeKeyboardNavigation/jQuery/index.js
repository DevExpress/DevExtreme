$(function(){   
    var treeList = $("#employees").dxTreeList({
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
            }]
    }).dxTreeList("instance");

    var enterKeyActions = ["startEdit", "moveFocus"],
        enterKeyDirections = ["none", "column", "row"];

    $("#editOnKeyPress").dxCheckBox({
        text: "Edit On Key Press",
        value: true,
        onValueChanged: function (data) {
            treeList.option("keyboardNavigation.editOnKeyPress", data.value);
        }
    });

    $("#enterKeyAction").dxSelectBox({
        items: enterKeyActions,
        value: enterKeyActions[1],
        onValueChanged: function (data) {
            treeList.option("keyboardNavigation.enterKeyAction", data.value);
        }
    });

    $("#enterKeyDirection").dxSelectBox({
        items: enterKeyDirections,
        value: enterKeyDirections[1],
        onValueChanged: function (data) {
            treeList.option("keyboardNavigation.enterKeyDirection", data.value);
        }
    });
});