$(() => {
  $('#card-view').dxCardView({
    dataSource: houses,
    keyExpr: 'ID',
    cardsPerRow: 'auto',
    cardMinWidth: 350,
    wordWrapEnabled: true,
    cardCover: {
      imageExpr: ({ ID }) => `../../../images/houses/${ID}.jpg`,
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
      mode: 'multiple',
    },
  });
});
