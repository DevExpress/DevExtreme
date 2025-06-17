$(() => {
  $('#card-view').dxCardView({
    dataSource: houses,
    keyExpr: 'ID',
    cardsPerRow: 2,
    paging: {
      pageSize: 4
    },
    cardCover: {
      imageExpr: ({ ID }) => `https://demos.devexpress.com/ASPxCardViewDemos/Content/HomesPhoto/${ID}.jpg`,
      altExpr: () => 'Photo of the house',
    },
    columns: [
      'Address',
      {
        dataField: 'Price',
        format: 'currency',
        sortOrder: 'asc',
      },
      'HouseSize',
      'Baths',
      {
        dataField: 'Beds',
        sortOrder: 'desc',
      },
    ],
    sorting: {
      mode: 'multiple'
    },
  });
});
