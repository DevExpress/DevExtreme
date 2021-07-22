$(function() {
    var treeList = $("#employees").dxTreeList({
        dataSource: employees,
        rootValue: -1,
        keyExpr: "ID",
        rowDragging: {
            allowDropInsideItem: true,
            allowReordering: true,
            onDragChange: function(e) {
                var visibleRows = treeList.getVisibleRows(),
                    sourceNode = treeList.getNodeByKey(e.itemData.ID),
                    targetNode = visibleRows[e.toIndex].node;

                while (targetNode && targetNode.data) {
                    if (targetNode.data.ID === sourceNode.data.ID) {
                        e.cancel = true;
                        break;
                    }
                    targetNode = targetNode.parent;
                }
            },
            onReorder: function(e) {
                var visibleRows = e.component.getVisibleRows();

                if (e.dropInsideItem) {
                    e.itemData.Head_ID = visibleRows[e.toIndex].key;
                } else {
                    var sourceData = e.itemData,
                        toIndex = e.fromIndex > e.toIndex ? e.toIndex - 1 : e.toIndex,
                        targetData = toIndex >= 0 ? visibleRows[toIndex].node.data : null;

                    if (targetData && e.component.isRowExpanded(targetData.ID)) {
                        sourceData.Head_ID = targetData.ID;
                        targetData = null;
                    } else {
                        sourceData.Head_ID = targetData ? targetData.Head_ID : e.component.option('rootValue');
                    }

                    var sourceIndex = employees.indexOf(sourceData);
                    employees.splice(sourceIndex, 1);

                    var targetIndex = employees.indexOf(targetData) + 1;
                    employees.splice(targetIndex, 0, sourceData);
                }

                e.component.refresh();
            }
        },
        parentIdExpr: "Head_ID",
        columns: [{
            dataField: "Title",
            caption: "Position"
        }, "Full_Name", "City", "State", "Mobile_Phone", {
            dataField: "Hire_Date",
            dataType: "date"
        }],
        expandedRowKeys: [1],
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true
    }).dxTreeList("instance");

    $("#allowDropInside").dxCheckBox({
        text: "Allow Drop Inside Item",
        value: true,
        onValueChanged: function(e) {
            treeList.option("rowDragging.allowDropInsideItem", e.value);
        }
    });

    $("#allowReordering").dxCheckBox({
        text: "Allow Reordering",
        value: true,
        onValueChanged: function(e) {
            treeList.option("rowDragging.allowReordering", e.value);
        }
    });

    $("#dragIcons").dxCheckBox({
        text: "Show Drag Icons",
        value: true,
        onValueChanged: function(e) {
            treeList.option("rowDragging.showDragIcons", e.value);
        }
    });
});
