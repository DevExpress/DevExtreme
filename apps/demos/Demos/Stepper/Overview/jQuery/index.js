$(() => {
  const stepperWithIcons = $('#withText').dxStepper({
    linear: navigationModes[0].value,
    dataSource,
  }).dxStepper('instance');

  const stepperDefault = $('#withIconAndText').dxStepper({
    linear: navigationModes[0].value,
    dataSource: dataSource.map(({ icon, text, ...rest }) => rest),
  }).dxStepper('instance');

  const stepperWithText = $('#withIcon').dxStepper({
    linear: navigationModes[0].value,
    dataSource: dataSource.map(({
      icon, title, ...rest
    }) => rest),
  }).dxStepper('instance');

  $('#orientation').dxButtonGroup({
    width: '100%',
    items: orientations,
    selectedItems: [orientations[0]],
    onSelectionChanged(data) {
      const $widgetWrapper = $('.widget-wrapper');

      const { text, value } = data.addedItems[0];

      const isVertical = text === 'Vertical';

      $widgetWrapper.toggleClass('widget-wrapper-vertical', isVertical);
      $widgetWrapper.toggleClass('widget-wrapper-horizontal', !isVertical);

      setOption('orientation', value);
    },
  });

  $('#navigationMode').dxButtonGroup({
    width: '100%',
    items: navigationModes,
    selectedItems: [navigationModes[0]],
    onSelectionChanged(data) {
      setOption('linear', data.addedItems[0].value);
    },
  });

  $('#selectOnFocus').dxCheckBox({
    text: 'Select on focus',
    value: true,
    onValueChanged(data) {
      setOption('selectOnFocus', data.value);
    },
  });

  $('#rtlMode').dxCheckBox({
    text: 'Right-to-left mode',
    value: false,
    onValueChanged(data) {
      setOption('rtlEnabled', data.value);
    },
  });

  function setOption(option, value) {
    stepperWithIcons.option(option, value);
    stepperDefault.option(option, value);
    stepperWithText.option(option, value);
  }
});
