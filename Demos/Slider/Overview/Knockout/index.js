window.onload = function () {
  const value = ko.observable(10);

  const viewModel = {
    sliderSimple: {
      min: 0,
      max: 100,
      value: 90,
    },
    sliderWithLabel: {
      min: 0,
      max: 100,
      value: 50,
      label: {
        visible: true,
        format(v) {
          return `${v}%`;
        },
        position: 'top',
      },
    },
    sliderWithTooltip: {
      min: 0,
      max: 100,
      value: 35,
      rtlEnabled: false,
      tooltip: {
        enabled: true,
        format(v) {
          return `${v}%`;
        },
        showMode: 'always',
        position: 'bottom',
      },
    },
    sliderWithHideRange: {
      min: 0,
      max: 100,
      value: 20,
      showRange: false,
    },
    sliderWithStep: {
      min: 0,
      max: 100,
      value: 10,
      step: 10,
      tooltip: {
        enabled: true,
      },
    },
    sliderDisabled: {
      min: 0,
      max: 100,
      value: 50,
      disabled: true,
    },
    eventHandlingOptions: {
      min: 0,
      max: 100,
      value,
    },
    sliderValueOptions: {
      value,
      min: 0,
      max: 100,
      showSpinButtons: true,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('slider-demo'));
};
