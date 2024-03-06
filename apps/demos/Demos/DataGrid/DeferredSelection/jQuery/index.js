$(() => {
  const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
  let dataGrid;

  $('#grid-container').dxDataGrid({
    dataSource: {
      store: {
        type: 'odata',
        version: 2,
        url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks',
        key: 'Task_ID',
      },
      expand: 'ResponsibleEmployee',
      select: [
        'Task_ID',
        'Task_Subject',
        'Task_Start_Date',
        'Task_Due_Date',
        'Task_Status',
        'ResponsibleEmployee/Employee_Full_Name',
      ],
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
      dataField: 'ResponsibleEmployee.Employee_Full_Name',
      width: 'auto',
      allowSorting: false,
    }, {
      caption: 'Status',
      width: 'auto',
      dataField: 'Task_Status',
    }],
  }).dxDataGrid('instance');

  async function calculateStatistics() {
    const selectedItems = await dataGrid.getSelectedRowsData();

    const totalDuration = selectedItems.reduce((currentValue, item) => {
      const duration = item.Task_Due_Date - item.Task_Start_Date;

      return currentValue + duration;
    }, 0);
    const averageDurationInDays = totalDuration / MILLISECONDS_IN_DAY / selectedItems.length;

    $('#tasks-count').text(selectedItems.length);
    $('#people-count').text(
      DevExpress.data.query(selectedItems)
        .groupBy('ResponsibleEmployee.Employee_Full_Name')
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
