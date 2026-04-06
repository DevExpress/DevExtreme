$(() => {
  DevExpress.setTemplateEngine({
    compile: (element) => $(element).html(),
    render: (template, data) => Mustache.render(template, data),
  });

  $('#gridContainer').dxDataGrid({
    dataSource: employees,
    keyExpr: 'ID',
    showBorders: true,
    hoverStateEnabled: true,
    rowAlternationEnabled: true,
    dataRowTemplate: $('#gridRow'),
    columns: [{
      dataField: 'Photo',
      allowFiltering: false,
      allowSorting: false,
    }, {
      dataField: 'Prefix',
      caption: 'Title',
      width: 70,
    },
    'FirstName',
    'LastName',
    'Position', {
      dataField: 'BirthDate',
      dataType: 'date',
    }, {
      dataField: 'HireDate',
      dataType: 'date',
    },
    ],
  });
});
