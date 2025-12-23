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
    columns,
    showBorders: true,
    dataSource: products,
    filterValue: filter,
    height: 300,
  });
});
