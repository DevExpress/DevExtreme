const onButtonClick = (name) => {
  DevExpress.ui.notify(`The "${name}" button has been clicked`);
};

const onSelectionChanged = (name) => {
  DevExpress.ui.notify(`The "${name}" value has been changed`);
};

const onFontFamilyClick = () => {
  DevExpress.ui.notify('The "Font Family" value has been changed');
};

const onHeadingClick = () => {
  DevExpress.ui.notify('The "Heading" value has been changed');
};

const toolbarSeparator = {
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
      inputAttr: { 'aria-label': 'Font' },
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
    widget: 'dxSelectBox',
    options: {
      displayExpr: 'text',
      valueExpr: 'text',
      value: headings[0].text,
      dataSource: headings,
      inputAttr: { 'aria-label': 'Text Style' },
      onItemClick() {
        onHeadingClick();
      },
    },
  },
  toolbarSeparator,
  {
    location: 'before',
    locateInMenu: 'auto',
    widget: 'dxButton',
    showText: 'inMenu',
    options: {
      icon: 'link',
      text: 'Link',
      onClick() {
        onButtonClick('Link');
      },
    },
  },
  {
    location: 'before',
    locateInMenu: 'auto',
    widget: 'dxButton',
    showText: 'inMenu',
    options: {
      icon: 'image',
      text: 'Add image',
      onClick() {
        onButtonClick('Add Image');
      },
    },
  },
  toolbarSeparator,
  {
    location: 'before',
    locateInMenu: 'auto',
    widget: 'dxButton',
    showText: 'inMenu',
    options: {
      icon: 'clearformat',
      text: 'Clear formating',
      onClick() {
        onButtonClick('Clear Formating');
      },
    },
  },
  {
    location: 'before',
    locateInMenu: 'auto',
    widget: 'dxButton',
    showText: 'inMenu',
    options: {
      icon: 'codeblock',
      text: 'Code block',
      onClick() {
        onButtonClick('Code Block');
      },
    },
  },
  {
    location: 'before',
    locateInMenu: 'auto',
    widget: 'dxButton',
    showText: 'inMenu',
    options: {
      icon: 'blockquote',
      text: 'Blockquote',
      onClick() {
        onButtonClick('Blockquote');
      },
    },
  },
  toolbarSeparator,
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

  $('#toolbar-mode').dxCheckBox({
    value: true,
    text: 'Multiline mode',
    onValueChanged(e) {
      toolbar.option('multiline', e.value);
    },
  });
});
