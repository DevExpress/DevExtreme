$(() => {
  $('#range-selector').dxRangeSelector({
    margin: {
      top: 50,
    },
    scale: {
      minorTickInterval: 0.001,
      tickInterval: 0.005,
      startValue: 0.004563,
      endValue: 0.04976,
      label: {
        format: {
          type: 'fixedPoint',
          precision: 3,
        },
      },
    },
    sliderMarker: {
      format: {
        type: 'fixedPoint',
        precision: 4,
      },
      customizeText() {
        return `${this.valueText} mg/L`;
      },
    },
    behavior: {
      snapToTicks: false,
    },
    title: 'Select a Lead Concentration in Water',
  });
});
