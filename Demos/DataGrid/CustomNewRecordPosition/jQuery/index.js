$(() => {
  const newRowPositionOptions = ['first', 'last', 'pageBottom', 'pageTop', 'viewportBottom', 'viewportTop'];
  const scrollingModeOptions = ['standard', 'virtual'];

  const dataGrid = $('#gridContainer').dxDataGrid({
    dataSource,
    showBorders: true,
    columnAutoWidth: true,
    editing: {
      mode: 'row',
      allowAdding: true,
      allowDeleting: true,
      allowUpdating: true,
      confirmDelete: false,
      useIcons: true,
      newRowPosition: 'viewportTop',
    },
    columns: [
      {
        dataField: 'OrderID',
        allowEditing: false,
      }, {
        dataField: 'OrderDate',
        dataType: 'date',
        validationRules: [{ type: 'required' }],
      }, 'ShipName', 'ShipCity', 'ShipPostalCode', 'ShipCountry', {
        type: 'buttons',
        buttons: [{
          icon: 'add',
          onClick(e) {
            const changes = dataGrid.option('editing.changes');
            const key = new DevExpress.data.Guid().toString();
            changes.push({
              key,
              type: 'insert',
              insertAfterKey: e.row.key,
            });
            dataGrid.option('editing.changes', changes);
            dataGrid.option('editing.editRowKey', key);
          },
          visible({ row }) {
            return !row.isEditing;
          },
        }, 'delete', 'cancel', 'save'],
      }],
    toolbar: {
      items: [{
        name: 'addRowButton',
        showText: 'always',
      }],
    },
    onRowInserted(e) {
      e.component.navigateToRow(e.key);
    },
  }).dxDataGrid('instance');

  $('#newRowPositionSelectBox').dxSelectBox({
    value: 'viewportTop',
    items: newRowPositionOptions,
    onValueChanged(e) {
      dataGrid.option('editing.newRowPosition', e.value);
    },
  }).dxSelectBox('instance');

  $('#scrollingModeSelectBox').dxSelectBox({
    value: 'standard',
    items: scrollingModeOptions,
    onValueChanged(e) {
      dataGrid.option('scrolling.mode', e.value);
    },
  }).dxSelectBox('instance');
});
