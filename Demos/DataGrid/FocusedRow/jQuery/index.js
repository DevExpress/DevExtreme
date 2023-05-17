$(() => {
  const dataGrid = $('#gridContainer').dxDataGrid({
    dataSource: {
      store: {
        type: 'odata',
        key: 'Task_ID',
        url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks',
      },
      expand: 'ResponsibleEmployee',
      select: [
        'Task_ID',
        'Task_Subject',
        'Task_Start_Date',
        'Task_Status',
        'Task_Description',
        'Task_Completion',
        'ResponsibleEmployee/Employee_Full_Name',
      ],
    },
    columns: [
      {
        dataField: 'Task_ID',
        width: 80,
      }, {
        dataField: 'Task_Start_Date',
        caption: 'Start Date',
        dataType: 'date',
      }, {
        dataField: 'ResponsibleEmployee.Employee_Full_Name',
        caption: 'Assigned To',
        allowSorting: false,
      }, {
        dataField: 'Task_Subject',
        caption: 'Subject',
        width: 350,
      }, {
        dataField: 'Task_Status',
        caption: 'Status',
      },
    ],
    focusedRowEnabled: true,
    focusedRowKey: 117,
    showBorders: true,
    paging: {
      pageSize: 10,
    },
    onFocusedRowChanging(e) {
      const rowsCount = e.component.getVisibleRows().length;
      const pageCount = e.component.pageCount();
      const pageIndex = e.component.pageIndex();
      const key = e.event && e.event.key;

      if (key && e.prevRowIndex === e.newRowIndex) {
        if (e.newRowIndex === rowsCount - 1 && pageIndex < pageCount - 1) {
          e.component.pageIndex(pageIndex + 1).done(() => {
            e.component.option('focusedRowIndex', 0);
          });
        } else if (e.newRowIndex === 0 && pageIndex > 0) {
          e.component.pageIndex(pageIndex - 1).done(() => {
            e.component.option('focusedRowIndex', rowsCount - 1);
          });
        }
      }
    },
    onFocusedRowChanged(e) {
      const taskItem = getTaskDataItem(e.row);
      const focusedRowKey = e.component.option('focusedRowKey');
      $('#taskSubject').html(taskItem.subject);
      $('#taskDetails').html(taskItem.description);
      $('#taskStatus').html(taskItem.status);
      $('#taskProgress').text(taskItem.progress);
      $('#taskId').dxNumberBox('instance').option('value', focusedRowKey);
    },
  }).dxDataGrid('instance');

  $('#taskId').dxNumberBox({
    min: 1,
    max: 183,
    step: 0,
    inputAttr: { 'aria-label': 'Focused Row Key' },
    onValueChanged(e) {
      if (e.event && e.value > 0) {
        dataGrid.option('focusedRowKey', e.value);
      }
    },
  });

  $('#autoNavigateCheckboxId').dxCheckBox({
    text: 'Auto Navigate To Focused Row',
    value: true,
    onValueChanged(e) {
      dataGrid.option('autoNavigateToFocusedRow', e.value);
    },
  });
});

function getTaskDataItem(row) {
  const rowData = row && row.data;
  const taskItem = {
    subject: '',
    description: '',
    status: '',
    progress: '',
  };
  if (rowData) {
    taskItem.subject = rowData.Task_Subject;
    taskItem.description = rowData.Task_Description;
    taskItem.status = rowData.Task_Status;
    if (rowData.Task_Completion) {
      taskItem.progress = `${rowData.Task_Completion}%`;
    }
  }
  return taskItem;
}
