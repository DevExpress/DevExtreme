$(() => {
  $('#gauge').dxBarGauge({
    startValue: -50,
    endValue: 50,
    baseValue: 0,
    values: [-21.3, 14.8, -30.9, 45.2],
    label: {
      customizeText(arg) {
        return `${arg.valueText} mm`;
      },
    },
    export: {
      enabled: true,
    },
    palette: 'ocean',
    title: {
      text: 'Deviations in the Manufactured Parts',
      font: {
        size: 28,
      },
    },
  });
});
