$(() => {
  function getDeliveryHours(rowData) {
    return (new Date(rowData.DeliveryDate)).getHours();
  }

  $('#card-view').dxCardView({
    dataSource: orders,
    keyExpr: 'ID',
    cardMinWidth: 100,
    wordWrapEnabled: true,
    headerFilter: {
      visible: true,
    },
    filterPanel: {
      visible: true,
    },
    filterValue: [['Employee', '=', 'Clark Morgan'], 'and', ['DeliveryDate', 'beforeNoon']],
    filterBuilder: {
      customOperations: [{
        name: 'beforeNoon',
        caption: 'Before noon',
        dataTypes: ['datetime'],
        icon: 'check',
        hasValue: false,
        calculateFilterExpression() {
          return [getDeliveryHours, '<', 12];
        },
      }, {
        name: 'afterNoon',
        caption: 'After noon',
        dataTypes: ['datetime'],
        icon: 'check',
        hasValue: false,
        calculateFilterExpression() {
          return [getDeliveryHours, '>=', 12];
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
      dataType: 'datetime',
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
    }, {
      dataField: 'Employee',
    }],
  });
});
