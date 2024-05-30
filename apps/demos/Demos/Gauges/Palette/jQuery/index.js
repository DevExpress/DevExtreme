$(() => {
  $('#gauge').dxBarGauge({
    startValue: -5,
    endValue: 5,
    baseValue: 0,
    values: [-2.13, 1.48, -3.09, 4.52, 4.9, 3.9],
    label: {
      format: "##.## mm;-##.## mm",
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
