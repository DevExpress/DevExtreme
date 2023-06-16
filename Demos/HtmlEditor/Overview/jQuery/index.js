$(() => {
  const editor = $('.html-editor').dxHtmlEditor({
    height: 725,
    value: markup,
    imageUpload: {
      tabs: ['file', 'url'],
      fileUploadMode: 'base64',
    },
    toolbar: {
      items: [
        'undo', 'redo', 'separator',
        {
          name: 'size',
          acceptedValues: ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'],
          options: { inputAttr: { 'aria-label': 'Font size' } },
        },
        {
          name: 'font',
          acceptedValues: ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'],
          options: { inputAttr: { 'aria-label': 'Font family' } },
        },
        'separator', 'bold', 'italic', 'strike', 'underline', 'separator',
        'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'separator',
        'orderedList', 'bulletList', 'separator',
        {
          name: 'header',
          acceptedValues: [false, 1, 2, 3, 4, 5],
          options: { inputAttr: { 'aria-label': 'Header' } },
        }, 'separator',
        'color', 'background', 'separator',
        'link', 'image', 'separator',
        'clear', 'codeBlock', 'blockquote', 'separator',
        'insertTable', 'deleteTable',
        'insertRowAbove', 'insertRowBelow', 'deleteRow',
        'insertColumnLeft', 'insertColumnRight', 'deleteColumn',
      ],
    },
    mediaResizing: {
      enabled: true,
    },
  }).dxHtmlEditor('instance');

  $('#multiline').dxCheckBox({
    text: 'Multiline toolbar',
    value: true,
    onValueChanged(e) {
      editor.option('toolbar.multiline', e.value);
    },
  });

  $('#image-uploader-tabs').dxSelectBox({
    items: tabs,
    value: tabs[2].value,
    inputAttr: { 'aria-label': 'Tab' },
    valueExpr: 'value',
    displayExpr: 'name',
    onValueChanged: (e) => {
      editor.option('imageUpload.tabs', e.value);
    },
  });
});
