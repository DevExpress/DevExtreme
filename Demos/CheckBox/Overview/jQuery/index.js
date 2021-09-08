$(() => {
  $('#checked').dxCheckBox({
    value: true,
  });

  $('#unchecked').dxCheckBox({
    value: false,
  });

  $('#indeterminate').dxCheckBox({
    value: undefined,
  });

  $('#handler').dxCheckBox({
    value: undefined,
    onValueChanged(data) {
      disabledCheckbox.option('value', data.value);
    },
  });

  const disabledCheckbox = $('#disabled').dxCheckBox({
    value: undefined,
    disabled: true,
  }).dxCheckBox('instance');

  $('#withText').dxCheckBox({
    value: true,
    width: 80,
    text: 'Check',
  });
});
