$(() => {
  $('#card-view').dxCardView({
    dataSource: orders,
    keyExpr: 'ID',
    allowColumnReordering: true,
    cardsPerRow: 2,
    paging: {
      pageSize: 4
    },
    columns: [
      {
        dataField: 'OrderNumber',
        allowReordering: false,
      },
      'SaleAmount',
      'Customer',
      'Location',
      {
        dataField: 'OrderDate',
        dataType: 'date',
      },
      { 
        dataField: 'DeliveryDate',
        dataType: 'date',
      },
    ],
  });
});
