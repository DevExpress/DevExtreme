$(() => {
  $('#employees').dxTreeList({
    dataSource: employees,
    keyExpr: 'ID',
    parentIdExpr: 'Head_ID',
    allowColumnReordering: true,
    columnAutoWidth: true,
    showBorders: true,
    columnFixing: {
      enabled: true,
    },
    showRowLines: true,
    autoExpandAll: true,
    columns: [{
      caption: 'Employee',
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
        dataField: 'Address',
        width: 190,
        fixed: true,
        fixedPosition: 'sticky',
      }, 'Zipcode', {
        dataField: 'HireDate',
        dataType: 'date',
      }, {
        dataField: 'Position',
        alignment: 'right',
      }, {
        dataField: 'City',
        fixed: true,
        fixedPosition: 'right',
      }, {
        dataField: 'State',
        fixed: true,
        fixedPosition: 'right',
      }, 'Department', 'HomePhone', 'MobilePhone', 'Skype', 'Email',
    ],
  });
});
