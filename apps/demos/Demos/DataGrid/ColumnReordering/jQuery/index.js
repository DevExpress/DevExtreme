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
    columns: [{
      caption: 'Employee',
      width: 230,
      fixed: true,
      fixedPosition: 'left',
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
      fixed: true,
      fixedPosition: 'right',
    }, {
      dataField: 'Address',
      width: 230,
    }, 'City', 'State', {
      dataField: 'Zipcode',
      visible: false,
    }, 'HomePhone', 'MobilePhone', 'Skype', 'Email'],
  });
});
