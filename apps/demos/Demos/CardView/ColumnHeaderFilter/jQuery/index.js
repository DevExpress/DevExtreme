$(() => {
  function getOrderDay(rowData) {
    return (new Date(rowData.OrderDate)).getDay();
  }

  $('#card-view').dxCardView({
    dataSource: orders,
    keyExpr: 'OrderNumber',
    cardsPerRow: 'auto',
    cardMinWidth: 280,
    wordWrapEnabled: true,
    headerFilter: {
      visible: true,
    },
    columns: [{
      dataField: 'OrderNumber',
      headerFilter: {
        groupInterval: 10000,
      },
    }, {
      dataField: 'OrderDate',
      dataType: 'date',
      calculateFilterExpression(value, selectedFilterOperations, target) {
        if (value === 'weekends') {
          return [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]];
        }
        return this.defaultCalculateFilterExpression(value, selectedFilterOperations, target);
      },
      headerFilter: {
        dataSource(data) {
          data.dataSource.postProcess = function (results) {
            results.push({
              text: 'Weekends',
              value: 'weekends',
            });
            return results;
          };
        },
      },
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
      dataField: 'StoreCity',
      headerFilter: {
        search: {
          enabled: true,
          editorOptions: {
            placeholder: 'Search city or state',
          },
          searchExpr: ['StoreCity', 'StoreState'],
        },
      },
    }, {
      dataField: 'StoreState',
      headerFilter: {
        search: {
          enabled: true,
          editorOptions: {
            placeholder: 'Search state or city',
          },
          searchExpr: ['StoreState', 'StoreCity'],
        },
      },
    }, {
      dataField: 'Employee',
    }],
  });
});
