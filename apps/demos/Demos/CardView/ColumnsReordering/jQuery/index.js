$(() => {
  $('#card-view').dxCardView({
    dataSource: orders,
    keyExpr: 'ID',
    allowColumnReordering: true,
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
