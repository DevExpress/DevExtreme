window.onload = function () {
  const viewModel = {
    actionSheetOptions: {
      dataSource: actionSheetItems,
      title: 'Choose action',
      visible: ko.observable(false),
      target: ko.observable(''),
      usePopover: true,
      onItemClick(value) {
        DevExpress.ui.notify(`The "${value.itemData.text}" button is clicked.`);
      },
    },

    listOptions: {
      dataSource: contacts,
      onItemClick(e) {
        e.model.actionSheetOptions.target(e.itemElement);
        e.model.actionSheetOptions.visible(true);
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('demo'));
};
