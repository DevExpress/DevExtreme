$(() => {
  const url = 'https://js.devexpress.com/Demos/Mvc/api/RowReordering';
  const tasksStore = DevExpress.data.AspNet.createStore({
    key: 'ID',
    loadUrl: `${url}/Tasks`,
    updateUrl: `${url}/UpdateTask`,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });
  const employeesStore = DevExpress.data.AspNet.createStore({
    key: 'ID',
    loadUrl: `${url}/Employees`,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });

  $('#gridContainer').dxDataGrid({
    height: 440,
    dataSource: tasksStore,
    remoteOperations: true,
    scrolling: {
      mode: 'virtual',
    },
    sorting: {
      mode: 'none',
    },
    rowDragging: {
      allowReordering: true,
      dropFeedbackMode: 'push',
      onReorder(e) {
        const visibleRows = e.component.getVisibleRows();
        const newOrderIndex = visibleRows[e.toIndex].data.OrderIndex;
        const d = $.Deferred();

        tasksStore.update(e.itemData.ID, { OrderIndex: newOrderIndex }).then(() => {
          e.component.refresh().then(d.resolve, d.reject);
        }, d.reject);

        e.promise = d.promise();
      },
    },
    showBorders: true,
    columns: [{
      dataField: 'ID',
      width: 55,
    }, {
      dataField: 'Owner',
      lookup: {
        dataSource: employeesStore,
        valueExpr: 'ID',
        displayExpr: 'FullName',
      },
      width: 150,
    }, {
      dataField: 'AssignedEmployee',
      caption: 'Assignee',
      lookup: {
        dataSource: employeesStore,
        valueExpr: 'ID',
        displayExpr: 'FullName',
      },
      width: 150,
    }, 'Subject'],
  });
});
