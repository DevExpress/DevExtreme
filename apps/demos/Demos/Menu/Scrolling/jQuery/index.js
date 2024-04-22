$(() => {
  const SUBMENU_HEIGHT = 200;
  let submenuMaxHeight = 0;
  const dxMenu = $('#menu').dxMenu({
    dataSource: menuData,
    hideSubmenuOnMouseLeave: false,
    onSubmenuShowing: ({ submenuContainer }) => {
      $(submenuContainer).css('maxHeight', submenuMaxHeight || '');
    },
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

  $('#limit-height').dxCheckBox({
    value: false,
    text: `Limit Submenus height by ${SUBMENU_HEIGHT}px`,
    onValueChanged(data) {
      submenuMaxHeight = data.value ? SUBMENU_HEIGHT : 0;
    },
  });
});
