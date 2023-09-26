$(() => {
  $('#longtabs > .tabs-container').dxTabs({
    dataSource: longtabs,
  });

  $('#scrolledtabs > .tabs-container').dxTabs({
    dataSource: longtabs,
    width: 300,
    scrollByContent: true,
    showNavButtons: true,
  });

  const tabsInstance = $('#tabs > .tabs-container').dxTabs({
    dataSource: tabs,
    selectedIndex: 0,
    onItemClick(e) {
      selectBox.option('value', e.itemData.id);
    },
  }).dxTabs('instance');

  const selectBox = $('#selectbox').dxSelectBox({
    value: 0,
    dataSource: tabs,
    inputAttr: { 'aria-label': 'Tab' },
    displayExpr: 'text',
    valueExpr: 'id',
    onValueChanged(e) {
      tabsInstance.option('selectedIndex', e.value);
      $('.left-aligned').text(tabs[e.value].content);
    },
  }).dxSelectBox('instance');
});
