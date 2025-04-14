$(() => {
  const initialStepperSettings = {
    rtlEnabled: false,
    selectedIndex: 2,
    selectOnFocus: false,
    orientation: orientations[0].value,
    linear: navigationModes[0].value,
  };

  const stepperWithIcons = $('#withText').dxStepper({
    ...initialStepperSettings,
    dataSource,
  }).dxStepper('instance');

  const stepperDefault = $('#withIconAndText').dxStepper({
    ...initialStepperSettings,
    dataSource: dataSource.map(({ icon, text, ...rest }) => rest),
  }).dxStepper('instance');

  const stepperWithText = $('#withIcon').dxStepper({
    ...initialStepperSettings,
    dataSource: dataSource.map(({
      icon, title, optional, ...rest
    }) => rest),
  }).dxStepper('instance');

  $('#orientation').dxButtonGroup({
    width: '100%',
    items: orientations,
    selectedItems: [orientations[0]],
    inputAttr: { 'aria-label': 'Orientation' },
    onSelectionChanged(data) {
      const $widgetWrapper = $('.widget-wrapper');

      const isVertical = data.addedItems[0].text === 'Vertical';

      $widgetWrapper.toggleClass('widget-wrapper-vertical', isVertical);
      $widgetWrapper.toggleClass('widget-wrapper-horizontal', !isVertical);

      setOption('orientation', data.addedItems[0].value);
    },
  });

  $('#navigation-mode').dxButtonGroup({
    width: '100%',
    items: navigationModes,
    selectedItems: [navigationModes[0]],
    valueExpr: 'value',
    inputAttr: { 'aria-label': 'Navigation Mode' },
    onSelectionChanged(data) {
      setOption('linear', data.addedItems[0].value);
    },
  });

  $('#select-on-focus').dxCheckBox({
    text: 'Select on focus',
    value: false,
    onValueChanged(data) {
      setOption('selectOnFocus', data.value);
    },
  });

  $('#rtl-mode').dxCheckBox({
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
