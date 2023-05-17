$(() => {
  const stylingMode = readStylingMode() || 'filled';
  DevExpress.config({
    editorStylingMode: stylingMode,
  });

  const name = $('#name').dxTextBox({
    value: 'Olivia Peyton',
    width: '100%',
    placeholder: 'Type...',
    inputAttr: { 'aria-label': 'Name' },
    label: 'Name',
  }).dxValidator({
    validationRules: [{
      type: 'required',
    }],
  }).dxTextBox('instance');

  const place = $('#address').dxTextBox({
    width: '100%',
    placeholder: 'Type...',
    inputAttr: { 'aria-label': 'Address' },
    label: 'Address',
  }).dxValidator({
    validationRules: [{
      type: 'required',
    }],
  }).dxTextBox('instance');

  const birthDate = $('#birthDate').dxDateBox({
    width: '100%',
    label: 'Birth Date',
    placeholder: 'Select...',
    value: '6/3/1981',
    inputAttr: { 'aria-label': 'Birth Date' },
  }).dxValidator({
    validationRules: [{
      type: 'required',
    }],
  }).dxDateBox('instance');

  const hireDate = $('#hireDate').dxDateBox({
    width: '100%',
    label: 'Hire Date',
    placeholder: 'Select...',
    inputAttr: { 'aria-label': 'Hire Date' },
  }).dxValidator({
    validationRules: [{
      type: 'required',
    }],
  }).dxDateBox('instance');

  const state = $('#state').dxSelectBox({
    items: states,
    width: '100%',
    placeholder: 'Select...',
    label: 'State',
  }).dxValidator({
    validationRules: [{
      type: 'required',
    }],
  }).dxSelectBox('instance');

  const position = $('#position').dxTagBox({
    items: positions,
    value: ['Support Manager'],
    placeholder: 'Select...',
    multiline: false,
    width: '100%',
    inputAttr: { 'aria-label': 'Position' },
    label: 'Position',
  }).dxValidator({
    validationRules: [{
      type: 'required',
    }],
  }).dxTagBox('instance');

  const phone = $('#phone').dxTextBox({
    width: '100%',
    label: 'Phone',
    mask: '+1 (000) 000-0000',
    inputAttr: { 'aria-label': 'Phone' },
    maskRules: {
      X: /[02-9]/,
    },
  }).dxValidator({
    validationRules: [{
      type: 'required',
    }],
  }).dxTextBox('instance');

  const notes = $('#notes').dxTextArea({
    value: 'Olivia loves to sell. She has been selling DevAV products since 2012.',
    width: '100%',
    placeholder: 'Type...',
    label: 'Notes',
    inputAttr: { 'aria-label': 'Notes' },
  }).dxTextArea('instance');

  $('#validate').dxButton({
    text: 'Save',
    type: 'default',
    onClick(e) {
      const result = e.validationGroup.validate();
      if (result.isValid) {
        DevExpress.ui.notify('The task was saved successfully.', 'success');
      } else {
        DevExpress.ui.notify('The task was not saved. Please check if all fields are valid.', 'error');
      }
    },
  });

  $('#modeSelector').dxSelectBox({
    items: ['outlined', 'filled', 'underlined'],
    value: stylingMode,
    onValueChanged(e) {
      writeStylingMode(e.value);
    },
  });

  $('#labelModeSelector').dxSelectBox({
    items: ['static', 'floating', 'hidden'],
    value: 'static',
    onValueChanged(e) {
      [name, place, birthDate, position, hireDate, state, phone, notes].forEach((editor) => {
        editor.option('labelMode', e.value);
      });
    },
  });
});

const storageKey = 'editorStylingMode';
function readStylingMode() {
  const mode = localStorage.getItem(storageKey);
  localStorage.removeItem(storageKey);
  return mode;
}

function writeStylingMode(mode) {
  localStorage.setItem(storageKey, mode);
  window.location.reload(true);
}
