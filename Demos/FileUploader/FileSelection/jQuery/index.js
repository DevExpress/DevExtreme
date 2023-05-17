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
  });

  $('#button').dxButton({
    text: 'Update profile',
    type: 'success',
    onClick() {
      DevExpress.ui.dialog.alert('Uncomment the line to enable sending a form to the server.', 'Click Handler');
      // $("#form").submit();
    },
  });
});
