$(() => {
  $('#custom-icon').dxSelectBox({
    items: simpleProducts,
    dropDownButtonTemplate() {
      return $('<img>', {
        src: '../../../../images/icons/custom-dropbutton-icon.svg',
        class: 'custom-icon',
      });
    },
  });

  const $loadIndicator = $('<div>').dxLoadIndicator({ visible: false });
  const $dropDownButtonImage = $('<img>', {
    src: '../../../../images/icons/custom-dropbutton-icon.svg',
    class: 'custom-icon',
  });

  $('#load-indicator').dxSelectBox({
    dropDownButtonTemplate(data, element) {
      $(element).append($loadIndicator, $dropDownButtonImage);
    },
    dataSource: {
      loadMode: 'raw',
      load() {
        const loadIndicator = $loadIndicator.dxLoadIndicator('instance');
        const d = $.Deferred();

        $dropDownButtonImage.hide();
        loadIndicator.option('visible', true);

        setTimeout(() => {
          d.resolve(simpleProducts);
          $dropDownButtonImage.show();
          loadIndicator.option('visible', false);
        }, 3000);
        return d.promise();
      },
    },
  });

  const dropDownButtonTemplate = function (selectedItem) {
    if (selectedItem) {
      return function () {
        return $('<img>', {
          src: `../../../../images/icons/${selectedItem.IconSrc}`,
          class: 'custom-icon',
        });
      };
    }
    return 'dropDownButton';
  };

  $('#dynamic-template').dxSelectBox({
    items: products,
    displayExpr: 'Name',
    showClearButton: true,
    valueExpr: 'ID',
    value: 1,
    itemTemplate(data) {
      return `<div class='custom-item'><img src='../../../../images/icons/${
        data.IconSrc}' /><div class='product-name'>${
        data.Name}</div></div>`;
    },
    onSelectionChanged(e) {
      e.component.option('dropDownButtonTemplate', dropDownButtonTemplate(e.selectedItem));
    },
  });
});
