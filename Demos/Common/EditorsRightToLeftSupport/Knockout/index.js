window.onload = function () {
  const languages = ['Arabic: Right-to-Left direction', 'English: Left-to-Right direction'];
  const displayExpr = ko.observable('nameEn');
  const rtlEnabled = ko.observable(false);
  const textBoxValue = ko.observable('text');
  const textAreaValue = ko.observable('text');
  const checkBoxValue = ko.observable('text');

  const viewModel = {
    rtlEnabled,
    checkBoxOptions: {
      value: true,
      text: checkBoxValue,
      rtlEnabled,
    },
    switchBoxOptions: {
      rtlEnabled,
    },
    textBoxOptions: {
      showClearButton: true,
      value: textBoxValue,
      rtlEnabled,
    },
    numberBoxOptions: {
      showSpinButtons: true,
      value: '123',
      rtlEnabled,
    },
    selectBoxOptions: {
      items: europeanUnion,
      value: europeanUnion[0].id,
      displayExpr,
      valueExpr: 'id',
      rtlEnabled,
    },
    tagBoxOptions: {
      items: europeanUnion,
      value: [europeanUnion[0].id],
      placeholder: '...',
      displayExpr,
      valueExpr: 'id',
      rtlEnabled,
    },
    textAreaOptions: {
      value: textAreaValue,
      rtlEnabled,
    },
    autocompleteOptions: {
      items: europeanUnion,
      valueExpr: displayExpr,
      rtlEnabled,
    },
    selectLanguageOptions: {
      items: languages,
      value: languages[1],
      rtlEnabled,
      onValueChanged(data) {
        const rtl = data.value === languages[0];
        const text = rtl ? 'نص' : 'text';
        displayExpr(rtl ? 'nameAr' : 'nameEn');
        rtlEnabled(rtl);
        textBoxValue(text);
        textAreaValue(text);
        checkBoxValue(text);
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('form'));
};
