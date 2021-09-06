window.onload = function () {
  const currentProduct = ko.observable(simpleProducts[0]);
  const productsDataSource = new DevExpress.data.DataSource({
    store: {
      data: simpleProducts,
      type: 'array',
      key: 'ID',
    },
  });
  const searchModeOption = ko.observable('contains');
  const searchExprOption = ko.observable('Name');
  const searchTimeoutOption = ko.observable(200);
  const minSearchLengthOption = ko.observable(0);
  const showDataBeforeSearchOption = ko.observable(false);
  const searchExprItems = [{
    name: "'Name'",
    value: 'Name',
  }, {
    name: "['Name', 'Category']",
    value: ['Name', 'Category'],
  }];

  const viewModel = {
    currentProductName: ko.computed(() => {
      const product = currentProduct();

      return product ? currentProduct().Name : product;
    }),
    currentProductId: ko.computed(() => {
      const product = currentProduct();

      return product ? currentProduct().ID : product;
    }),
    isProductDefined: ko.computed(() => {
      const product = currentProduct();

      return product !== null && product !== undefined;
    }),
    searchBoxOptions: {
      dataSource: products,
      displayExpr: 'Name',
      searchEnabled: true,
      searchMode: searchModeOption,
      searchExpr: searchExprOption,
      searchTimeout: searchTimeoutOption,
      minSearchLength: minSearchLengthOption,
      showDataBeforeSearch: showDataBeforeSearchOption,
    },
    editBoxOptions: {
      acceptCustomValue: true,
      dataSource: productsDataSource,
      displayExpr: 'Name',
      value: currentProduct,
      onCustomItemCreating(data) {
        if (!data.text) {
          data.customItem = null;
          return;
        }

        const productIds = simpleProducts.map((item) => item.ID);
        const incrementedId = Math.max.apply(null, productIds) + 1;
        const newItem = {
          Name: data.text,
          ID: incrementedId,
        };

        productsDataSource.store().insert(newItem);
        productsDataSource.load();
        data.customItem = newItem;
      },
    },
    searchModeOptions: {
      items: ['contains', 'startswith'],
      value: searchModeOption,
    },
    searchExprOptions: {
      items: searchExprItems,
      displayExpr: 'name',
      valueExpr: 'value',
      value: searchExprOption,
    },
    searchTimeoutOptions: {
      min: 0,
      max: 5000,
      showSpinButtons: true,
      step: 100,
      value: searchTimeoutOption,
    },
    minSearchLengthOptions: {
      min: 0,
      max: 5,
      showSpinButtons: true,
      value: minSearchLengthOption,
    },
    showDataBeforeSearchOptions: {
      text: 'Show Data Before Search',
      value: showDataBeforeSearchOption,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('selectbox-demo'));
};
