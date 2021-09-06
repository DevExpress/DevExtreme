window.onload = function () {
  const productName = ko.observable('');
  const productPrice = ko.observable('');
  const productImage = ko.observable('');

  const viewModel = {
    treeViewOptions: {
      items: products,
      dataStructure: 'plain',
      parentIdExpr: 'categoryId',
      keyExpr: 'ID',
      displayExpr: 'name',
      width: 300,
      onItemClick(e) {
        const item = e.itemData;
        if (item.price) {
          productImage(item.icon);
          productName(item.name);
          productPrice(`$${item.price}`);
        } else {
          productPrice('');
        }
      },
    },
    productName,
    productPrice,
    productImage,
  };

  ko.applyBindings(viewModel, document.getElementById('treeview'));
};
