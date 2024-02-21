$(() => {
  $('#simple-treeview').dxTreeView({
    createChildren(parent) {
      const parentId = parent ? parent.itemData.id : '';

      return $.ajax({
        url: 'https://js.devexpress.com/Demos/Mvc/api/TreeViewData',
        dataType: 'json',
        data: { parentId },
      });
    },
    expandNodesRecursive: false,
    rootValue: '',
    dataStructure: 'plain',
    height: 500,
  });
});
