$(() => {
  $('#products-simple').dxSelectBox({
    items: simpleProducts,
    inputAttr: { 'aria-label': 'Simple Product' },
  });

  $('#products-placeholder').dxSelectBox({
    items: simpleProducts,
    inputAttr: { 'aria-label': 'Product With Placeholder' },
    placeholder: 'Choose Product',
    showClearButton: true,
  });

  $('#products-read-only').dxSelectBox({
    items: simpleProducts,
    inputAttr: { 'aria-label': 'ReadOnly Product' },
    value: simpleProducts[0],
    readOnly: true,
  });

  $('#products-disabled').dxSelectBox({
    items: simpleProducts,
    inputAttr: { 'aria-label': 'Disabled Product' },
    value: simpleProducts[0],
    disabled: true,
  });

  $('#products-data-source').dxSelectBox({
    inputAttr: { 'aria-label': 'Product ID' },
    dataSource: new DevExpress.data.ArrayStore({
      data: products,
      key: 'ID',
    }),
    displayExpr: 'Name',
    valueExpr: 'ID',
    value: products[0].ID,
  });

  $('#custom-templates').dxSelectBox({
    dataSource: products,
    inputAttr: { 'aria-label': 'Templated Product' },
    displayExpr: 'Name',
    valueExpr: 'ID',
    value: products[3].ID,
    fieldTemplate(data, container) {
      const result = $(`<div class='custom-item'><img src='${
        data ? data.ImageSrc : ''
      }' /><div class='product-name'></div></div>`);
      result
        .find('.product-name')
        .dxTextBox({
          value: data && data.Name,
          readOnly: true,
          inputAttr: { 'aria-label': 'Name' },
        });
      container.append(result);
    },
    itemTemplate(data) {
      return `<div class='custom-item'><img src='${
        data.ImageSrc}' /><div class='product-name'>${
        data.Name}</div></div>`;
    },
  });

  $('#product-handler').dxSelectBox({
    items: simpleProducts,
    inputAttr: { 'aria-label': 'Product' },
    value: simpleProducts[0],
    onValueChanged(data) {
      $('.current-value > span').text(data.value);
      DevExpress.ui.notify(`The value is changed to: "${data.value}"`);
    },
  });
});
