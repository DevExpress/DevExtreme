$(() => {
  $('#first-name').dxTextBox({
    value: 'John',
    name: 'FirstName',
    inputAttr: { 'aria-label': 'First Name' },
  });

  $('#last-name').dxTextBox({
    value: 'Smith',
    name: 'LastName',
    inputAttr: { 'aria-label': 'Last Name' },
  });

  $('#file-uploader').dxFileUploader({
    selectButtonText: 'Select photo',
    labelText: '',
    accept: 'image/*',
    uploadMode: 'useForm',
    inputAttr: { 'aria-label': 'Select Photo' },
  });

  $('#button').dxButton({
    text: 'Update profile',
    type: 'success',
    onClick() {
      DevExpress.ui.dialog.alert('This demo only illustrates the form upload interface. Uploading to a server is not available.', 'Click Handler');
      // $("#form").submit();
    },
  });
});
