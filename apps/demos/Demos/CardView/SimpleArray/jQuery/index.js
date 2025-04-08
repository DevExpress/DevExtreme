$(() => {
  $("#cardview").dxCardView({
      dataSource: employees,
      keyExpr: "ID",
      columns: [
          {
              dataField: "ID",
          },
          {
              dataField: "FirstName",
          },
          {
              dataField: "LastName",
          },
          {
              dataField: "Prefix",
          },
          {
              dataField: "Position",
          },
          {
              dataField: "Picture",
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
          imageExpr: (data) =>
              `https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos/${data.Picture}`,
          altExpr: "FirstName",
      },
  });
});
