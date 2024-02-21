$(() => {
  $('#range-selector').dxRangeSelector({
    margin: {
      left: 15,
      right: 15,
      top: 50,
    },
    scale: {
      minorTickInterval: 0.5,
      tickInterval: 1,
      label: {
        customizeText() {
          return `${this.valueText} s`;
        },
      },
    },
    sliderMarker: {
      visible: false,
    },
    background: {
      color: '#808080',
    },
    dataSource: [{ x: 0, y: 15 },
      { x: 1, y: -1 },
      { x: 2, y: 10 },
      { x: 3, y: -3 },
      { x: 4, y: 16 },
      { x: 5, y: 0 },
      { x: 6, y: 9 },
      { x: 7, y: 3 },
      { x: 8, y: 15 },
      { x: 9, y: -1 },
      { x: 10, y: 10 },
      { x: 11, y: -3 },
      { x: 12, y: 16 },
      { x: 13, y: 0 },
      { x: 14, y: 9 },
      { x: 15, y: 3 },
      { x: 16, y: 13 }],
    chart: {
      series: {
        color: '#ffa500',
        width: 3,
        type: 'line',
        argumentField: 'x',
        valueField: 'y',
      },
      topIndent: 0.05,
      bottomIndent: 0.05,
    },
    value: [0, 5],
    title: 'Select a Range in the CPU Usage History',
  });
});
