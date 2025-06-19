$(() => {
  function getOrderDay(rowData) {
    return (new Date(rowData.OrderDate)).getDay();
  }

  $('#card-view').dxCardView({
    dataSource: orders,
    keyExpr: 'ID',
    cardsPerRow: 'auto',
    cardMinWidth: 310,
    headerFilter: {
      visible: true,
    },
    filterPanel: {
      visible: true,
    },
    filterValue: [['Employee', '=', 'Clark Morgan'], 'and', ['DeliveryDate', 'weekends']],
    filterBuilder: {
      customOperations: [{
        name: 'weekends',
        caption: 'Weekends',
        dataTypes: ['date'],
        icon: 'check',
        hasValue: false,
        calculateFilterExpression() {
          return [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]];
        },
      }],
    },
    columns: [{
      dataField: 'OrderNumber',
      headerFilter: {
        groupInterval: 10000,
      },
    }, {
      dataField: 'OrderDate',
      dataType: 'date',
    }, {
      dataField: 'DeliveryDate',
      dataType: 'date',
    }, {
      dataField: 'SaleAmount',
      dataType: 'number',
      headerFilter: {
        dataSource: [{
          text: 'Less than $3000',
          value: ['SaleAmount', '<', 3000],
        }, {

          text: '$3000 - $5000',
          value: [['SaleAmount', '>=', 3000], ['SaleAmount', '<', 5000]],
        }, {

          text: '$5000 - $10000',
          value: [['SaleAmount', '>=', 5000], ['SaleAmount', '<', 10000]],
        }, {

          text: '$10000 - $20000',
          value: [['SaleAmount', '>=', 10000], ['SaleAmount', '<', 20000]],
        }, {
          text: 'Greater than $20000',
          value: ['SaleAmount', '>=', 20000],
        }],
      },
    }, {
      dataField: 'CustomerStoreCity',
      caption: 'City',
    }, {
      dataField: 'Employee',
    }],
  });
});
