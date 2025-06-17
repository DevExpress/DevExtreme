$(() => {
  $('#card-view').dxCardView({
    dataSource: customers,
    keyExpr: 'ID',
    cardsPerRow: 'auto',
    cardMinWidth: 320,
    columns: ['Company', 'Address', 'City', 'State', 'Zipcode', 'Phone'],
  });
});
