$(() => {
  const newRowPositionOptions = ['first', 'last', 'pageTop', 'pageBottom', 'viewportTop', 'viewportBottom'];
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
    remoteOperations: true,
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
            const key = new DevExpress.data.Guid().toString();
            dataGrid.option('editing.changes', [{
              key,
              type: 'insert',
              insertAfterKey: e.row.key,
            }]);
            dataGrid.option('editing.editRowKey', key);
          },
          visible({ row }) {
            return !row.isEditing;
          },
        }, 'delete', 'save', 'cancel'],
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
    inputAttr: { 'aria-label': 'Position' },
    onValueChanged(e) {
      dataGrid.option('editing.newRowPosition', e.value);
    },
  }).dxSelectBox('instance');

  $('#scrollingModeSelectBox').dxSelectBox({
    value: 'standard',
    items: scrollingModeOptions,
    inputAttr: { 'aria-label': 'Scrolling Mode' },
    onValueChanged(e) {
      dataGrid.option('scrolling.mode', e.value);
    },
  }).dxSelectBox('instance');
});
