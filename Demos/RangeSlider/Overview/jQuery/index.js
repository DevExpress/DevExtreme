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

  const handleOnMovingSlider = $('#slider-on-moving').dxRangeSlider({
    min: 0,
    max: 100,
    start: 10,
    end: 90,
    onValueChanged({ value, start, end }) {
      handleOnMovingCompleteSlider.option('value', value);
      startValue.option('value', start);
      endValue.option('value', end);
    },
  }).dxRangeSlider('instance');

  const handleOnMovingCompleteSlider = $('#slider-on-moving-complete').dxRangeSlider({
    min: 0,
    max: 100,
    start: 10,
    end: 90,
    callValueChange: 'onMovingComplete',
    onValueChanged({ value, start, end }) {
      handleOnMovingSlider.option('value', value);
      startValue.option('value', start);
      endValue.option('value', end);
    },
  }).dxRangeSlider('instance');

  const startValue = $('#start-value').dxNumberBox({
    value: 10,
    min: 0,
    max: 100,
    showSpinButtons: true,
    onValueChanged({ value }) {
      handleOnMovingSlider.option('start', value);
      handleOnMovingCompleteSlider.option('start', value);
    },
  }).dxNumberBox('instance');

  const endValue = $('#end-value').dxNumberBox({
    value: 90,
    min: 0,
    max: 100,
    showSpinButtons: true,
    onValueChanged({ value }) {
      handleOnMovingSlider.option('end', value);
      handleOnMovingCompleteSlider.option('end', value);
    },
  }).dxNumberBox('instance');
});
