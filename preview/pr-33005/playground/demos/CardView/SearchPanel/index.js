$(() => {
  $('#card-view').dxCardView({
    dataSource: tasks,
    keyExpr: 'Task_ID',
    cardsPerRow: 'auto',
    cardMinWidth: 310,
    wordWrapEnabled: true,
    columns: [
      {
        dataField: 'Task_Subject',
        caption: 'Subject',
      },
      {
        dataField: 'Task_Start_Date',
        dataType: 'date',
        caption: 'Start Date',
      },
      {
        dataField: 'Task_Due_Date',
        dataType: 'date',
        caption: 'Due Date',
      },
      {
        dataField: 'Task_Priority',
        caption: 'Priority',
      },
      {
        dataField: 'Task_Status',
        caption: 'Status',
      },
    ],
    headerFilter: {
      visible: true,
    },
    searchPanel: {
      visible: true,
      text: 'an',
    },
  });
});
