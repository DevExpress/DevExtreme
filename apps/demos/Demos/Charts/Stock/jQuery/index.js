$(() => {
  const dayMs = 24 * 60 * 60 * 1000;

  const panStepFraction = 0.25;
  const zoomFactor = 0.75;
  const minVisualRangeLength = { days: 3 };
  const minVisibleSpanMs = minVisualRangeLength.days * dayMs;

  const initialEnd = new Date(1994, 3, 29, 12);

  const data = generateStockData(new Date(1994, 3, 1), 65);
  const dataMin = data[0].date.getTime();
  const dataMax = data[data.length - 1].date.getTime();
  const rangeMin = dataMin - dayMs / 2;
  const rangeMax = dataMax + dayMs / 2;
  const initialStart = new Date(rangeMin);

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
      minVisualRangeLength,
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
      format: { type: 'currency', precision: 2 },
      customizeTooltip({
        openValueText, closeValueText, highValueText, lowValueText,
      }) {
        return {
          text: [
            `Open: ${openValueText}`,
            `Close: ${closeValueText}`,
            `High: ${highValueText}`,
            `Low: ${lowValueText}`,
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
    const span = clamp(end - start, minVisibleSpanMs, rangeMax - rangeMin);
    const center = (start + end) / 2;
    const newStart = clamp(center - span / 2, rangeMin, rangeMax - span);

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
          elementAttr: { 'aria-label': 'Pan Left' },
          onClick: () => pan(-1),
        },
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'chevronright',
          hint: 'Pan Right',
          elementAttr: { 'aria-label': 'Pan Right' },
          onClick: () => pan(1),
        },
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'plus',
          hint: 'Zoom In',
          elementAttr: { 'aria-label': 'Zoom In' },
          onClick: () => zoom(zoomFactor),
        },
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'minus',
          hint: 'Zoom Out',
          elementAttr: { 'aria-label': 'Zoom Out' },
          onClick: () => zoom(1 / zoomFactor),
        },
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          hint: 'Reset Zoom',
          elementAttr: { 'aria-label': 'Reset Zoom' },
          onClick: resetZoom,
        },
      },
    ],
  });
});
