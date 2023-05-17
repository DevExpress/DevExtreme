$(() => {
  $('#productsSimple').dxTagBox({
    items: simpleProducts,
    inputAttr: productLabel,
  });

  $('#productsSearch').dxTagBox({
    items: simpleProducts,
    searchEnabled: true,
    inputAttr: productLabel,
  });

  $('#productsSelection').dxTagBox({
    items: simpleProducts,
    showSelectionControls: true,
    applyValueMode: 'useButtons',
    inputAttr: productLabel,
  });

  $('#productsHide').dxTagBox({
    items: simpleProducts,
    hideSelectedItems: true,
    inputAttr: productLabel,
  });

  $('#productsLine').dxTagBox({
    items: simpleProducts,
    multiline: false,
    inputAttr: productLabel,
  });

  $('#productsEdit').dxTagBox({
    items: simpleProducts,
    acceptCustomValue: true,
    inputAttr: productLabel,
    onCustomItemCreating(args) {
      const newValue = args.text;
      const { component } = args;
      const currentItems = component.option('items');
      const isItemInDataSource = currentItems.some((item) => item === newValue);
      if (!isItemInDataSource) {
        currentItems.unshift(newValue);
        component.option('items', currentItems);
      }
      args.customItem = newValue;
    },
  });

  $('#productsPlaceholder').dxTagBox({
    items: simpleProducts,
    placeholder: 'Choose Product...',
    inputAttr: productLabel,
  });

  $('#productsDisabled').dxTagBox({
    items: simpleProducts,
    value: [simpleProducts[0]],
    disabled: true,
    inputAttr: productLabel,
  });

  $('#productsDataSource').dxTagBox({
    dataSource: new DevExpress.data.ArrayStore({
      data: products,
      key: 'ID',
    }),
    displayExpr: 'Name',
    valueExpr: 'ID',
    inputAttr: productLabel,
  });

  $('#productsCustom').dxTagBox({
    dataSource: products,
    displayExpr: 'Name',
    valueExpr: 'ID',
    inputAttr: productLabel,
    itemTemplate(data) {
      return `<div class='custom-item'><img src='${
        data.ImageSrc}' /><div class='product-name'>${
        data.Name}</div></div>`;
    },
  });
});
