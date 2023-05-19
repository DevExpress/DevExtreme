$(() => {
  const fileUploader = $('#file-uploader').dxFileUploader({
    multiple: false,
    accept: '*',
    value: [],
    uploadMode: 'instantly',
    uploadUrl: 'https://js.devexpress.com/Demos/NetCore/FileUploader/Upload',
    onValueChanged(e) {
      const files = e.value;
      if (files.length > 0) {
        $('#selected-files .selected-item').remove();
        $.each(files, (i, file) => {
          const $selectedItem = $('<div />').addClass('selected-item');
          $selectedItem.append(
            $('<span />').html(`Name: ${file.name}<br/>`),
            $('<span />').html(`Size ${file.size} bytes<br/>`),
            $('<span />').html(`Type ${file.type}<br/>`),
            $('<span />').html(`Last Modified Date: ${file.lastModifiedDate}`),
          );
          $selectedItem.appendTo($('#selected-files'));
        });
        $('#selected-files').show();
      } else { $('#selected-files').hide(); }
    },
  }).dxFileUploader('instance');

  $('#accept-option').dxSelectBox({
    inputAttr: { 'aria-label': 'Accept Option' },
    dataSource: [
      { name: 'All types', value: '*' },
      { name: 'Images', value: 'image/*' },
      { name: 'Videos', value: 'video/*' },
    ],
    valueExpr: 'value',
    displayExpr: 'name',
    value: '*',
    onValueChanged(e) {
      fileUploader.option('accept', e.value);
    },
  });

  $('#upload-option').dxSelectBox({
    items: ['instantly', 'useButtons'],
    value: 'instantly',
    inputAttr: { 'aria-label': 'Upload Option' },
    onValueChanged(e) {
      fileUploader.option('uploadMode', e.value);
    },
  });

  $('#multiple-option').dxCheckBox({
    value: false,
    text: 'Allow multiple files selection',
    onValueChanged(e) {
      fileUploader.option('multiple', e.value);
    },
  });
});
