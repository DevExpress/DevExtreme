$(() => {
  function createList(selector, tasks) {
    $(selector).dxList({
      dataSource: tasks,
      keyExpr: 'id',
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
          [fromData[fromIndex], fromData[toIndex]] = [fromData[toIndex], fromData[fromIndex]];
          component.reload();
        },
      },
    });
  }

  createList('#plannedList', plannedTasks);
  createList('#doingList', doingTasks);
});
