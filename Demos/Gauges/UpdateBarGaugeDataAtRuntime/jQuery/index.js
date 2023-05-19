$(() => {
  function getBasicColors(value) {
    const code = Number(`0x${value.slice(1)}`);

    $('.color-box').css('background-color', value);
    return [
      (code >> 16) & 0xff,
      (code >> 8) & 0xff,
      code & 0xff,
    ];
  }

  const gauge = $('#gauge').dxBarGauge({
    startValue: 0,
    endValue: 255,
    palette: ['#ff0000', '#00ff00', '#0000ff'],
    label: {
      visible: false,
    },
    values: getBasicColors(colors[0].code),
  }).dxBarGauge('instance');

  $('#select-color').dxSelectBox({
    width: 150,
    inputAttr: { 'aria-label': 'Color' },
    dataSource: colors,
    displayExpr: 'name',
    value: colors[0],
    onSelectionChanged(e) {
      gauge.option('values', getBasicColors(e.selectedItem.code));
    },
  });
});
