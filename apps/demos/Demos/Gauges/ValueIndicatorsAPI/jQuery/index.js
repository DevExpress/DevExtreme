$(() => {
  const gauge = $('#gauge').dxCircularGauge({
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
    value: 34,
    subvalues: [12, 23],
  }).dxCircularGauge('instance');

  const mainGenerator = $('#main-generator').dxNumberBox({
    value: 34,
    min: 10,
    max: 40,
    width: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Main Generator' },
  }).dxNumberBox('instance');

  const additionalGeneratorOne = $('#additional-generator-one').dxNumberBox({
    value: 12,
    min: 10,
    max: 40,
    width: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Additional Generator One' },
  }).dxNumberBox('instance');

  const additionalGeneratorTwo = $('#additional-generator-two').dxNumberBox({
    value: 23,
    min: 10,
    max: 40,
    width: 100,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Additional Generator Two' },
  }).dxNumberBox('instance');

  $('#edit').dxButton({
    text: 'Apply',
    width: 100,
    onClick() {
      gauge.value(mainGenerator.option('value'));
      gauge.subvalues([additionalGeneratorOne.option('value'), additionalGeneratorTwo.option('value')]);
    },
  });
});
