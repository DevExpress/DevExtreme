$(() => {
  const dataGrid = $('#gridContainer').dxDataGrid({
    dataSource: generateData(100000),
    keyExpr: 'id',
    showBorders: true,
    customizeColumns(columns) {
      columns[0].width = 70;
    },
    scrolling: {
      rowRenderingMode: 'virtual',
    },
    paging: {
      pageSize: 10,
    },
    pager: {
      visible: true,
      allowedPageSizes: [5, 10, 'all'],
      showPageSizeSelector: true,
      showInfo: true,
      showNavigationButtons: true,
    },
  }).dxDataGrid('instance');

  $('#displayMode').dxSelectBox({
    items: [{ text: "Display Mode 'full'", value: 'full' }, { text: "Display Mode 'compact'", value: 'compact' }],
    displayExpr: 'text',
    inputAttr: { 'aria-label': 'Display Mode' },
    valueExpr: 'value',
    value: 'full',
    onValueChanged(data) {
      dataGrid.option('pager.displayMode', data.value);
      navButtons.option('disabled', data.value === 'compact');
    },
  });
  $('#showPageSizes').dxCheckBox({
    text: 'Show Page Size Selector',
    value: true,
    onValueChanged(data) {
      dataGrid.option('pager.showPageSizeSelector', data.value);
    },
  });
  $('#showInfo').dxCheckBox({
    text: 'Show Info Text',
    value: true,
    onValueChanged(data) {
      dataGrid.option('pager.showInfo', data.value);
    },
  }).dxCheckBox('instance');
  const navButtons = $('#showNavButtons').dxCheckBox({
    text: 'Show Navigation Buttons',
    value: true,
    onValueChanged(data) {
      dataGrid.option('pager.showNavigationButtons', data.value);
    },
  }).dxCheckBox('instance');
});
