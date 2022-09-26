const toolbarSeparator = {
  cssClass: 'toolbar-separator-container',
  locateInMenu: 'auto',
  location: 'before',
  template(itemData, itemIndex, element) {
    $('<div>')
      .addClass('toolbar-separator')
      .appendTo(element);
  },
  menuItemTemplate(itemData, itemIndex, element) {
    $('<div>')
      .addClass('toolbar-menu-separator')
      .appendTo(element);
  },
};

const toolbarItems = [
  {
    location: 'before',
    widget: 'dxButton',
    options: {
      icon: 'undo',
      onClick() {
        DevExpress.ui.notify('Undo button has been clicked!');
      },
    },
  },
  {
    location: 'before',
    widget: 'dxButton',
    options: {
      icon: 'redo',
      onClick() {
        DevExpress.ui.notify('Redo button has been clicked!');
      },
    },
  },
  toolbarSeparator,
  {
    location: 'before',
    locateInMenu: 'auto',
    widget: 'dxDropDownButton',
    options: {
      width: '100%',
      displayExpr: 'text',
      keyExpr: 'size',
      useSelectMode: true,
      items: fontSizes,
      selectedItemKey: 14,
      itemTemplate(itemData) {
        return $('<div>')
          .text(itemData.text)
          .css('font-size', `${itemData.size}px`);
      },
      onSelectionChanged() {
        DevExpress.ui.notify('Font size value has been changed!');
      },
    },
  },
  {
    location: 'before',
    locateInMenu: 'auto',
    widget: 'dxDropDownButton',
    options: {
      width: '100%',
      icon: 'indent',
      displayExpr: 'text',
      keyExpr: 'lineHeight',
      useSelectMode: true,
      items: lineHeights,
      selectedItemKey: 1.35,
      onSelectionChanged() {
        DevExpress.ui.notify('Line height value has been changed!');
      },
    },
  },
  {
    locateInMenu: 'auto',
    location: 'before',
    widget: 'dxSelectBox',
    options: {
      placeholder: 'Font',
      displayExpr: 'text',
      dataSource: fontFamilies,
    },
  },
  toolbarSeparator,
  {
    location: 'before',
    widget: 'dxButtonGroup',
    options: {
      displayExpr: 'text',
      items: fontStyles,
      keyExpr: 'style',
      stylingMode: 'outlined',
      selectionMode: 'multiple',
      onItemClick(e) {
        DevExpress.ui.notify(`The "${e.itemData.hint}" button was clicked`);
      },
    },
  },
  {
    location: 'before',
    template(itemData, itemIndex, element) {
      $(element).addClass('toolbar-separator');
    },
  },
  {
    locateInMenu: 'auto',
    location: 'before',
    widget: 'dxButtonGroup',
    template(itemData, itemIndex, element) {
      const $buttonGroup = $('<div>').dxButtonGroup({
        items: textAlignItems,
        keyExpr: 'alignment',
        stylingMode: 'outlined',
        selectedItemKeys: ['left'],
        onItemClick(e) {
          DevExpress.ui.notify(`The "${e.itemData.hint}" button was clicked`);
        },
      });

      $buttonGroup.appendTo(element);
    },
    menuItemTemplate(itemData, itemIndex, element) {
      const $buttonGroup = $('<div>').dxButtonGroup({
        displayExpr: 'text',
        items: textAlignItemsExtended,
        keyExpr: 'alignment',
        stylingMode: 'outlined',
        selectedItemKeys: ['left'],
        onItemClick(e) {
          DevExpress.ui.notify(`The "${e.itemData.hint}" button was clicked`);
        },
      });

      $buttonGroup.appendTo(element);
    },
  },
  {
    location: 'before',
    widget: 'dxButtonGroup',
    displayExpr: 'text',
    options: {
      items: listTypes,
      keyExpr: 'alignment',
      stylingMode: 'outlined',
      onItemClick(e) {
        DevExpress.ui.notify(`The "${e.itemData.hint}" button was clicked`);
      },
    },
  },
  toolbarSeparator,
  {
    locateInMenu: 'auto',
    location: 'before',
    widget: 'dxDateBox',
    options: {
      width: 200,
      type: 'date',
      value: new Date(2022, 9, 7),
    },
  },
  toolbarSeparator,
  {
    locateInMenu: 'auto',
    location: 'before',
    widget: 'dxCheckBox',
    options: {
      value: false,
      text: 'Checkbox text',
      onOptionChanged() {
        DevExpress.ui.notify('Checkbox value has been changed!');
      },
    },
  },
  {
    location: 'after',
    widget: 'dxButton',
    showText: 'inMenu',
    options: {
      icon: 'attach',
      text: 'Attach',
      onClick() {
        DevExpress.ui.notify('Attach button has been clicked!');
      },
    },
  },
  {
    locateInMenu: 'auto',
    location: 'after',
    widget: 'dxButton',
    showText: 'inMenu',
    options: {
      icon: 'add',
      text: 'Add',
      onClick() {
        DevExpress.ui.notify('Add button has been clicked!');
      },
    },
  },
  {
    locateInMenu: 'auto',
    location: 'after',
    widget: 'dxButton',
    showText: 'inMenu',
    options: {
      icon: 'trash',
      text: 'Remove',
      onClick() {
        DevExpress.ui.notify('Remove button has been clicked!');
      },
    },
  },
  {
    locateInMenu: 'always',
    widget: 'dxButton',
    showText: 'inMenu',
    options: {
      icon: 'help',
      text: 'About',
      onClick() {
        DevExpress.ui.notify('About button has been clicked!');
      },
    },
  },
];

$(() => {
  $('#resizable-container').dxResizable({
    minWidth: 500,
    minHeight: 150,
    maxHeight: 370,
    handles: 'right',
    area: '.widget-container',
  });

  const toolbar = $('#toolbar').dxToolbar({
    dataSource: toolbarItems,
    multiline: true,
  }).dxToolbar('instance');

  $('#toolbar-modes').dxRadioGroup({
    items: [
      {
        text: 'Multiline mode',
        value: true,
      },
      {
        text: 'Singleline mode',
        value: false,
      },
    ],
    value: true,
    layout: 'horizontal',
    valueExpr: 'value',
    onValueChanged(e) {
      toolbar.option('multiline', e.value);
    },
  });
});
