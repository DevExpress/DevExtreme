$(() => {
  $('#gridContainer').dxDataGrid({
    dataSource: employees,
    keyExpr: 'ID',
    showBorders: true,
    columns: [{
      dataField: 'Picture',
      width: 100,
      allowFiltering: false,
      allowSorting: false,
      cellTemplate(container, options) {
        $('<div>')
          .append($('<img>', { src: options.value, alt: `Picture of ${options.data.FirstName} ${options.data.LastName}` }))
          .appendTo(container);
      },
    }, {
      dataField: 'Prefix',
      caption: 'Title',
      width: 70,
    },
    'FirstName',
    'LastName',
    'Position',
    {
      dataField: 'BirthDate',
      dataType: 'date',
    }, {
      dataField: 'HireDate',
      dataType: 'date',
    },
    ],
  });
});
