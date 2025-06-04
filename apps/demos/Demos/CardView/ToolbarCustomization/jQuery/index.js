$(() => {
  $('#card-view').dxCardView({
    dataSource: customers,
    keyExpr: 'ID',
    cardMinWidth: 100,
    wordWrapEnabled: true,
    columns: ['CompanyName', 'City', 'State', 'Phone', 'Fax'],
  });
});
