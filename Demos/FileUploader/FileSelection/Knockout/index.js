window.onload = function () {
  const viewModel = {
    firstName: {
      value: 'John',
    },
    lastName: {
      value: 'Smith',
    },
    fileUploaderOptions: {
      selectButtonText: 'Select photo',
      labelText: '',
      accept: 'image/*',
      uploadMode: 'useForm',
    },
    buttonOptions: {
      text: 'Update profile',
      type: 'success',
      onClick() {
        DevExpress.ui.dialog.alert('Uncomment the line to enable sending a form to the server.', 'Click Handler');
        // $("#form").submit();
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('form'));
};
