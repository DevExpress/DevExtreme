$(() => {
  const dayMs = 24 * 60 * 60 * 1000;

  const panStepFraction = 0.25;
  const zoomFactor = 0.75;
  const minVisibleSpanMs = 3 * dayMs;

  const initialStart = new Date(1994, 3, 15);
  const initialEnd = new Date(1994, 3, 29);

  const data = generateStockData(new Date(1994, 3, 1), 65);
  const dataMin = data[0].date.getTime();
  const dataMax = data[data.length - 1].date.getTime();

  const chart = $('#chart').dxChart({
    title: 'Stock Price',
    dataSource: data,
    commonSeriesSettings: { argumentField: 'date', type: 'stock' },
    series: [{
      name: 'E-Mart',
      openValueField: 'o',
      highValueField: 'h',
      lowValueField: 'l',
      closeValueField: 'c',
      reduction: { color: 'red' },
    }],
    zoomAndPan: {
      argumentAxis: 'both',
      dragToZoom: true,
      allowMouseWheel: true,
    },
    scrollBar: { visible: true, position: 'bottom' },
    legend: { verticalAlignment: 'bottom', horizontalAlignment: 'center' },
    valueAxis: {
      position: 'right',
      tickInterval: 1,
      title: { text: 'US dollars' },
      label: { format: { type: 'currency', precision: 0 } },
    },
    argumentAxis: {
      workdaysOnly: false,
      visualRange: { startValue: initialStart, endValue: initialEnd },
      label: {
        format: 'MMM dd',
        overlappingBehavior: 'rotate',
        rotationAngle: 30,
      },
    },
    export: { enabled: true },
    tooltip: {
      enabled: true,
      location: 'edge',
      customizeTooltip({
        openValue, closeValue, highValue, lowValue,
      }) {
        return {
          text: [
            `Open: $${openValue}`,
            `Close: $${closeValue}`,
            `High: $${highValue}`,
            `Low: $${lowValue}`,
          ].join('<br/>'),
        };
      },
    },
  }).dxChart('instance');

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getRange() {
    const { startValue, endValue } = chart.getArgumentAxis().visualRange();
    return { start: startValue.getTime(), end: endValue.getTime() };
  }

  function setRange(start, end) {
    const span = clamp(end - start, minVisibleSpanMs, dataMax - dataMin);
    const center = (start + end) / 2;
    const newStart = clamp(center - span / 2, dataMin, dataMax - span);

    chart.getArgumentAxis().visualRange({
      startValue: new Date(newStart),
      endValue: new Date(newStart + span),
    });
  }

  function pan(direction) {
    const { start, end } = getRange();
    const shift = (end - start) * panStepFraction * direction;
    setRange(start + shift, end + shift);
  }

  function zoom(factor) {
    const { start, end } = getRange();
    const center = (start + end) / 2;
    const half = ((end - start) * factor) / 2;
    setRange(center - half, center + half);
  }

  function resetZoom() {
    setRange(initialStart.getTime(), initialEnd.getTime());
  }

  $('#toolbar').dxToolbar({
    items: [
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'chevronleft',
          hint: 'Pan Left',
          onClick: () => pan(-1),
        },
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'chevronright',
          hint: 'Pan Right',
          onClick: () => pan(1),
        },
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'plus',
          hint: 'Zoom In',
          onClick: () => zoom(zoomFactor),
        },
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'minus',
          hint: 'Zoom Out',
          onClick: () => zoom(1 / zoomFactor),
        },
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          hint: 'Reset Zoom',
          onClick: resetZoom,
        },
      },
    ],
  });
});
