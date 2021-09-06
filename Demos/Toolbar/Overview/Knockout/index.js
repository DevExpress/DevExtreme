window.onload = function () {
  const productsStore = new DevExpress.data.DataSource(products);

  const viewModel = {
    toolbarOptions: {
      items: [{
        location: 'before',
        widget: 'dxButton',
        options: {
          type: 'back',
          onClick() {
            DevExpress.ui.notify('Back button has been clicked!');
          },
        },
      }, {
        location: 'before',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          icon: 'refresh',
          onClick() {
            DevExpress.ui.notify('Refresh button has been clicked!');
          },
        },
      }, {
        location: 'center',
        locateInMenu: 'never',
        template() {
          return $("<div class='toolbar-label'><b>Tom's Club</b> Products</div>");
        },
      }, {
        location: 'after',
        widget: 'dxSelectBox',
        locateInMenu: 'auto',
        options: {
          width: 140,
          items: productTypes,
          valueExpr: 'id',
          displayExpr: 'text',
          value: productTypes[0].id,
          onValueChanged(args) {
            if (args.value > 1) {
              productsStore.filter('type', '=', args.value);
            } else {
              productsStore.filter(null);
            }
            productsStore.load();
          },
        },
      }, {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          icon: 'plus',
          onClick() {
            DevExpress.ui.notify('Add button has been clicked!');
          },
        },
      }, {
        locateInMenu: 'always',
        text: 'Save',
        onClick() {
          DevExpress.ui.notify('Save option has been clicked!');
        },
      }, {
        locateInMenu: 'always',
        text: 'Print',
        onClick() {
          DevExpress.ui.notify('Print option has been clicked!');
        },
      }, {
        locateInMenu: 'always',
        text: 'Settings',
        onClick() {
          DevExpress.ui.notify('Settings option has been clicked!');
        },
      },
      ],
    },
    listOptions: {
      dataSource: productsStore,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('toolbar-container'));
};
