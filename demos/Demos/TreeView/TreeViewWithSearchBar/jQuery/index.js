$(() => {
  const treeView = $('#treeview').dxTreeView({
    items: products,
    width: 500,
    searchEnabled: true,
  }).dxTreeView('instance');

  $('#searchMode').dxSelectBox({
    items: ['contains', 'startswith', 'equals'],
    value: 'contains',
    inputAttr: { 'aria-label': 'Search Mode' },
    onValueChanged(data) {
      treeView.option('searchMode', data.value);
    },
  });
});
