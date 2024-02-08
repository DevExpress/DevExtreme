$(() => {
  $('#color-box-simple').dxColorBox({
    value: '#f05b41',
    inputAttr: {
      'aria-label': 'Default mode',
    },
  });

  $('#color-box-edit-alpha-channel').dxColorBox({
    value: '#f05b41',
    editAlphaChannel: true,
    inputAttr: {
      'aria-label': 'With alpha channel editing',
    },
  });

  $('#color-box-edit-button-text').dxColorBox({
    value: '#f05b41',
    applyButtonText: 'Apply',
    cancelButtonText: 'Decline',
    inputAttr: {
      'aria-label': 'Custom button captions',
    },
  });

  $('#color-box-read-only').dxColorBox({
    value: '#f05b41',
    readOnly: true,
    inputAttr: {
      'aria-label': 'Read only',
    },
  });

  $('#color-box-disabled').dxColorBox({
    value: '#f05b41',
    disabled: true,
    inputAttr: {
      'aria-label': 'Disabled',
    },
  });

  $('#color-box-with-change-value').dxColorBox({
    value: '#f05b41',
    applyValueMode: 'instantly',
    inputAttr: {
      'aria-label': 'Event Handling',
    },
    onValueChanged(e) {
      $('.color-block').css('background-color', e.component.option('value'));
    },
    onInput(e) {
      $('.color-block').css('background-color', e.event.target.value);
    },
  });
});
