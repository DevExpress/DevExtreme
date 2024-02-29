$(() => {
  $('#gridContainer').dxDataGrid({
    keyExpr: 'ID',
    dataSource: employees,
    showBorders: true,
    editing: {
      allowUpdating: true,
      allowAdding: true,
      mode: 'row',
    },
    onEditorPreparing(e) {
      if (e.parentType === 'dataRow' && e.dataField === 'CityID') {
        const isStateNotSet = e.row.data.StateID === undefined;

        e.editorOptions.disabled = isStateNotSet;
      }
    },
    columns: ['FirstName', 'LastName', 'Position',
      {
        dataField: 'StateID',
        caption: 'State',
        setCellValue(rowData, value) {
          rowData.StateID = value;
          rowData.CityID = null;
        },
        lookup: {
          dataSource: states,
          valueExpr: 'ID',
          displayExpr: 'Name',
        },
      },
      {
        dataField: 'CityID',
        caption: 'City',
        lookup: {
          dataSource(options) {
            return {
              store: cities,
              filter: options.data ? ['StateID', '=', options.data.StateID] : null,
            };
          },
          valueExpr: 'ID',
          displayExpr: 'Name',
        },
      },
    ],
  });
});
