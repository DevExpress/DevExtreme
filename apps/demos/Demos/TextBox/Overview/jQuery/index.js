$(() => {
  $('#simple').dxTextBox({
    value: 'John Smith',
    inputAttr: { 'aria-label': 'Name' },
  });

  $('#placeholder').dxTextBox({
    placeholder: 'Enter full name here...',
    inputAttr: { 'aria-label': 'Full Name' },
  });

  $('#clear-button').dxTextBox({
    value: 'John Smith',
    showClearButton: true,
    inputAttr: { 'aria-label': 'Full Name' },
  });

  $('#password').dxTextBox({
    mode: 'password',
    placeholder: 'Enter password',
    showClearButton: true,
    value: 'f5lzKs0T',
    inputAttr: { 'aria-label': 'Password' },
  });

  $('#mask').dxTextBox({
    mask: '+1 (X00) 000-0000',
    maskRules: { X: /[02-9]/ },
    inputAttr: { 'aria-label': 'Mask' },
  });

  $('#disabled').dxTextBox({
    value: 'John Smith',
    disabled: true,
    inputAttr: { 'aria-label': 'Full Name' },
  });

  $('#full-name').dxTextBox({
    value: 'Smith',
    showClearButton: true,
    placeholder: 'Enter full name',
    inputAttr: { 'aria-label': 'Full Name' },
    valueChangeEvent: 'keyup',
    onValueChanged(data) {
      emailEditor.option('value', `${data.value.replace(/\s/g, '').toLowerCase()}@corp.com`);
    },
  });

  const emailEditor = $('#email').dxTextBox({
    value: 'smith@corp.com',
    readOnly: true,
    inputAttr: { 'aria-label': 'Email' },
    hoverStateEnabled: false,
  }).dxTextBox('instance');
});
