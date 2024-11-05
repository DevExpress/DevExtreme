$(() => {
  $('#employees').dxTreeList({
    dataSource: employees,
    allowColumnReordering: true,
    keyExpr: 'ID',
    parentIdExpr: 'Head_ID',
    columns: [{
        caption: 'Full Name',
        fixed: true,
        calculateCellValue(data) {
          return [data.Title,
            data.FirstName, data.LastName]
            .join(' ');
        }, 
      },  {
        dataField: 'City',
        fixed: true,
        fixedPosition: 'right',
      }, {
        dataField: 'State',
        fixed: true,
        fixedPosition: 'right',
      }, {
        dataField: 'HireDate',
        dataType: 'date',
      }, {
        dataField: 'BirthDate',
        dataType: 'date',
      }, {
        dataField: 'Address',
        fixed: true,
        fixedPosition: 'sticky',
      }, 'Department', 'Position', 'HomePhone', 'MobilePhone', 'Skype', 'Email', 'Zipcode',
    ],
    showRowLines: true,
    showBorders: true,
    columnAutoWidth: true,
    expandedRowKeys: [1],
  });
});
