$(() => {
  function logEvent(eventName) {
    const logList = $('#events ul');
    const newItem = $('<li>', { text: eventName });

    logList.prepend(newItem);
  }

  $('#gridContainer').dxDataGrid({
    dataSource: employees,
    keyExpr: 'ID',
    showBorders: true,
    paging: {
      enabled: false,
    },
    editing: {
      mode: 'row',
      allowUpdating: true,
      allowDeleting: true,
      allowAdding: true,
    },
    columns: [
      {
        dataField: 'Prefix',
        caption: 'Title',
      }, 'FirstName',
      'LastName', {
        dataField: 'Position',
        width: 130,
      }, {
        dataField: 'StateID',
        caption: 'State',
        width: 125,
        lookup: {
          dataSource: states,
          displayExpr: 'Name',
          valueExpr: 'ID',
        },
      }, {
        dataField: 'BirthDate',
        dataType: 'date',
        width: 125,
      },
    ],
    onEditingStart() {
      logEvent('EditingStart');
    },
    onInitNewRow() {
      logEvent('InitNewRow');
    },
    onRowInserting() {
      logEvent('RowInserting');
    },
    onRowInserted() {
      logEvent('RowInserted');
    },
    onRowUpdating() {
      logEvent('RowUpdating');
    },
    onRowUpdated() {
      logEvent('RowUpdated');
    },
    onRowRemoving() {
      logEvent('RowRemoving');
    },
    onRowRemoved() {
      logEvent('RowRemoved');
    },
    onSaving() {
      logEvent('Saving');
    },
    onSaved() {
      logEvent('Saved');
    },
    onEditCanceling() {
      logEvent('EditCanceling');
    },
    onEditCanceled() {
      logEvent('EditCanceled');
    },
  });

  $('#clear').dxButton({
    text: 'Clear',
    onClick() {
      $('#events ul').empty();
    },
  });
});
