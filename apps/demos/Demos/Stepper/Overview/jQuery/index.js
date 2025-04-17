$(() => {
  const stepperWithIcons = $('#icons').dxStepper({
    linear: navigationModes[0].value,
    elementAttr: { 'aria-labelledby': 'iconsLabel' },
    selectedIndex: 2,
    dataSource,
  }).dxStepper('instance');

  const stepperWithNumbers = $('#numbers').dxStepper({
    linear: navigationModes[0].value,
    elementAttr: { 'aria-labelledby': 'numbersLabel' },
    selectedIndex: 2,
    dataSource: dataSource.map(({ icon, text, ...rest }) => rest),
  }).dxStepper('instance');

  const stepperWithCustomText = $('#customText').dxStepper({
    linear: navigationModes[0].value,
    elementAttr: { 'aria-labelledby': 'customTextLabel' },
    selectedIndex: 2,
    dataSource: dataSource.map(({
      icon, label, optional, ...rest
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
    text: 'Select step on focus',
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
    stepperWithNumbers.option(option, value);
    stepperWithCustomText.option(option, value);
  }
});
