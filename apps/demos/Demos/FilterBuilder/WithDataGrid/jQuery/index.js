$(() => {
  $('#filterBuilder').dxFilterBuilder({
    fields,
    value: filter,
  });

  $('#apply').dxButton({
    text: 'Apply Filter',
    type: 'default',
    onClick() {
      const filter = $('#filterBuilder').dxFilterBuilder('instance').option('value');
      $('#dataGrid').dxDataGrid('instance').option('filterValue', filter);
    },
  });

  $('#dataGrid').dxDataGrid({
    columns: fields,
    showBorders: true,
    dataSource: DevExpress.data.AspNet.createStore({
      loadUrl: 'https://js.devexpress.com/Demos/NetCore/api/ListData',
      key: 'ProductID',
    }),
    filterValue: filter,
    height: 300,
  });
});
