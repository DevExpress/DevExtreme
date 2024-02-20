$(() => {
  $('#gridContainer').dxDataGrid({
    dataSource: orders,
    keyExpr: 'ID',
    showBorders: true,
    paging: {
      enabled: false,
    },
    selection: {
      mode: 'multiple',
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
    selectedRowKeys: [1, 4, 7],
    onSelectionChanged(e) {
      e.component.refresh(true);
    },
    summary: {
      totalItems: [{
        name: 'SelectedRowsSummary',
        showInColumn: 'SaleAmount',
        displayFormat: 'Sum: {0}',
        valueFormat: 'currency',
        summaryType: 'custom',
      },
      ],
      calculateCustomSummary(options) {
        if (options.name === 'SelectedRowsSummary') {
          if (options.summaryProcess === 'start') {
            options.totalValue = 0;
          }
          if (options.summaryProcess === 'calculate') {
            if (options.component.isRowSelected(options.value.ID)) {
              options.totalValue += options.value.SaleAmount;
            }
          }
        }
      },
    },

  });
});
