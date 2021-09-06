$(() => {
  const productsToValues = function () {
    return $.map(products, (item) => (item.active ? item.count : null));
  };

  const gauge = $('#gauge').dxBarGauge({
    startValue: 0,
    endValue: 50,
    values: productsToValues(),
    label: {
      format: {
        type: 'fixedPoint',
        precision: 0,
      },
    },
  }).dxBarGauge('instance');

  $('#panel').append($.map(products, (product) => $('<div></div>').dxCheckBox({
    value: product.active,
    text: product.name,
    onValueChanged(data) {
      product.active = data.value;
      gauge.values(productsToValues());
    },
  })));
});
