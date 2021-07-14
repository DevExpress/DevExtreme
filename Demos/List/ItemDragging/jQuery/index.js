$(function() {
    function createList(selector, tasks) {
        $(selector).dxList({
            dataSource: tasks,
            repaintChangesOnly: true,
            keyExpr: "id",
            itemDragging: {
                allowReordering: true,
                data: tasks,
                group: "tasks",
                onDragStart: function(e) {
                    e.itemData = e.fromData[e.fromIndex];
                },
                onAdd: function(e) {
                    e.toData.splice(e.toIndex, 0, e.itemData);
                    e.component.reload();
                },
                onRemove: function(e) {
                    e.fromData.splice(e.fromIndex, 1);
                    e.component.reload();
                }
            }
        });
    }

    createList("#plannedList", plannedTasks);
    createList("#doingList", doingTasks);
});