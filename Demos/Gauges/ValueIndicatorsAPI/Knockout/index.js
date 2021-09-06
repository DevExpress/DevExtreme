window.onload = function () {
  const mainGenerator = ko.observable(34);
  const subvalueOne = ko.observable(12);
  const subvalueTwo = ko.observable(23);
  const value = ko.observable(34);
  const subvalues = ko.observable([12, 23]);

  const viewModel = {
    gaugeOptions: {
      scale: {
        startValue: 10,
        endValue: 40,
        tickInterval: 5,
        label: {
          customizeText(arg) {
            return `${arg.valueText} kV`;
          },
        },
      },
      tooltip: { enabled: true },
      title: {
        text: 'Generators Voltage (kV)',
        font: { size: 28 },
      },
      subvalues,
      value,
    },
    mainGeneratorOptions: {
      value: mainGenerator,
      min: 10,
      max: 40,
      width: 100,
      showSpinButtons: true,
    },
    additionalGeneratorOne: {
      value: subvalueOne,
      min: 10,
      max: 40,
      width: 100,
      showSpinButtons: true,
    },
    additionalGeneratorTwo: {
      value: subvalueTwo,
      min: 10,
      max: 40,
      width: 100,
      showSpinButtons: true,
    },
    editButton: {
      text: 'Apply',
      width: 100,
      onClick() {
        value(mainGenerator());
        subvalues([subvalueOne(), subvalueTwo()]);
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('gauge-demo'));
};
