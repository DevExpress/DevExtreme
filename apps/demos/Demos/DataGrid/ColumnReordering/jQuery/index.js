$(() => {
  $('#gridContainer').dxDataGrid({
    dataSource: employees,
    keyExpr: 'ID',
    allowColumnReordering: true,
    columnAutoWidth: true,
    showBorders: true,
    columnFixing: {
      enabled: true,
    },
    columns: [
      {
        caption: 'Employee',
        fixed: true,
        calculateCellValue(data) {
          return [data.Title,
            data.FirstName, data.LastName]
            .join(' ');
        },
      },
      {
        dataField: 'Position',
        alignment: 'right',
        fixed: true,
      },
      'Address',
      'City',
      'Zipcode',
      'State',
      'Department',
      {
        dataField: 'BirthDate',
        dataType: 'date',
      },
      {
        dataField: 'HireDate',
        dataType: 'date',
      },
      'HomePhone',
      'MobilePhone',
      'Email',
      'Skype',
    ]
  });
});
