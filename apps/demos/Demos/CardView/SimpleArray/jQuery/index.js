$(() => {
  $('#card-view').dxCardView({
    dataSource: customers,
    keyExpr: 'ID',
    columns: ['CompanyName', 'Address', 'City', 'State', 'Zipcode', 'Phone'],
  });
});
