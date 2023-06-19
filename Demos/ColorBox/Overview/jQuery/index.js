$(() => {
  $('#color-box-simple').dxColorBox({
    value: '#f05b41',
  });

  $('#color-box-edit-alpha-channel').dxColorBox({
    value: '#f05b41',
    editAlphaChannel: true,
  });

  $('#color-box-edit-button-text').dxColorBox({
    value: '#f05b41',
    applyButtonText: 'Apply',
    cancelButtonText: 'Decline',
  });

  $('#color-box-read-only').dxColorBox({
    value: '#f05b41',
    readOnly: true,
  });

  $('#color-box-disabled').dxColorBox({
    value: '#f05b41',
    disabled: true,
  });

  $('#color-box-with-change-value').dxColorBox({
    value: '#f05b41',
    applyValueMode: 'instantly',
    onValueChanged(e) {
      $('.color-block').css('background-color', e.component.option('value'));
    },
    onInput(e) {
      $('.color-block').css('background-color', e.event.target.value);
    },
  });
});
