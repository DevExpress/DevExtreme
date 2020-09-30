$(function(){
    var dataGrid = $("#gridContainer").dxDataGrid({
        height: 440,
        dataSource: tasks,
        keyExpr: "ID",
        scrolling: {
            mode: "virtual"
        },
        sorting: {
            mode: "none"
        },
        rowDragging: {
            allowReordering: true,
            dropFeedbackMode: "push",
            onReorder: function(e) {
                var visibleRows = e.component.getVisibleRows(),
                    toIndex = tasks.indexOf(visibleRows[e.toIndex].data),
                    fromIndex = tasks.indexOf(e.itemData);

                tasks.splice(fromIndex, 1);
                tasks.splice(toIndex, 0, e.itemData);

                e.component.refresh();
            }
        },
        showBorders: true,
        columns: [{
            dataField: "ID",
            width: 55
        }, {
            dataField: "Owner",
            lookup: {
                dataSource: employees,
                valueExpr: "ID",
                displayExpr: "FullName"
            },
            width: 150
        }, {
            dataField: "AssignedEmployee",
            caption: "Assignee",
            lookup: {
                dataSource: employees,
                valueExpr: "ID",
                displayExpr: "FullName"
            },
            width: 150
        }, "Subject"]
    }).dxDataGrid("instance");

    $("#dragIcons").dxCheckBox({
        text: "Show Drag Icons",
        value: true,
        onValueChanged: function(data) {
            dataGrid.option("rowDragging.showDragIcons", data.value);
        }
    });
});