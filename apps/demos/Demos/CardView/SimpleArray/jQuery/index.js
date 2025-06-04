$(() => {
  $('#card-view').dxCardView({
    dataSource: customers,
    keyExpr: 'ID',
    cardMinWidth: 100,
    wordWrapEnabled: true,
    columns: ['CompanyName', 'Address', 'City', 'State', 'Zipcode', 'Phone'],
  });
});
