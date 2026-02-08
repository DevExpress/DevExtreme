$(() => {
  const gauge = $('#gauge').dxCircularGauge({
    scale: {
      startValue: 10,
      endValue: 40,
      tickInterval: 5,
      label: {
        customizeText(arg) {
          return `${arg.valueText} °C`;
        },
      },
    },
    rangeContainer: {
      ranges: [
        { startValue: 10, endValue: 20, color: '#0077BE' },
        { startValue: 20, endValue: 30, color: '#E6E200' },
        { startValue: 30, endValue: 40, color: '#77DD77' },
      ],
    },
    tooltip: { enabled: true },
    title: {
      text: 'Temperature in the Greenhouse',
      font: { size: 28 },
    },
    value: dataSource[0].mean,
    subvalues: [dataSource[0].min, dataSource[0].max],
  }).dxCircularGauge('instance');

  $('#seasons').dxSelectBox({
    width: 150,
    dataSource,
    inputAttr: { 'aria-label': 'Season' },
    displayExpr: 'name',
    value: dataSource[0],
    onSelectionChanged(e) {
      gauge.option('value', e.selectedItem.mean);
      gauge.option('subvalues', [e.selectedItem.min, e.selectedItem.max]);
    },
  });
});
