window.onload = function () {
  const viewModel = {
    gaugeOptions: {
      scale: {
        startValue: 0,
        endValue: 3000,
        tickInterval: 500,
        label: {
          customizeText(arg) {
            return `${arg.valueText} °C`;
          },
        },
      },
      subvalueIndicator: {
        type: 'textcloud',
        text: {
          format: {
            type: 'thousands',
            precision: 1,
          },
          customizeText(arg) {
            return `${arg.valueText} °C`;
          },
        },
      },
      export: {
        enabled: true,
      },
      title: {
        text: 'Oven Temperature (includes Recommended)',
        font: { size: 28 },
      },
      value: 2200,
      subvalues: [2700],
    },
  };

  ko.applyBindings(viewModel, document.getElementById('gauge-demo'));
};
