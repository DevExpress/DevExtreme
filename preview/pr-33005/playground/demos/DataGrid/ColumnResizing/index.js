$(() => {
  const dataGrid = $('#orders').dxDataGrid({
    dataSource: customers,
    keyExpr: 'ID',
    allowColumnResizing: true,
    showBorders: true,
    columnResizingMode: 'nextColumn',
    columnMinWidth: 50,
    columnAutoWidth: true,
    columns: ['CompanyName', 'City', 'State', 'Phone', 'Fax'],
  }).dxDataGrid('instance');

  const resizingModes = ['nextColumn', 'widget'];

  $('#select-resizing').dxSelectBox({
    items: resizingModes,
    value: resizingModes[0],
    inputAttr: { 'aria-label': 'Resize Mode' },
    width: 250,
    onValueChanged(data) {
      dataGrid.option('columnResizingMode', data.value);
    },
  });
});
