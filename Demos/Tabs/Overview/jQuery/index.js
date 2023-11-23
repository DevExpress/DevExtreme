$(() => {
  const tab1 = $('#withText').dxTabs({
    width: 'auto',
    rtlEnabled: false,
    selectedIndex: 0,
    showNavButtons: false,
    dataSource: tabsText,
    orientation: orientations[0],
    stylingMode: stylingModes[1],
    iconPosition: iconPositions[0],
  }).dxTabs('instance');

  const tab2 = $('#withIconAndText').dxTabs({
    width: 'auto',
    rtlEnabled: false,
    selectedIndex: 0,
    showNavButtons: false,
    dataSource: tabsIconAndText,
    orientation: orientations[0],
    stylingMode: stylingModes[1],
    iconPosition: iconPositions[0],
  }).dxTabs('instance');

  const tab3 = $('#withIcon').dxTabs({
    width: 'auto',
    rtlEnabled: false,
    selectedIndex: 0,
    showNavButtons: false,
    dataSource: tabsIcon,
    orientation: orientations[0],
    stylingMode: stylingModes[1],
    iconPosition: iconPositions[0],
  }).dxTabs('instance');

  $('#orientation').dxSelectBox({
    items: orientations,
    value: orientations[0],
    inputAttr: { 'aria-label': 'Orientation' },
    onValueChanged(data) {
      const $widgetWrapper = $('.widget-wrapper');

      const isVertical = data.value === 'vertical';

      $widgetWrapper.toggleClass('widget-wrapper-vertical', isVertical);
      $widgetWrapper.toggleClass('widget-wrapper-horizontal', !isVertical);

      setTabsOption('orientation', data.value);
    },
  });

  $('#styling-mode').dxSelectBox({
    items: stylingModes,
    value: stylingModes[1],
    inputAttr: { 'aria-label': 'Styling Mode' },
    onValueChanged(data) {
      setTabsOption('stylingMode', data.value);
    },
  });

  $('#icon-position').dxSelectBox({
    items: iconPositions,
    inputAttr: { 'aria-label': 'Icon Position' },
    value: iconPositions[0],
    onValueChanged(data) {
      setTabsOption('iconPosition', data.value);
    },
  });

  const showNavButtonsCheckBox = $('#show-navigation-buttons').dxCheckBox({
    text: 'Show navigation buttons',
    value: false,
    onValueChanged(data) {
      const shouldRestrictWidth = data.value || scrollContentCheckBox.option('value');

      toggleStrictWidthClass(shouldRestrictWidth);

      setTabsOption('showNavButtons', data.value);
    },
  }).dxCheckBox('instance');

  const scrollContentCheckBox = $('#scroll-content').dxCheckBox({
    text: 'Scroll content',
    value: false,
    onValueChanged(data) {
      const shouldRestrictWidth = data.value || showNavButtonsCheckBox.option('value');

      toggleStrictWidthClass(shouldRestrictWidth);

      setTabsOption('scrollByContent', data.value);
    },
  }).dxCheckBox('instance');

  $('#full-width').dxCheckBox({
    text: 'Full width',
    value: false,
    onValueChanged(data) {
      setTabsOption('width', data.value ? '100%' : 'auto');
    },
  });

  $('#rtl').dxCheckBox({
    text: 'Right-to-left mode',
    value: false,
    onValueChanged(data) {
      setTabsOption('rtlEnabled', data.value);
    },
  });

  function setTabsOption(option, value) {
    tab1.option(option, value);
    tab2.option(option, value);
    tab3.option(option, value);
  }

  function toggleStrictWidthClass(shouldRestrictWidth) {
    const $widgetWrapper = $('.widget-wrapper');

    $widgetWrapper.toggleClass('strict-width', shouldRestrictWidth);
  }
});
