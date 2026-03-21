$(() => {
  function createList(selector, tasks) {
    $(selector).dxList({
      dataSource: tasks,
      keyExpr: 'id',
      repaintChangesOnly: true,
      itemDragging: {
        allowReordering: true,
        data: tasks,
        group: 'tasks',
        onDragStart(e) {
          e.itemData = e.fromData[e.fromIndex];
        },
        onAdd(e) {
          e.toData.splice(e.toIndex, 0, e.itemData);
          e.component.reload();
        },
        onRemove(e) {
          e.fromData.splice(e.fromIndex, 1);
          e.component.reload();
        },
        onReorder({
          fromIndex, toIndex, fromData, component,
        }) {
          const item = fromData.splice(fromIndex, 1)[0];
          fromData.splice(toIndex, 0, item);
          component.reload();
        },
      },
    });
  }

  createList('#plannedList', plannedTasks);
  createList('#doingList', doingTasks);
});
