window.onload = function () {
  const checkedItems = ko.observableArray([]);

  const viewModel = {
    treeViewOptions: {
      items: products,
      width: 320,
      showCheckBoxesMode: 'normal',
      onItemSelectionChanged(e) {
        const item = e.node;

        if (isProduct(item)) {
          processProduct($.extend({
            category: item.parent.text,
          }, item));
        } else {
          $.each(item.items, (index, product) => {
            processProduct($.extend({
              category: item.text,
            }, product));
          });
        }
      },
    },
    listOptions: {
      width: 400,
      items: checkedItems,
    },
  };

  function isProduct(data) {
    return !data.items.length;
  }

  function processProduct(product) {
    let itemIndex = -1;

    $.each(checkedItems(), (index, item) => {
      if (item.key === product.key) {
        itemIndex = index;
        return false;
      }
      return true;
    });

    if (product.selected && itemIndex === -1) {
      checkedItems.push(product);
    } else if (!product.selected) {
      checkedItems.splice(itemIndex, 1);
    }
  }

  ko.applyBindings(viewModel, document.getElementById('treeview'));
};
