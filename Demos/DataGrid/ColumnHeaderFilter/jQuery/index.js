$(() => {
  $('#employees').dxDataGrid({
    dataSource: employees,
    keyExpr: 'ID',
    headerFilter: {
      visible: true,
    },
    columns: ['FirstName', 'LastName', {
      dataField: 'Position',
      headerFilter: {
        allowSelectAll: false,
        search: {
          enabled: true,
        },
      },
    }, {
      dataField: 'City',
      headerFilter: {
        search: {
          enabled: true,
          editorOptions: {
            placeholder: 'Search city or state',
          },
          searchExpr: ['City', 'State'],
        },
      },
    }, 'State', 'HomePhone', {
      dataField: 'HireDate',
      dataType: 'date',
    }],
    columnAutoWidth: true,
    showRowLines: true,
    showBorders: true,
  });
});
