$(() => {
  const dataGrid = $('#gridContainer').dxDataGrid({
    dataSource: orders,
    keyExpr: 'ID',
    allowColumnReordering: true,
    allowColumnResizing: true,
    width: '100%',
    showBorders: true,
    selection: {
      mode: 'single',
    },
    filterRow: {
      visible: true,
    },
    groupPanel: {
      visible: true,
    },
    stateStoring: {
      enabled: true,
      type: 'localStorage',
      storageKey: 'storage',
    },
    pager: {
      visible: true,
      showPageSizeSelector: true,
      allowedPageSizes: [5, 10, 20],
    },
    columns: [{
      dataField: 'OrderNumber',
      width: 130,
      caption: 'Invoice Number',
    }, {
      dataField: 'OrderDate',
      dataType: 'date',
      sortOrder: 'desc',
    }, {
      dataField: 'SaleAmount',
      alignment: 'right',
      format: 'currency',
    },
    'Employee', {
      caption: 'City',
      dataField: 'CustomerStoreCity',
    }, {
      caption: 'State',
      dataField: 'CustomerStoreState',
      groupIndex: 0,
    }],
  }).dxDataGrid('instance');

  $('#state-reset-link').on('click', () => {
    dataGrid.state(null);
  });
});
