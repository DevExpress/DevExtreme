$(() => {
  $('#slider-simple').dxSlider({
    min: 0,
    max: 100,
    value: 90,
  });

  $('#slider-with-label').dxSlider({
    min: 0,
    max: 100,
    value: 50,
    label: {
      visible: true,
      format(value) {
        return `${value}%`;
      },
      position: 'top',
    },
  });

  $('#slider-with-tooltip').dxSlider({
    min: 0,
    max: 100,
    value: 35,
    rtlEnabled: false,
    tooltip: {
      enabled: true,
      format(value) {
        return `${value}%`;
      },
      showMode: 'always',
      position: 'bottom',
    },
  });

  $('#slider-with-hide-range').dxSlider({
    min: 0,
    max: 100,
    value: 20,
    showRange: false,
  });

  $('#slider-with-step').dxSlider({
    min: 0,
    max: 100,
    value: 10,
    step: 10,
    tooltip: {
      enabled: true,
    },
  });

  $('#slider-disabled').dxSlider({
    min: 0,
    max: 100,
    value: 50,
    disabled: true,
  });

  const handlerSlider = $('#handler-slider').dxSlider({
    min: 0,
    max: 100,
    value: 10,
    onValueChanged(data) {
      sliderValue.option('value', data.value);
    },
  }).dxSlider('instance');

  const sliderValue = $('#slider-value').dxNumberBox({
    value: 10,
    min: 0,
    max: 100,
    showSpinButtons: true,
    onValueChanged(data) {
      handlerSlider.option('value', data.value);
    },
  }).dxNumberBox('instance');
});
