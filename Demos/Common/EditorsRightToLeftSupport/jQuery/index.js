$(() => {
  const checkBoxWidget = $('#checkbox').dxCheckBox({
    value: true,
    text: 'text',
  }).dxCheckBox('instance');

  const switchWidget = $('#switch').dxSwitch({}).dxSwitch('instance');

  const textBoxWidget = $('#text-box').dxTextBox({
    showClearButton: true,
    inputAttr: { 'aria-label': 'Text Box' },
    value: 'text',
  }).dxTextBox('instance');

  const numberBoxWidget = $('#number-box').dxNumberBox({
    showSpinButtons: true,
    value: '123',
    inputAttr: { 'aria-label': 'Number Box' },
  }).dxNumberBox('instance');

  const selectBoxWidget = $('#select-box').dxSelectBox({
    items: europeanUnion,
    inputAttr: { 'aria-label': 'European Union' },
    value: europeanUnion[0].id,
    displayExpr: 'nameEn',
    valueExpr: 'id',
  }).dxSelectBox('instance');

  const tagBoxWidget = $('#tag-box').dxTagBox({
    items: europeanUnion,
    value: [europeanUnion[0].id],
    placeholder: '...',
    displayExpr: 'nameEn',
    inputAttr: { 'aria-label': 'Name' },
    valueExpr: 'id',
  }).dxTagBox('instance');

  const textAreaWidget = $('#text-area').dxTextArea({
    value: 'text',
    inputAttr: { 'aria-label': 'Notes' },
  }).dxTextArea('instance');

  const autocompleteWidget = $('#autocomplete').dxAutocomplete({
    items: europeanUnion,
    valueExpr: 'nameEn',
  }).dxAutocomplete('instance');

  const languages = ['Arabic: Right-to-Left direction', 'English: Left-to-Right direction'];

  $('#select-language').dxSelectBox({
    items: languages,
    inputAttr: { 'aria-label': 'Language' },
    value: languages[1],
    onValueChanged(data) {
      const rtl = data.value === languages[0];
      const text = rtl ? 'نص' : 'text';
      const expression = rtl ? 'nameAr' : 'nameEn';

      $('#form').toggleClass('dx-rtl', rtl);

      checkBoxWidget.option({
        text,
        rtlEnabled: rtl,
      });
      textBoxWidget.option({
        value: text,
        rtlEnabled: rtl,
      });
      textAreaWidget.option({
        value: text,
        rtlEnabled: rtl,
      });
      selectBoxWidget.option({
        displayExpr: expression,
        rtlEnabled: rtl,
      });
      tagBoxWidget.option({
        displayExpr: expression,
        rtlEnabled: rtl,
      });
      autocompleteWidget.option({
        value: '',
        rtlEnabled: rtl,
      });
      autocompleteWidget.option({
        valueExpr: expression,
        rtlEnabled: rtl,
      });
      numberBoxWidget.option('rtlEnabled', rtl);
      switchWidget.option('rtlEnabled', rtl);
    },
  });
});
