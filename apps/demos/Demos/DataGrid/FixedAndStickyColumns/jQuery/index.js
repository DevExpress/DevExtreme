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
      },
      {
        dataField: 'Position',
        alignment: 'right',
      },
      {
        dataField: 'Address',
        width: 230,
        fixed: true,
        fixedPosition: 'sticky'
      },
      'City',
      'Zipcode',
      'State',
      {
        dataField: 'Department',
        fixed: true,
        fixedPosition: 'right',
      },
      {
        dataField: 'BirthDate',
        dataType: 'date',
      }, {
        dataField: 'HireDate',
        dataType: 'date',
      }, 
      'HomePhone',
      'MobilePhone',
      {
        dataField: 'Email',
        fixed: true,
        fixedPosition: 'sticky',
      },
      'Skype',
    ],
  });
});
