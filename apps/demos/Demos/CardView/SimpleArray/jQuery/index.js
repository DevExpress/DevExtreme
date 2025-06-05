$(() => {
  $('#card-view').dxCardView({
    dataSource: customers,
    keyExpr: 'ID',
    cardsPerRow: 2,
    paging: {
      pageSize: 4
    },
    columns: ['Company', 'Address', 'City', 'State', 'Zipcode', 'Phone'],
  });
});
