$(() => {
  $('#card-view').dxCardView({
    dataSource: tasks,
    keyExpr: 'Task_ID',
    wordWrapEnabled: true,
    columns: [
      {
        caption: 'Subject',
        dataField: 'Task_Subject',
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
    searchPanel: {
      visible: true,
      text: 'an'
    },
  });
});
