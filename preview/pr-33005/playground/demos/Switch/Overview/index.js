$(() => {
  $('#switch-on').dxSwitch({
    value: true,
  });

  $('#switch-off').dxSwitch({
    value: false,
  });

  $('#handler-switch').dxSwitch({
    onValueChanged(data) {
      disabledSwitch.option('value', data.value);
    },
  });

  const disabledSwitch = $('#disabled').dxSwitch({
    value: false,
    disabled: true,
  }).dxSwitch('instance');
});
