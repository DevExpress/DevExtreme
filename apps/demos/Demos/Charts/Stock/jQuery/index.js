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
    dataSource: data,
    resizePanesOnZoom: true,
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
        overlappingBehavior: 'rotate',
        rotationAngle: 30,
        customizeText({ value }) {
          const isMidnight = value.getHours() === 0 && value.getMinutes() === 0;
          return DevExpress.localization.formatDate(value, isMidnight ? 'MMM dd' : 'shortTime');
        },
      },
    },
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

  const exportItems = [
    { text: 'Print' },
    ...['PNG', 'PDF', 'JPEG', 'GIF', 'SVG'].map((format) => ({
      text: `${format} file`,
      format,
    })),
  ];

  $('#toolbar').dxToolbar({
    items: [
      {
        location: 'before',
        text: 'Stock Price',
        cssClass: 'chart-title',
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'arrowleft',
          hint: 'Pan Left',
          elementAttr: { 'aria-label': 'Pan Left' },
          onClick: () => pan(-1),
        },
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'arrowright',
          hint: 'Pan Right',
          elementAttr: { 'aria-label': 'Pan Right' },
          onClick: () => pan(1),
        },
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'zoomoutoutline',
          hint: 'Zoom Out',
          elementAttr: { 'aria-label': 'Zoom Out' },
          onClick: () => zoom(1 / zoomFactor),
        },
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'zoominoutline',
          hint: 'Zoom In',
          elementAttr: { 'aria-label': 'Zoom In' },
          onClick: () => zoom(zoomFactor),
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
      {
        location: 'after',
        widget: 'dxDropDownButton',
        options: {
          icon: 'export',
          hint: 'Exporting/Printing',
          elementAttr: { 'aria-label': 'Exporting/Printing' },
          stylingMode: 'text',
          useSelectMode: false,
          dropDownOptions: { width: 100 },
          displayExpr: 'text',
          items: exportItems,
          onItemClick: ({ itemData }) => {
            if (itemData.format) {
              chart.exportTo('file', itemData.format);
            } else {
              chart.print();
            }
          },
        },
      },
    ],
  });
});
