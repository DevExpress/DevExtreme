const onButtonClick = (name) => {
  DevExpress.ui.notify(`The "${name}" button was clicked`);
};

const onSelectionChanged = (name) => {
  DevExpress.ui.notify(`The "${name}" value was changed`);
};

const onCheckBoxValueChanged = () => {
  DevExpress.ui.notify('The "Navigation Pane" checkbox value was changed');
};

const onDateBoxValueChanged = () => {
  DevExpress.ui.notify('The "DateBox" value was changed');
};

const onFontFamilyClick = () => {
  DevExpress.ui.notify('The "Font Family" value was changed');
};

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
        onButtonClick('Undo');
      },
    },
  },
  {
    location: 'before',
    widget: 'dxButton',
    options: {
      icon: 'redo',
      onClick() {
        onButtonClick('Redo');
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
        onSelectionChanged('Font Size');
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
        onSelectionChanged('Line Height');
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
      onItemClick() {
        onFontFamilyClick();
      },
    },
  },
  toolbarSeparator,
  {
    location: 'before',
    widget: 'dxButtonGroup',
    options: {
      displayExpr: 'text',
      items: fontStyles,
      keyExpr: 'icon',
      stylingMode: 'outlined',
      selectionMode: 'multiple',
      onItemClick(e) {
        onButtonClick(e.itemData.hint);
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
          onButtonClick(e.itemData.hint);
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
          onButtonClick(e.itemData.hint);
        },
      });

      $buttonGroup.appendTo(element);
    },
  },
  {
    location: 'before',
    widget: 'dxButtonGroup',
    options: {
      items: listTypes,
      keyExpr: 'alignment',
      stylingMode: 'outlined',
      onItemClick(e) {
        onButtonClick(e.itemData.hint);
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
      onValueChanged() {
        onDateBoxValueChanged();
      },
    },
  },
  toolbarSeparator,
  {
    locateInMenu: 'auto',
    location: 'before',
    widget: 'dxCheckBox',
    options: {
      value: false,
      text: 'Navigation Pane',
      onOptionChanged() {
        onCheckBoxValueChanged();
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
        onButtonClick('Attach');
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
        onButtonClick('Add');
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
        onButtonClick('Remove');
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
        onButtonClick('About');
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
        text: 'Single-line mode',
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
