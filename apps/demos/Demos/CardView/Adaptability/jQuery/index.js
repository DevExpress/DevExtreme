$(() => {
  $("#cardview").dxCardView({
      dataSource: employees,
      keyExpr: "ID",
      width: "100%",
      paging: {
          pageSize: 8,
      },
      pager: {
          allowedPageSizes: [5, 8, 15, 30],
          showInfo: true,
          showNavigationButtons: true,
          showPageSizeSelector: true,
          visible: true,
      },
      cardCover: {
          imageExpr: (data) =>
              `https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos/${data.Picture}`,
          altExpr: "FirstName",
      },
      columns: [
          {
              caption: "Full Name",
              calculateCellValue: function (data) {
                  return `${data.FirstName} ${data.LastName}`;
              },
          },
          "Prefix",
          "Position",
          "BirthDate",
          "HireDate",
          "Address",
      ],
  });
});