const url = 'https://js.devexpress.com/Demos/NetCore/api/TreeListTasks';

$(() => {
  const store = DevExpress.data.AspNet.createStore({
    key: 'Task_ID',
    loadUrl: `${url}/Tasks`,
    insertUrl: `${url}/InsertTask`,
    updateUrl: `${url}/UpdateTask`,
    deleteUrl: `${url}/DeleteTask`,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });

  $('#card-view').dxCardView({
    dataSource: store,
    remoteOperations: true,
    cardsPerRow: 'auto',
    cardMinWidth: 280,
    wordWrapEnabled: true,
    columns: [
      {
        caption: 'Subject',
        dataField: 'Task_Subject',
        validationRules: [{ type: 'required' }],
      },
      {
        dataField: 'Task_Start_Date',
        caption: 'Start Date',
        dataType: 'date',
      },
      {
        dataField: 'Task_Due_Date',
        caption: 'Due Date',
        dataType: 'date',
      },
      {
        caption: 'Priority',
        dataField: 'Task_Priority',
      },
      {
        caption: 'Status',
        dataField: 'Task_Status',
      },
    ],
    headerFilter: {
      visible: true,
    },
    editing: {
      allowAdding: true,
      allowUpdating: true,
      allowDeleting: true,
      popup: {
        width: 700,
        height: 400,
      },
      form: {
        items: ['Task_Subject', 'Task_Start_Date', 'Task_Due_Date', {
          dataField: 'Task_Priority',
          editorType: 'dxSelectBox',
          editorOptions: {
            dataSource: ['Low', 'Normal', 'High', 'Urgent'],
          },
        }, 'Task_Status'],
      },
    },
    searchPanel: {
      visible: true,
    },
  });
});
