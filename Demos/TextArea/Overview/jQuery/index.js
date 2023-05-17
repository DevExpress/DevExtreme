$(() => {
  const exampleTextArea = $('#example-textarea').dxTextArea({
    value: longText,
    height: 90,
    inputAttr: { 'aria-label': 'Notes' },
  }).dxTextArea('instance');

  $('#set-max-length').dxCheckBox({
    value: false,
    onValueChanged(data) {
      const str = data.value ? exampleTextArea.option('value').substring(0, 100) : longText;
      exampleTextArea.option('value', str);
      exampleTextArea.option('maxLength', data.value ? 100 : null);
    },
    text: 'Limit text length',
  });

  $('#set-resize').dxCheckBox({
    value: false,
    onValueChanged(e) {
      exampleTextArea.option('autoResizeEnabled', e.value);
      exampleTextArea.option('height', e.value ? undefined : 90);
    },
    text: 'Enable auto resize',
  });

  const valueChangeEvents = [{
    title: 'On Change',
    name: 'change',
  }, {
    title: 'On Key Up',
    name: 'keyup',
  }];

  $('#change-event').dxSelectBox({
    items: valueChangeEvents,
    value: valueChangeEvents[0].name,
    valueExpr: 'name',
    displayExpr: 'title',
    onValueChanged(data) {
      editingTextArea.option('valueChangeEvent', data.value);
    },
  });

  const editingTextArea = $('#editing-textarea').dxTextArea({
    value: longText,
    height: 90,
    valueChangeEvent: 'change',
    inputAttr: { 'aria-label': 'Notes' },
    onValueChanged(data) {
      disabledTextArea.option('value', data.value);
    },
  }).dxTextArea('instance');

  const disabledTextArea = $('#disabled-textarea').dxTextArea({
    value: longText,
    height: 90,
    readOnly: true,
    inputAttr: { 'aria-label': 'Notes' },
  }).dxTextArea('instance');
});
