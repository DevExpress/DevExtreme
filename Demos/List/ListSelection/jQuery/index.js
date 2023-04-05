$(() => {
  const listWidget = $('#simpleList').dxList({
    dataSource: new DevExpress.data.DataSource({
      store: new DevExpress.data.ArrayStore({
        key: 'id',
        data: tasks,
      }),
    }),
    height: 400,
    showSelectionControls: true,
    selectionMode: 'all',
    onSelectionChanged() {
      $('#selectedItemKeys').text(listWidget.option('selectedItemKeys').join(', '));
    },
  }).dxList('instance');

  $('#selectionMode').dxSelectBox({
    value: 'all',
    items: ['none', 'single', 'multiple', 'all'],
    onValueChanged(data) {
      listWidget.option('selectionMode', data.value);
      selectAllModeChooser.option('disabled', data.value !== 'all');

      if (data.value === 'none') {
        $('#selectedItemKeys').text('');
      }
    },
  });

  const selectAllModeChooser = $('#selectAllMode').dxSelectBox({
    disabled: false,
    items: ['page', 'allPages'],
    value: 'page',
    onValueChanged(data) {
      listWidget.option('selectAllMode', data.value);
    },
  }).dxSelectBox('instance');
});
