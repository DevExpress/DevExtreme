$(() => {
  $('#simple-treeview').dxTreeView({
    dataSource: new DevExpress.data.DataSource({
      store: new DevExpress.data.ODataStore({
        version: 2,
        url: 'https://js.devexpress.com/Demos/WidgetsGallery/odata/HierarchicalItems',
      }),
    }),
    dataStructure: 'plain',
    keyExpr: 'Id',
    displayExpr: 'Name',
    parentIdExpr: 'CategoryId',
    hasItemsExpr: 'IsGroup',
    virtualModeEnabled: true,
  });
});
