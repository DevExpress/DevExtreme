$(() => {
  $('#grid-container').dxDataGrid({
    dataSource: {
      store: productsStore,
      reshapeOnPush: true,
    },
    repaintChangesOnly: true,
    columnAutoWidth: true,
    showBorders: true,
    paging: {
      pageSize: 10,
    },
    columns: [
      { dataField: 'ProductName', dataType: 'string' },
      { dataField: 'UnitPrice', dataType: 'number', format: 'currency' },
      { dataField: 'OrderCount', dataType: 'number' },
      { dataField: 'Quantity', dataType: 'number' },
      {
        dataField: 'Amount', dataType: 'number', format: 'currency', allowSorting: true,
      },
    ],
    summary: {
      totalItems: [{
        summaryType: 'count',
        column: 'ProductName',
      }, {
        summaryType: 'sum',
        displayFormat: '{0}',
        valueFormat: 'currency',
        column: 'Amount',
      }, {
        summaryType: 'sum',
        displayFormat: '{0}',
        column: 'OrderCount',
      }],
    },
    masterDetail: {
      enabled: true,
      template(container, options) {
        $('<div>').appendTo(container).dxDataGrid({
          dataSource: {
            store: ordersStore,
            filter: ['ProductID', '=', options.key],
            reshapeOnPush: true,
          },
          repaintChangesOnly: true,
          columnAutoWidth: true,
          showBorders: true,
          paging: {
            pageSize: 5,
          },
          columns: [{
            dataField: 'OrderID',
            dataType: 'number',
          }, {
            dataField: 'ShipCity',
            dataType: 'string',
          }, {
            dataField: 'OrderDate',
            dataType: 'datetime',
            format: 'yyyy/MM/dd HH:mm:ss',
          }, {
            dataField: 'UnitPrice',
            dataType: 'number',
          }, {
            dataField: 'Quantity',
            dataType: 'number',
          }, {
            caption: 'Amount',
            dataType: 'number',
            format: 'currency',
            allowSorting: true,
            calculateCellValue(rowData) {
              return rowData.UnitPrice * rowData.Quantity;
            },
          }],
          summary: {
            totalItems: [{
              summaryType: 'count',
              column: 'OrderID',
            }, {
              summaryType: 'sum',
              displayFormat: '{0}',
              column: 'Quantity',
            }, {
              summaryType: 'sum',
              displayFormat: '{0}',
              valueFormat: 'currency',
              column: 'Amount',
            }],
          },
        });
      },
    },
  });

  let updatesPerSecond = 100;

  setInterval(() => {
    if (orders.length > 500000) {
      return;
    }

    for (let i = 0; i < updatesPerSecond / 20; i += 1) {
      addOrder();
    }
  }, 50);

  $('#frequency-slider').dxSlider({
    min: 10,
    max: 5000,
    step: 10,
    value: updatesPerSecond,
    onValueChanged(e) {
      updatesPerSecond = e.value;
    },
    tooltip: {
      enabled: true,
      showMode: 'always',
      format: '#0 per second',
      position: 'top',
    },
  });
});
