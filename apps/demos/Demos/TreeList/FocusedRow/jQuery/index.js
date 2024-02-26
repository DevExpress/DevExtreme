$(() => {
  const url = 'https://js.devexpress.com/Demos/Mvc/api/TreeListTasks';

  const taskEmployees = DevExpress.data.AspNet.createStore({
    key: 'ID',
    loadMode: 'raw',
    loadUrl: `${url}/TaskEmployees`,
  });

  const treeList = $('#treeList').dxTreeList({
    dataSource: DevExpress.data.AspNet.createStore({
      key: 'Task_ID',
      loadUrl: `${url}/Tasks`,
      onBeforeSend(_, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    }),
    remoteOperations: {
      filtering: true,
      sorting: true,
      grouping: true,
    },
    parentIdExpr: 'Task_Parent_ID',
    hasItemsExpr: 'Has_Items',
    focusedRowEnabled: true,
    focusedRowKey: 45,
    showBorders: true,
    wordWrapEnabled: true,
    columns: [
      {
        dataField: 'Task_ID',
        width: 100,
        alignment: 'left',
      },
      {
        dataField: 'Task_Assigned_Employee_ID',
        caption: 'Assigned',
        minWidth: 120,
        lookup: {
          dataSource: taskEmployees,
          valueExpr: 'ID',
          displayExpr: 'Name',
        },
      },
      {
        dataField: 'Task_Status',
        caption: 'Status',
        width: 160,
      },
      {
        dataField: 'Task_Start_Date',
        caption: 'Start Date',
        dataType: 'date',
        width: 160,
      },
      {
        dataField: 'Task_Due_Date',
        caption: 'Due Date',
        dataType: 'date',
        width: 160,
      },
    ],
    onFocusedRowChanged(e) {
      const rowData = e.row && e.row.data;
      let cellValue;
      let assigned;

      if (rowData) {
        cellValue = e.component.cellValue(e.row.rowIndex, 'Assigned');
        taskEmployees.byKey(cellValue).done((item) => {
          assigned = item.Name;
        });

        $('.task-subject').html(rowData.Task_Subject);

        $('.task-assigned').html(assigned);
        $('.start-date').html(new Date(rowData.Task_Start_Date).toLocaleDateString());

        $('.task-status').html(rowData.Task_Status);

        const progress = rowData.Task_Completion ? `${rowData.Task_Completion}%` : '';
        $('.task-progress').text(progress);
      }

      $('#taskId').dxNumberBox('instance').option('value', treeList.option('focusedRowKey'));
    },
  }).dxTreeList('instance');

  $('#taskId').dxNumberBox({
    min: 1,
    max: 182,
    step: 0,
    inputAttr: { 'aria-label': 'Focused Row Key' },
    onValueChanged(e) {
      if (e.event && e.value > 0) {
        treeList.option('focusedRowKey', e.value);
      }
    },
  });
});
