window.onload = function () {
  const currentColor = ko.observable('#f05b41');

  const viewModel = {
    currentColor,
    colorBoxSimple: {
      value: '#f05b41',
    },
    colorBoxEditAlphaChannel: {
      value: '#f05b41',
      editAlphaChannel: true,
    },
    colorBoxEditButtonText: {
      value: '#f05b41',
      applyButtonText: 'Apply',
      cancelButtonText: 'Decline',
    },
    colorBoxReadOnly: {
      value: '#f05b41',
      readOnly: true,
    },
    colorBoxDisabled: {
      value: '#f05b41',
      disabled: true,
    },
    colorBoxWithChangeValue: {
      value: currentColor,
      applyValueMode: 'instantly',
    },
  };

  ko.applyBindings(viewModel, document.getElementById('color-box-demo'));
};
