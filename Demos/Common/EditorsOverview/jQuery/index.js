$(() => {
  $('#text-box').dxTextBox({
    value: 'UI Superhero',
    valueChangeEvent: 'keyup',
    inputAttr: { 'aria-label': 'Type' },
    maxLength: 40,
    onValueChanged(e) {
      $('.text').text(e.value);
    },
  });

  $('#color-box').dxColorBox({
    value: '#f05b41',
    applyValueMode: 'instantly',
    onValueChanged(e) {
      $('.color').css('fill', e.value);
      $('.text').css('color', e.value);
      $('.picture-container').css('outline-color', e.value);
    },
  });

  const widthInstance = $('#number-box-width').dxNumberBox({
    showSpinButtons: true,
    value: 370,
    max: 700,
    min: 70,
    format: '#0px',
    inputAttr: { 'aria-label': 'Width' },
    onValueChanged(e) {
      const width = e.value;
      $('svg').width(width);
      heightInstance.option('value', (width * 26) / 37);
    },
  }).dxNumberBox('instance');

  const heightInstance = $('#number-box-height').dxNumberBox({
    showSpinButtons: true,
    value: 260,
    max: 700,
    min: 70,
    format: '#0px',
    inputAttr: { 'aria-label': 'Height' },
    onValueChanged(e) {
      const height = e.value;
      $('svg').height(height);
      widthInstance.option('value', (height * 37) / 26);
    },
  }).dxNumberBox('instance');

  $('#select-box').dxSelectBox({
    items: [
      {
        key: 'Flip',
        items: [
          { name: '0 degrees', value: 'scaleX(1)' },
          { name: '180 degrees', value: 'scaleX(-1)' },
        ],
      },
      {
        key: 'Rotate',
        items: [
          { name: '0 degrees', value: 'rotate(0)' },
          { name: '15 degrees', value: 'rotate(15deg)' },
          { name: '30 degrees', value: 'rotate(30deg)' },
          { name: '-15 degrees', value: 'rotate(-15deg)' },
          { name: '-30 degrees', value: 'rotate(-30deg)' },
        ],
      },
    ],
    valueExpr: 'value',
    displayExpr: 'name',
    grouped: true,
    value: 'scaleX(1)',
    onValueChanged(e) {
      $('.picture').css('transform', e.value);
    },
  });

  $('#switch').dxSwitch({
    value: false,
    onValueChanged(e) {
      $('.picture-container').css('outline-style', e.value ? 'solid' : 'none');
    },
  });
});
