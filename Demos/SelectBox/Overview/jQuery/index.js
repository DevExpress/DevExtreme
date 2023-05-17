$(() => {
  $('#products-simple').dxSelectBox({
    items: simpleProducts,
  });

  $('#products-placeholder').dxSelectBox({
    items: simpleProducts,
    placeholder: 'Choose Product',
    showClearButton: true,
  });

  $('#products-read-only').dxSelectBox({
    items: simpleProducts,
    value: simpleProducts[0],
    readOnly: true,
  });

  $('#products-disabled').dxSelectBox({
    items: simpleProducts,
    value: simpleProducts[0],
    disabled: true,
  });

  $('#products-data-source').dxSelectBox({
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
    value: simpleProducts[0],
    onValueChanged(data) {
      $('.current-value > span').text(data.value);
      DevExpress.ui.notify(`The value is changed to: "${data.value}"`);
    },
  });
});
