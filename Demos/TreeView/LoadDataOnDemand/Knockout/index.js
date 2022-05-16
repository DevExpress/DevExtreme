window.onload = function () {
  const viewModel = {
    treeViewOptions: {
      createChildren(parent) {
        const parentId = parent ? parent.itemData.id : '';
        return $.ajax({
          url: 'https://js.devexpress.com/Demos/Mvc/api/TreeViewData',
          dataType: 'json',
          data: { parentId },
        });
      },
      expandNodesRecursive: false,
      dataStructure: 'plain',
      rootValue: '',
      height: 500,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('treeview'));
};
