window.onload = function () {
  const activeProducts = ko.observableArray();
  const allProducts = ko.observable(products);

  function productsToValues() {
    const data = [];
    allProducts().forEach((item) => {
      if (item.active) { data.push(item.count); }
    });
    activeProducts(data);
  }

  const viewModel = {
    allProducts,
    productsToValues,
    barGaugeOptions: {
      startValue: 0,
      endValue: 50,
      label: {
        format: {
          type: 'fixedPoint',
          precision: 0,
        },
      },
      onInitialized: productsToValues(),
      values: activeProducts,
    },
  };

  ko.applyBindings(viewModel, $('#gauge-demo').get(0));
};
