$(() => {
  $('#selectStatus').dxSelectBox({
    dataSource: statuses,
    value: statuses[0],
    inputAttr: { 'aria-label': 'Status' },
    onValueChanged(data) {
      if (data.value === 'All') { dataGrid.clearFilter(); } else { dataGrid.filter(['Task_Status', '=', data.value]); }
    },
  });

  const dataGrid = $('#gridContainer').dxDataGrid({
    dataSource: tasks,
    keyExpr: 'Task_ID',
    pager: {
      visible: true,
    },
    columnAutoWidth: true,
    showBorders: true,
    columns: [
      {
        dataField: 'Task_ID',
        width: 80,
      }, {
        caption: 'Start Date',
        dataField: 'Task_Start_Date',
        dataType: 'date',
      }, {
        caption: 'Assigned To',
        dataField: 'Employee_Full_Name',
        cssClass: 'employee',
        allowSorting: false,
      }, {
        caption: 'Subject',
        dataField: 'Task_Subject',
        width: 350,
      }, {
        caption: 'Status',
        dataField: 'Task_Status',
      },
    ],
  }).dxDataGrid('instance');
});
