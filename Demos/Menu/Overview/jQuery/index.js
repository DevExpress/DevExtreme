$(() => {
  const dxMenu = $('#menu').dxMenu({
    dataSource: menuData,
    hideSubmenuOnMouseLeave: false,
    displayExpr: 'name',
    onItemClick(data) {
      const item = data.itemData;
      if (item.price) {
        $('#product-details').removeClass('hidden');
        $('#product-details > img').attr('src', item.icon);
        $('#product-details > .price').text(`$${item.price}`);
        $('#product-details > .name').text(item.name);
      }
    },
  }).dxMenu('instance');

  const showSubmenuModes = [{
    name: 'onHover',
    delay: { show: 0, hide: 500 },
  }, {
    name: 'onClick',
    delay: { show: 0, hide: 300 },
  }];

  $('#show-submenu-mode').dxSelectBox({
    items: showSubmenuModes,
    value: showSubmenuModes[1],
    inputAttr: { 'aria-label': 'Submenu Mode' },
    displayExpr: 'name',
    onValueChanged(data) {
      dxMenu.option('showFirstSubmenuMode', data.value);
    },
  });

  $('#orientation').dxSelectBox({
    items: ['horizontal', 'vertical'],
    inputAttr: { 'aria-label': 'Orientation' },
    value: 'horizontal',
    onValueChanged(data) {
      dxMenu.option('orientation', data.value);
    },
  });

  $('#mouse-leave').dxCheckBox({
    value: false,
    text: 'Hide Submenu on Mouse Leave',
    onValueChanged(data) {
      dxMenu.option('hideSubmenuOnMouseLeave', data.value);
    },
  });
});
