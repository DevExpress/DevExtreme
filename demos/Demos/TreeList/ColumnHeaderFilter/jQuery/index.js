$(() => {
  $('#employees').dxTreeList({
    dataSource: employees,
    keyExpr: 'ID',
    parentIdExpr: 'Head_ID',
    headerFilter: {
      visible: true,
    },
    selection: {
      mode: 'single',
    },
    columns: [
      'Full_Name', {
        dataField: 'Title',
        caption: 'Position',
        headerFilter: {
          allowSelectAll: false,
          search: {
            enabled: true,
          },
        },
      },
      {
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
      }, 'State', 'Mobile_Phone', {
        dataField: 'Hire_Date',
        dataType: 'date',
      },
    ],
    columnAutoWidth: true,
    showRowLines: true,
    showBorders: true,
    expandedRowKeys: [1],
  });
});
