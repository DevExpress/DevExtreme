window.onload = function () {
  const showSubmenuModes = [{
    name: 'onHover',
    delay: { show: 0, hide: 500 },
  }, {
    name: 'onClick',
    delay: { show: 0, hide: 300 },
  }];
  const showFirstSubmenuMode = ko.observable(showSubmenuModes[1]);
  const orientation = ko.observable('horizontal');
  const closeOnMouseLeave = ko.observable(false);
  const productName = ko.observable('');
  const productPrice = ko.observable('');
  const productImage = ko.observable('');

  const viewModel = {
    menuOptions: {
      dataSource: menuData,
      displayExpr: 'name',
      onItemClick(data) {
        const item = data.itemData;
        if (item.price) {
          productImage(item.icon);
          productName(item.name);
          productPrice(`$${item.price}`);
        }
      },
      hideSubmenuOnMouseLeave: closeOnMouseLeave,
      showFirstSubmenuMode,
      orientation,
    },
    submenuModeOptions: {
      items: showSubmenuModes,
      value: showFirstSubmenuMode,
      displayExpr: 'name',
    },
    orientationOptions: {
      items: ['horizontal', 'vertical'],
      value: orientation,
    },
    mouseLeaveOptions: {
      value: closeOnMouseLeave,
      text: 'Hide Submenu on Mouse Leave',
    },
    productName,
    productPrice,
    productImage,
  };

  ko.applyBindings(viewModel, document.getElementById('menu'));
};
