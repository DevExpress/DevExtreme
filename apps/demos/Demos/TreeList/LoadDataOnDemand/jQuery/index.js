$(() => {
  $('#treelist').dxTreeList({
    dataSource: {
      load(options) {
        return $.ajax({
          url: 'https://js.devexpress.com/Demos/Mvc/api/treeListData',
          dataType: 'json',
          data: { parentIds: options.parentIds },
        }).then((result) => ({
          data: result,
        }));
      },
    },
    remoteOperations: {
      filtering: true,
    },
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    hasItemsExpr: 'hasItems',
    rootValue: '',
    showBorders: true,
    columns: [
      { dataField: 'name' },
      {
        dataField: 'size',
        width: 100,
        customizeText(e) {
          if (e.value !== null) {
            return `${Math.ceil(e.value / 1024)} KB`;
          }
          return null;
        },
      },
      { dataField: 'createdDate', dataType: 'date', width: 150 },
      { dataField: 'modifiedDate', dataType: 'date', width: 150 },
    ],
  });
});
