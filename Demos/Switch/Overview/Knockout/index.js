window.onload = function () {
  const switchValue = ko.observable(false);

  const viewModel = {
    switchOn: {
      value: true,
    },
    switchOff: {
      value: false,
    },
    handlerSwitch: {
      value: switchValue,
    },
    disabled: {
      value: switchValue,
      disabled: true,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('switch-demo'));
};
