$(() => {
  $('#checked').dxCheckBox({
    value: true,
    elementAttr: {
      'aria-label': 'Checked',
    },
  });

  $('#unchecked').dxCheckBox({
    value: false,
    elementAttr: {
      'aria-label': 'Unchecked',
    },
  });

  $('#indeterminate').dxCheckBox({
    value: null,
    elementAttr: {
      'aria-label': 'Indeterminate',
    },
  });

  $('#threeStateMode').dxCheckBox({
    enableThreeStateBehavior: true,
    value: null,
    elementAttr: {
      'aria-label': 'Three state mode',
    },
  });

  $('#handler').dxCheckBox({
    value: null,
    elementAttr: {
      'aria-label': 'Handle value change',
    },
    onValueChanged(data) {
      disabledCheckbox.option('value', data.value);
    },
  });

  const disabledCheckbox = $('#disabled').dxCheckBox({
    value: null,
    disabled: true,
    elementAttr: {
      'aria-label': 'Disabled',
    },
  }).dxCheckBox('instance');

  $('#customSize').dxCheckBox({
    value: null,
    iconSize: 30,
    elementAttr: {
      'aria-label': 'Custom size',
    },
  });

  $('#withText').dxCheckBox({
    value: true,
    text: 'Label',
  });
});
