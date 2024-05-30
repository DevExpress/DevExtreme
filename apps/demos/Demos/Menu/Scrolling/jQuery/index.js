$(() => {
  const SUBMENU_HEIGHT = 200;
  let submenuMaxHeight = 0;

  $('#menu').dxMenu({
    dataSource: menuData,
    hideSubmenuOnMouseLeave: false,
    onSubmenuShowing: ({ submenuContainer }) => {
      $(submenuContainer).css('maxHeight', submenuMaxHeight || '');
    },
    onItemClick(e) {
      if (!e.itemData.items) {
        DevExpress.ui.notify(`The "${e.itemData.text}" item was clicked`, 'success', 1500);
      }
    },
  }).dxMenu('instance');

  $('#limit-height').dxCheckBox({
    value: false,
    text: `Limit submenu height to ${SUBMENU_HEIGHT}px`,
    onValueChanged(data) {
      submenuMaxHeight = data.value ? SUBMENU_HEIGHT : 0;
    },
  });
});
