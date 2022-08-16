$(() => {
  const dataGrid = $('#gridContainer').dxDataGrid({
    height: 440,
    dataSource: tasks,
    keyExpr: 'ID',
    scrolling: {
      mode: 'virtual',
    },
    sorting: {
      mode: 'none',
    },
    rowDragging: {
      allowReordering: true,
      onReorder(e) {
        const visibleRows = e.component.getVisibleRows();
        const toIndex = tasks.findIndex((item) => item.ID === visibleRows[e.toIndex].data.ID);
        const fromIndex = tasks.findIndex((item) => item.ID === e.itemData.ID);

        tasks.splice(fromIndex, 1);
        tasks.splice(toIndex, 0, e.itemData);

        e.component.refresh();
      },
    },
    showBorders: true,
    columns: [{
      dataField: 'ID',
      width: 55,
    }, {
      dataField: 'Owner',
      lookup: {
        dataSource: employees,
        valueExpr: 'ID',
        displayExpr: 'FullName',
      },
      width: 150,
    }, {
      dataField: 'AssignedEmployee',
      caption: 'Assignee',
      lookup: {
        dataSource: employees,
        valueExpr: 'ID',
        displayExpr: 'FullName',
      },
      width: 150,
    }, 'Subject'],
  }).dxDataGrid('instance');

  $('#dragIcons').dxCheckBox({
    text: 'Show Drag Icons',
    value: true,
    onValueChanged(data) {
      dataGrid.option('rowDragging.showDragIcons', data.value);
    },
  });
});
