$(() => {
  const IMG_URL = 'https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos';

  $('#card-view').dxCardView({
    dataSource: employees,
    columns: [
      {
        dataField: 'FullName',
        allowHiding: false,
      },
      'Position',
      'Department',
      'Phone',
      'Email',
    ],
    keyExpr: 'ID',
    allowColumnReordering: true,
    cardsPerRow: 'auto',
    cardMinWidth: 250,
    cardCover: {
      imageExpr: ({ Picture }) => `${IMG_URL}/${Picture}`,
      altExpr: ({ FullName }) => `${FullName} picture`,
    },
    pager: {
      showInfo: true,
      showNavigationButtons: true,
      showPageSizeSelector: true,
    },
    selection: {
      mode: 'multiple',
    },
    headerFilter: {
      visible: true,
    },
    searchPanel: {
      visible: true,
    },
    columnChooser: {
      enabled: true,
      height: 340,
      mode: 'select',
      position: {
        my: 'right top',
        at: 'right bottom',
        of: '.dx-cardview-column-chooser-button',
      },
      selection: {
        selectByClick: true,
      },
    },
  });
});
