$(() => {
  const listWidget = $('#list').dxList({
    dataSource: products,
    height: 400,
    searchEnabled: true,
    searchExpr: 'Name',
    itemTemplate(data) {
      return $('<div>').text(data.Name);
    },
  }).dxList('instance');

  $('#searchMode').dxSelectBox({
    dataSource: ['contains', 'startswith', 'equals'],
    value: 'contains',
    inputAttr: { 'aria-label': 'Search Mode' },
    onValueChanged(data) {
      listWidget.option('searchMode', data.value);
    },
  }).dxSelectBox('instance');
});
