window.onload = function () {
  const emailValue = ko.observable('smith@corp.com');

  const viewModel = {
    simple: {
      value: 'John Smith',
    },
    withPlaceholder: {
      placeholder: 'Enter full name here...',
    },
    withClearButton: {
      value: 'John Smith',
      showClearButton: true,
    },
    passwordMode: {
      mode: 'password',
      placeholder: 'Enter password',
      showClearButton: true,
      value: 'f5lzKs0T',
    },
    maskUsage: {
      mask: '+1 (X00) 000-0000',
      maskRules: { X: /[02-9]/ },
    },
    disabled: {
      value: 'John Smith',
      disabled: true,
    },
    fullNameOptions: {
      value: 'Smith',
      showClearButton: true,
      placeholder: 'Enter full name',
      valueChangeEvent: 'keyup',
      onValueChanged(data) {
        emailValue(`${data.value.replace(/\s/g, '').toLowerCase()}@corp.com`);
      },
    },
    emailOptions: {
      value: emailValue,
      readOnly: true,
      hoverStateEnabled: false,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('text-box-demo'));
};
