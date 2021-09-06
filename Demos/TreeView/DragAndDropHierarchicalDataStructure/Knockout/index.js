window.onload = function () {
  const productName = ko.observable('');
  const productPrice = ko.observable('');
  const productImage = ko.observable('');

  const viewModel = {
    treeViewOptions: {
      items: products,
      width: 300,
      onItemClick(e) {
        const item = e.itemData;
        if (item.price) {
          productImage(item.image);
          productName(item.text);
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
