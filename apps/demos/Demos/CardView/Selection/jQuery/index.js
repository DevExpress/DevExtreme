$(() => {
  $('#card-view').dxCardView({
    dataSource: customers,
    keyExpr: 'ID',
    columns: ['CompanyName', 'City', 'State', 'Phone', 'Fax'],
  });
});
