$(() => {
  $('#range-slider-simple').dxRangeSlider({
    min: 0,
    max: 100,
    start: 20,
    end: 60,
  });

  $('#range-slider-with-label').dxRangeSlider({
    min: 0,
    max: 100,
    start: 35,
    end: 65,
    label: {
      visible: true,
      format(value) {
        return `${value}%`;
      },
      position: 'top',
    },
  });

  $('#range-slider-with-tooltip').dxRangeSlider({
    min: 0,
    max: 100,
    start: 15,
    end: 65,
    tooltip: {
      enabled: true,
      format(value) {
        return `${value}%`;
      },
      showMode: 'always',
      position: 'bottom',
    },
  });

  $('#range-slider-with-hide-range').dxRangeSlider({
    min: 0,
    max: 100,
    start: 20,
    end: 80,
    showRange: false,
  });

  $('#range-slider-with-step').dxRangeSlider({
    min: 0,
    max: 100,
    start: 20,
    end: 70,
    step: 10,
    tooltip: {
      enabled: true,
    },
  });

  $('#range-slider-disabled').dxRangeSlider({
    min: 0,
    max: 100,
    start: 25,
    end: 75,
    disabled: true,
  });

  const onHandleMoveRangeSlider = $('#slider-on-handle-move').dxRangeSlider({
    min: 0,
    max: 100,
    start: 10,
    end: 90,
    onValueChanged({ value, start, end }) {
      onHandleReleaseRangeSlider.option('value', value);
      startValue.option('value', start);
      endValue.option('value', end);
    },
  }).dxRangeSlider('instance');

  const onHandleReleaseRangeSlider = $('#slider-on-handle-release').dxRangeSlider({
    min: 0,
    max: 100,
    start: 10,
    end: 90,
    valueChangeMode: 'onHandleRelease',
    onValueChanged({ value, start, end }) {
      onHandleMoveRangeSlider.option('value', value);
      startValue.option('value', start);
      endValue.option('value', end);
    },
  }).dxRangeSlider('instance');

  const startValue = $('#start-value').dxNumberBox({
    value: 10,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Start Value' },
    onValueChanged({ value }) {
      onHandleMoveRangeSlider.option('start', value);
      onHandleReleaseRangeSlider.option('start', value);
    },
  }).dxNumberBox('instance');

  const endValue = $('#end-value').dxNumberBox({
    value: 90,
    min: 0,
    max: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'End Value' },
    onValueChanged({ value }) {
      onHandleMoveRangeSlider.option('end', value);
      onHandleReleaseRangeSlider.option('end', value);
    },
  }).dxNumberBox('instance');
});
