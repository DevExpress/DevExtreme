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

  let product = null;

  const popoverContentTemplate = function () {
    return $('<div>').append(
      $(`<p><b>Name: </b><span>${product.Name}</span></p>`),
      $(`<p><b>Price: </b><span>$${product.Price}</span></p>`),
      $(`<p><b>In-stock: </b><span>${product.Current_Inventory}</span></p>`),
      $(`<p><b>Category: </b><span>${product.Category}</span></p>`),
    );
  };

  const popover = $('#popover').dxPopover({}).dxPopover('instance');

  $('#productsCustom').dxTagBox({
    dataSource: products,
    value: [1, 2],
    displayExpr: 'Name',
    valueExpr: 'ID',
    inputAttr: productLabel,
    itemTemplate(data) {
      return `<div class='custom-item'><img src='${
        data.ImageSrc}' /><div class='product-name'>${
        data.Name}</div></div>`;
    },
    tagTemplate(data) {
      const isDisabled = data.Name === 'SuperHD Video Player';

      const tagImg = $('<img>', { class: 'tag-img' }).attr({
        src: data.ImageSrc,
        alt: data.Name,
      });

      const tag = $('<div>')
        .attr('aria-disabled', isDisabled)
        .addClass(`dx-tag-content ${isDisabled && 'disabled-tag'}`)
        .append(
          tagImg,
          $('<span>').text(data.Name),
          !isDisabled && $('<div>').addClass('dx-tag-remove-button'),
        );

      tag.on('dxhoverstart', (args) => {
        product = data;
        popover.option({
          contentTemplate: () => popoverContentTemplate(),
          target: args.target.closest('.dx-tag'),
        });

        popover.show();
      });

      tag.on('dxhoverend', () => {
        popover.hide();
      });

      return tag;
    },
  });
});
