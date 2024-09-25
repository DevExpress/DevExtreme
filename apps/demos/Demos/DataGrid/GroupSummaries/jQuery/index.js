$(() => {
  $('#gridContainer').dxDataGrid({
    dataSource: orders,
    keyExpr: 'ID',
    showBorders: true,
    selection: {
      mode: 'single',
    },
    pager: {
      visible: true,
    },
    columns: [{
      dataField: 'OrderNumber',
      width: 130,
      caption: 'Invoice Number',
    }, {
      dataField: 'OrderDate',
      dataType: 'date',
    }, {
      dataField: 'Employee',
      groupIndex: 0,
    }, {
      caption: 'City',
      dataField: 'CustomerStoreCity',
    }, {
      caption: 'State',
      dataField: 'CustomerStoreState',
    }, {
      dataField: 'SaleAmount',
      width: 160,
      alignment: 'right',
      format: 'currency',
    }, {
      dataField: 'TotalAmount',
      width: 160,
      alignment: 'right',
      format: 'currency',
    },
    ],
    sortByGroupSummaryInfo: [{
      summaryItem: 'count',
    }],
    summary: {
      groupItems: [{
        column: 'OrderNumber',
        summaryType: 'count',
        displayFormat: '{0} orders',
      }, {
        column: 'SaleAmount',
        summaryType: 'max',
        valueFormat: 'currency',
        showInGroupFooter: false,
        alignByColumn: true,
      }, {
        column: 'TotalAmount',
        summaryType: 'max',
        valueFormat: 'currency',
        showInGroupFooter: false,
        alignByColumn: true,
      }, {
        column: 'TotalAmount',
        summaryType: 'sum',
        valueFormat: 'currency',
        displayFormat: 'Total: {0}',
        showInGroupFooter: true,
      }],
    },
  });
});
