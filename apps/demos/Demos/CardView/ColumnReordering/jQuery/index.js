$(() => {
  $('#card-view').dxCardView({
    dataSource: orders,
    keyExpr: 'ID',
    allowColumnReordering: true,
    cardsPerRow: 'auto',
    cardMinWidth: 300,
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
