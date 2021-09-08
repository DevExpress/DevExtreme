window.onload = function () {
  const viewModel = {
    customIconOptions: {
      items: simpleProducts,
    },

    isLoaded: ko.observable(true),

    loadIndicatorOptions: {
      items: simpleProducts,
      dataSource: {
        loadMode: 'raw',
        load() {
          const d = $.Deferred();
          viewModel.isLoaded(false);

          setTimeout(() => {
            d.resolve(simpleProducts);
            viewModel.isLoaded(true);
          }, 3000);
          return d.promise();
        },
      },
    },

    dynamicDropDownButtonOptions: {
      items: products,
      showClearButton: true,
      value: 1,
      displayExpr: 'Name',
      valueExpr: 'ID',
      selectedItem: ko.observable(null),
    },
  };

  ko.applyBindings(viewModel, document.getElementById('select-box-demo'));
};
