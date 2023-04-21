$(() => {
  $('#gridContainer').dxDataGrid({
    dataSource: DevExpress.data.AspNet.createStore({
      key: 'Id',
      loadUrl: 'https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/Sales',
    }),
    remoteOperations: true,
    scrolling: {
      mode: 'virtual',
      rowRenderingMode: 'virtual',
    },
    paging: {
      pageSize: 100,
    },
    headerFilter: {
      visible: true,
      search: {
        enabled: true,
      },
    },
    wordWrapEnabled: true,
    showBorders: true,
    columns: [{
      dataField: 'Id',
      width: 75,
    }, {
      caption: 'Store',
      dataField: 'StoreName',
      width: 150,
    }, {
      caption: 'Category',
      dataField: 'ProductCategoryName',
      width: 120,
    }, {
      caption: 'Product',
      dataField: 'ProductName',
    }, {
      caption: 'Date',
      dataField: 'DateKey',
      dataType: 'date',
      format: 'yyyy-MM-dd',
      width: 100,
    }, {
      caption: 'Amount',
      dataField: 'SalesAmount',
      format: 'currency',
      headerFilter: {
        groupInterval: 1000,
      },
      width: 100,
    }],
  });
});
