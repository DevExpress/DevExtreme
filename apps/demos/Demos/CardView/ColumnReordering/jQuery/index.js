$(() => {
  $("#cardview").dxCardView({
    dataSource: employees,
    keyExpr: "ID",
    cardsPerRow: 3,
    paging: {
      pageSize: 6,
    },
    pager: {
      visible: true,
      showPageSizeSelector: true,
      allowedPageSizes: "auto",
    },
    allowColumnReordering: true,
    columns: [
      {
        dataField: "ID",
        allowReordering: false,
      },
      {
        caption: "Full Name",
        calculateCellValue(data) {
          return `${data.FirstName} ${data.LastName}`;
        },
      },
      {
        dataField: "Prefix",
      },
      {
        dataField: "Position",
      },
      {
        dataField: "BirthDate",
      },
      {
        dataField: "HireDate",
      },
      {
        dataField: "Address",
      },
    ],
    cardCover: {
      imageExpr: (data) => `https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos/${data.Picture}`,
      altExpr: "FirstName",
    },
  });
});