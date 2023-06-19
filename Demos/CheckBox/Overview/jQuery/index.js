$(() => {
  $('#checked').dxCheckBox({
    value: true,
  });

  $('#unchecked').dxCheckBox({
    value: false,
  });

  $('#indeterminate').dxCheckBox({
    value: null,
  });

  $('#threeStateMode').dxCheckBox({
    enableThreeStateBehavior: true,
    value: null,
  });

  $('#handler').dxCheckBox({
    value: null,
    onValueChanged(data) {
      disabledCheckbox.option('value', data.value);
    },
  });

  const disabledCheckbox = $('#disabled').dxCheckBox({
    value: null,
    disabled: true,
  }).dxCheckBox('instance');

  $('#customSize').dxCheckBox({
    value: null,
    iconSize: 30,
  });

  $('#withText').dxCheckBox({
    value: true,
    text: 'Label',
  });
});
