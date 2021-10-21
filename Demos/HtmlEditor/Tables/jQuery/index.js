$(() => {
  const editor = $('#html-editor').dxHtmlEditor({
    value: markup,
    height: 750,
    tableContextMenu: { enabled: true },
    tableResizing: { enabled: true },
    toolbar: {
      items: [
        'bold', 'color', 'separator',
        'alignLeft', 'alignCenter', 'alignRight', 'separator',
        'insertTable', 'insertHeaderRow', 'insertRowAbove', 'insertRowBelow',
        'separator', 'insertColumnLeft', 'insertColumnRight',
        'separator', 'deleteColumn', 'deleteRow', 'deleteTable',
        'separator', 'cellProperties', 'tableProperties',
      ],
    },
  }).dxHtmlEditor('instance');

  $('#resizing').dxCheckBox({
    text: 'Allow Table Resizing',
    value: true,
    onValueChanged(e) {
      editor.option('tableResizing.enabled', e.value);
    },
  });

  $('#contextMenu').dxCheckBox({
    text: 'Enable Table Context Menu',
    value: true,
    onValueChanged(e) {
      editor.option('tableContextMenu.enabled', e.value);
    },
  });
});
