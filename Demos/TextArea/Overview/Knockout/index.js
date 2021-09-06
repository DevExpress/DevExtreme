window.onload = function () {
  const valueChangeEvents = [{
    title: 'On Blur',
    name: 'change',
  }, {
    title: 'On Key Up',
    name: 'keyup',
  }];

  const maxLength = ko.observable(null);
  const value = ko.observable(longText);
  const eventValue = ko.observable(valueChangeEvents[0].name);
  const valueForEditableTextArea = ko.observable(longText);

  const viewModel = {
    textAreaWithMaxLength: {
      maxLength,
      value,
      height: 90,
    },
    checkBoxOptions: {
      value: false,
      onValueChanged(data) {
        if (data.value) {
          value(longText.substring(0, 100));
          maxLength(100);
        } else {
          value(longText);
          maxLength(null);
        }
      },
      text: 'Limit text length',
    },
    selectBoxOptions: {
      items: valueChangeEvents,
      value: eventValue,
      valueExpr: 'name',
      displayExpr: 'title',
    },
    editableTextArea: {
      value: valueForEditableTextArea,
      height: 90,
      valueChangeEvent: eventValue,
    },
    disabledTextArea: {
      value: valueForEditableTextArea,
      height: 90,
      readOnly: true,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('text-area-demo'));
};
