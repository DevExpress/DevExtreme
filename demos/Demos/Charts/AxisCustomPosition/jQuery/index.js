$(() => {
  const chart = $('#chart').dxChart({
    dataSource: generateDataSource(),
    commonSeriesSettings: {
      type: 'scatter',
    },
    series: [{
      argumentField: 'x1',
      valueField: 'y1',
    }, {
      argumentField: 'x2',
      valueField: 'y2',
      point: {
        symbol: 'triangleDown',
      },
    }],
    argumentAxis: {
      customPosition: 0,
      visualRange: [-20, 20],
      offset: 0,
    },
    valueAxis: {
      customPosition: 0,
      endOnTick: false,
      visualRange: [-20, 20],
      offset: 0,
    },
    legend: {
      visible: false,
    },
  }).dxChart('instance');
  $('#argumentCustomPosition').dxNumberBox({
    value: 0,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Argument Custom Position' },
    onValueChanged(e) {
      chart.option('argumentAxis.customPosition', e.value);
    },
  });
  $('#argumentOffset').dxNumberBox({
    value: 0,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Argument Offset' },
    onValueChanged(e) {
      chart.option('argumentAxis.offset', e.value);
    },
  });
  $('#valueCustomPosition').dxNumberBox({
    value: 0,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Value Custom Position' },
    onValueChanged(e) {
      chart.option('valueAxis.customPosition', e.value);
    },
  });
  $('#valueOffset').dxNumberBox({
    value: 0,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Value Offset' },
    onValueChanged(e) {
      chart.option('valueAxis.offset', e.value);
    },
  });
});
