$(() => {
  $('#employees').dxTreeList({
    dataSource: employees,
    keyExpr: 'ID',
    parentIdExpr: 'Head_ID',
    columnAutoWidth: true,
    showBorders: true,
    columnFixing: {
      enabled: true,
    },
    showRowLines: true,
    autoExpandAll: true,
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
      },
      {
        dataField: 'Address',
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
      'Email',
      'Skype',
    ],
  });
});
