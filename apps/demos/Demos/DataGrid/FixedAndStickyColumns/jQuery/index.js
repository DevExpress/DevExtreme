$(() => {
  $('#gridContainer').dxDataGrid({
    dataSource: employees,
    keyExpr: 'ID',
    columnAutoWidth: true,
    showBorders: true,
    columnFixing: {
      enabled: true,
    },
    columns: [
      {
        caption: 'Employee',
        width: 230,
        fixed: true,
        calculateCellValue(data) {
          return [data.Title,
            data.FirstName, data.LastName]
            .join(' ');
        },
      }, {
        dataField: 'BirthDate',
        dataType: 'date',
      }, {
        dataField: 'HireDate',
        dataType: 'date',
      }, {
        dataField: 'Position',
        alignment: 'right',
      }, {
        dataField: 'Address',
        width: 230,
        fixed: true,
        fixedPosition: 'sticky'
      },
      'City',
      {
        dataField: 'State',
        fixed: true,
        fixedPosition: 'right',
      },
      'HomePhone',
      'MobilePhone',
      'Skype',
      'Email',
    ],
  });
});
