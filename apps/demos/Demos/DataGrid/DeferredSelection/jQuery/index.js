$(() => {
  const url = 'https://js.devexpress.com/Demos/NetCore/api/TreeListTasks';
  const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
  let dataGrid;

  $('#grid-container').dxDataGrid({
    dataSource: DevExpress.data.AspNet.createStore({
      key: 'Task_ID',
      loadUrl: `${url}/Tasks`,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    }),
    remoteOperations: true,
    pager: {
      visible: true,
    },
    selection: {
      mode: 'multiple',
      deferred: true,
    },
    filterRow: {
      visible: true,
    },
    onInitialized(e) {
      dataGrid = e.component;

      calculateStatistics();
    },
    selectionFilter: ['Task_Status', '=', 'Completed'],
    showBorders: true,
    columns: [{
      caption: 'Subject',
      dataField: 'Task_Subject',
    }, {
      caption: 'Start Date',
      dataField: 'Task_Start_Date',
      width: 'auto',
      dataType: 'date',
    }, {
      caption: 'Due Date',
      dataField: 'Task_Due_Date',
      width: 'auto',
      dataType: 'date',
    }, {
      caption: 'Assigned To',
      dataField: 'Task_Assigned_Employee_ID',
      width: 'auto',
      allowSorting: false,
      lookup: {
        dataSource: DevExpress.data.AspNet.createStore({
          key: 'ID',
          loadUrl: `${url}/TaskEmployees`,
          onBeforeSend(method, ajaxOptions) {
            ajaxOptions.xhrFields = { withCredentials: true };
          },
        }),
        valueExpr: 'ID',
        displayExpr: 'Name',
      },
    }, {
      caption: 'Status',
      width: 'auto',
      dataField: 'Task_Status',
    }],
  }).dxDataGrid('instance');

  async function calculateStatistics() {
    const selectedItems = await dataGrid.getSelectedRowsData();

    const totalDuration = selectedItems.reduce((currentValue, item) => {
      const dueDateTime = new Date(item.Task_Due_Date).getTime();
      const startDateTime = new Date(item.Task_Start_Date).getTime();
      const duration = dueDateTime - startDateTime;

      return currentValue + duration;
    }, 0);
    const averageDurationInDays = totalDuration / MILLISECONDS_IN_DAY / selectedItems.length;

    $('#tasks-count').text(selectedItems.length);
    $('#people-count').text(
      DevExpress.data.query(selectedItems)
        .groupBy('Task_Assigned_Employee_ID')
        .toArray().length,
    );
    $('#avg-duration').text(Math.round(averageDurationInDays) || 0);
  }

  $('#calculateButton').dxButton({
    text: 'Get statistics on the selected tasks',
    type: 'default',
    onClick: calculateStatistics,
  });
});
