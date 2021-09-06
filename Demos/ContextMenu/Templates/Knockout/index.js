window.onload = function () {
  const viewModel = {
    contextMenuOptions: {
      dataSource: contextMenuItems,
      width: 200,
      target: '#image',
      itemTemplate(itemData) {
        const template = $('<div></div>');
        if (itemData.icon) {
          template.append(`<span class="${itemData.icon}"><span>`);
        }
        if (itemData.items) {
          template.append('<span class="dx-icon-spinright"><span>');
        }
        template.append(itemData.text);
        return template;
      },
      onItemClick(e) {
        if (!e.itemData.items) {
          DevExpress.ui.notify(`The "${e.itemData.text}" item was clicked`, 'success', 1500);
        }
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('demo'));
};
