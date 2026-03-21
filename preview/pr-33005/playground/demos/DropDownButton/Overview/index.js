$(() => {
  $('#one-section').dxDropDownButton({
    text: 'Download Trial',
    icon: 'save',
    dropDownOptions: {
      width: 230,
    },
    onItemClick(e) {
      DevExpress.ui.notify(`Download ${e.itemData}`, 'success', 600);
    },
    items: downloads,
  });

  $('#custom-template').dxDropDownButton({
    items: profileSettings,
    splitButton: true,
    onButtonClick(e) {
      DevExpress.ui.notify(`Go to ${e.element.find('.button-title').text()}'s profile`, 'success', 600);
    },
    onItemClick(e) {
      DevExpress.ui.notify(e.itemData.name, 'success', 600);
    },
    displayExpr: 'name',
    keyExpr: 'id',
    useSelectMode: false,
    template(data, element) {
      const $imageContainer = $('<div>')
        .addClass('button-img-container').appendTo(element);

      $('<div>')
        .addClass('button-img-indicator').appendTo($imageContainer);

      $('<img>')
        .addClass('button-img')
        .attr({
          src: '../../../../images/employees/51.png',
          alt: 'employee',
        }).appendTo($imageContainer);

      const $textContainer = $('<div>')
        .addClass('text-container').appendTo(element);

      $('<div>')
        .addClass('button-title').text('Olivia Peyton')
        .appendTo($textContainer);

      $('<div>')
        .addClass('button-row').text('IT Manager').appendTo($textContainer);

      return $(element);
    },
  });

  $('#template').dxToolbar({
    items: [
      {
        location: 'before',
        widget: 'dxDropDownButton',
        options: {
          displayExpr: 'name',
          keyExpr: 'id',
          selectedItemKey: 3,
          width: 125,
          stylingMode: 'text',
          useSelectMode: true,
          onSelectionChanged(e) {
            $('#text').css('text-align', e.item.name.toLowerCase());
          },
          items: alignments,
        },
      },
      {
        location: 'before',
        widget: 'dxDropDownButton',
        options: {
          items: colors,
          icon: 'square',
          stylingMode: 'text',
          dropDownOptions: { width: 'auto' },
          onInitialized(e) {
            dropDownButton = e.component;
          },
          dropDownContentTemplate(data, $container) {
            const $colorPicker = $('<div>')
              .addClass('custom-color-picker')
              .appendTo($container);

            data.forEach((color) => {
              const $button = $('<i>')
                .addClass('color dx-icon dx-icon-square')
                .on('dxclick', () => {
                  applyColor($('#text'), color);
                  applyColor(dropDownButton.$element().find('.dx-dropdownbutton-action .dx-icon').first(), color);
                  dropDownButton.close();
                });

              applyColor($button, color);
              $colorPicker.append($button);
            });
          },
        },
      },
      {
        location: 'before',
        widget: 'dxDropDownButton',
        options: {
          stylingMode: 'text',
          displayExpr: 'text',
          keyExpr: 'size',
          useSelectMode: true,
          items: fontSizes,
          selectedItemKey: 14,
          onSelectionChanged(e) {
            $('#text').css('font-size', `${e.item.size}px`);
          },
          itemTemplate(itemData) {
            return $('<div>')
              .text(itemData.text)
              .css('font-size', `${itemData.size}px`);
          },
        },
      },
      {
        location: 'before',
        widget: 'dxDropDownButton',
        options: {
          stylingMode: 'text',
          icon: 'indent',
          displayExpr: 'text',
          keyExpr: 'lineHeight',
          useSelectMode: true,
          items: lineHeights,
          selectedItemKey: 1.35,
          onSelectionChanged(e) {
            $('#text').css('line-height', e.item.lineHeight);
          },
        },
      },
    ],
  });
});

let dropDownButton;
function applyColor($element, color) {
  if (color) {
    $element.css('color', color);
  } else {
    $element.css('color', '');
  }
}
