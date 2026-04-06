$(() => {
  $('#simple-treeview').dxTreeView({
    dataSource: DevExpress.data.AspNet.createStore({
      loadUrl: 'https://js.devexpress.com/Demos/NetCore/api/TreeViewPlainData',
      key: 'ID',
    }),
    dataStructure: 'plain',
    keyExpr: 'ID',
    displayExpr: 'Text',
    parentIdExpr: 'CategoryId',
    hasItemsExpr: 'IsGroup',
    virtualModeEnabled: true,
    rootValue: null,
  });
});
