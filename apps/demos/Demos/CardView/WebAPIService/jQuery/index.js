$(() => {
  const url = "https://js.devexpress.com/Demos/NetCore/api/DataGridWebApi/Orders";
  const cardview = $("#cardview")
    .dxCardView({
      dataSource: DevExpress.data.AspNet.createStore({
        key: "OrderID",
        loadUrl: `${url}`,
      }),
      remoteOperations: true,
      width: "100%",
      cardsPerRow: 3,
      paging: {
        pageSize: 6,
      },
      pager: {
        allowedPageSizes: [3, 6, 9, 12, 30],
        showInfo: true,
        showNavigationButtons: true,
        showPageSizeSelector: true,
        visible: true,
      },
      columns: ["OrderID", "OrderDate", "ShippedDate", "Freight", "ShipName", "ShipCity", "ShipCountry"],
    })
    .dxCardView("instance");
});
