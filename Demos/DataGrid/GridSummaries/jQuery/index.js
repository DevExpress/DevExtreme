$(() => {
  $('#gridContainer').dxDataGrid({
    dataSource: orders,
    keyExpr: 'ID',
    showBorders: true,
    selection: {
      mode: 'single',
    },
    columns: [{
      dataField: 'OrderNumber',
      width: 130,
      caption: 'Invoice Number',
    }, {
      dataField: 'OrderDate',
      dataType: 'date',
    },
    'Employee', {
      caption: 'City',
      dataField: 'CustomerStoreCity',
    }, {
      caption: 'State',
      dataField: 'CustomerStoreState',
    }, {
      dataField: 'SaleAmount',
      alignment: 'right',
      format: 'currency',
      width: 160,
    },
    ],
    summary: {
      totalItems: [{
        column: 'OrderNumber',
        summaryType: 'count',
      }, {
        column: 'OrderDate',
        summaryType: 'min',
        customizeText(itemInfo) {
          return `First: ${DevExpress.localization.formatDate(itemInfo.value, 'MMM dd, yyyy')}`;
        },
      }, {
        column: 'SaleAmount',
        summaryType: 'sum',
        valueFormat: 'currency',
      }],
    },
  });
});
