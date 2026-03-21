$(() => {
  $('#context-menu').dxContextMenu({
    dataSource: contextMenuItems,
    width: 200,
    target: '#image',
    itemTemplate(itemData) {
      const template = $('<div class="item-template-container"></div>');

      if (itemData.icon) {
        template.append(`<span class="${itemData.icon} dx-icon "></span>`);
      }

      template.append(`<span class="dx-menu-item-text">${itemData.text}</span>`);

      if (itemData.items) {
        template.append('<span class="dx-icon-spinright dx-icon"></span>');
      }

      return template;
    },
    onItemClick(e) {
      if (!e.itemData.items) {
        DevExpress.ui.notify(`The "${e.itemData.text}" item was clicked`, 'success', 1500);
      }
    },
  });
});
