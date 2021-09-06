window.onload = function () {
  const viewModel = {
    dataGridOptions: {
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
          e.editorOptions.disabled = (typeof e.row.data.StateID !== 'number');
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
    },
  };

  ko.applyBindings(viewModel, document.getElementById('data-grid-demo'));
};
