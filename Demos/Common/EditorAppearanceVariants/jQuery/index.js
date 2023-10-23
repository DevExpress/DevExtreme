$(() => {
  const stylingMode = 'outlined';
  const labelMode = 'static';
  DevExpress.config({
    editorStylingMode: stylingMode,
  });

  const name = $('#name').dxTextBox({
    value: 'Olivia Peyton',
    placeholder: 'Type...',
    inputAttr: { 'aria-label': 'Name' },
    label: 'Name',
    labelMode,
  }).dxValidator({
    validationRules: [{
      type: 'required',
    }],
  }).dxTextBox('instance');

  const place = $('#address').dxTextBox({
    placeholder: 'Type...',
    inputAttr: { 'aria-label': 'Address' },
    label: 'Address',
    labelMode,
  }).dxValidator({
    validationRules: [{
      type: 'required',
    }],
  }).dxTextBox('instance');

  const birthDate = $('#birth-date').dxDateBox({
    label: 'Birth Date',
    placeholder: 'Select...',
    value: '6/3/1981',
    inputAttr: { 'aria-label': 'Birth Date' },
    labelMode,
  }).dxValidator({
    validationRules: [{
      type: 'required',
    }],
  }).dxDateBox('instance');

  const hireDate = $('#hire-date').dxDateBox({
    label: 'Hire Date',
    placeholder: 'Select...',
    inputAttr: { 'aria-label': 'Hire Date' },
    labelMode,
  }).dxValidator({
    validationRules: [{
      type: 'required',
    }],
  }).dxDateBox('instance');

  const range = $('#vacation-dates').dxDateRangeBox({
    startDate: '6/3/2023',
    startDateLabel: 'Start Vacation Date',
    endDate: '12/3/2023',
    endDateLabel: 'End Vacation Date',
    labelMode,
  }).dxDateRangeBox('instance');

  const state = $('#state').dxSelectBox({
    items: states,
    inputAttr: { 'aria-label': 'State' },
    placeholder: 'Select...',
    label: 'State',
    labelMode,
  }).dxValidator({
    validationRules: [{
      type: 'required',
    }],
  }).dxSelectBox('instance');

  const phone = $('#phone').dxTextBox({
    label: 'Phone',
    mask: '+1 (000) 000-0000',
    inputAttr: { 'aria-label': 'Phone' },
    maskRules: {
      X: /[02-9]/,
    },
    labelMode,
  }).dxValidator({
    validationRules: [{
      type: 'required',
    }],
  }).dxTextBox('instance');

  const notes = $('#notes').dxTextArea({
    value: 'Olivia loves to sell. She has been selling DevAV products since 2012.',
    placeholder: 'Type...',
    label: 'Notes',
    labelMode,
    inputAttr: { 'aria-label': 'Notes' },
  }).dxTextArea('instance');

  $('#validate').dxButton({
    text: 'Save',
    icon: 'save',
    type: 'default',
    onClick({ validationGroup }) {
      const result = validationGroup.validate();
      if (result.isValid) {
        DevExpress.ui.notify('The task was saved successfully.', 'success');
      } else {
        DevExpress.ui.notify('The task was not saved. Please check if all fields are valid.', 'error');
      }
    },
  });

  const getValueChangedHandler = (optionName) => ({ value }) => {
    [name, place, birthDate, hireDate, range, state, phone, notes].forEach((editor) => {
      editor.option(optionName, value);
    });
  };

  $('#styling-mode-selector').dxSelectBox({
    items: ['outlined', 'filled', 'underlined'],
    value: 'outlined',
    label: 'Styling Mode',
    labelMode: 'outside',
    inputAttr: { 'aria-label': 'Styling Mode' },
    onValueChanged: getValueChangedHandler('stylingMode'),
  }).dxSelectBox('instance');

  $('#label-mode-selector').dxSelectBox({
    items: ['static', 'floating', 'hidden', 'outside'],
    value: 'static',
    label: 'Label Mode',
    labelMode: 'outside',
    inputAttr: { 'aria-label': 'Label Mode' },
    onValueChanged: getValueChangedHandler('labelMode'),
  }).dxSelectBox('instance');
});
