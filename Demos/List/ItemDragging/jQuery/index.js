$(function() {

    function createList(selector, tasks) {
        var list = $(selector).dxList({
            items: tasks,
            repaintChangesOnly: true,
            keyExpr: "id",
            itemDragging: {
                allowReordering: true,
                group: "tasks",
                onDragStart: function(e) {
                    e.itemData = tasks[e.fromIndex];
                },
                onAdd: function(e) {
                    tasks.splice(e.toIndex, 0, e.itemData);
                    list.option("items", tasks);
                },
                onRemove: function(e) {
                    tasks.splice(e.fromIndex, 1);
                    list.option("items", tasks);
                }
            }
        }).dxList("instance");
    }

    createList("#plannedList", plannedTasks);
    createList("#doingList", doingTasks);
});