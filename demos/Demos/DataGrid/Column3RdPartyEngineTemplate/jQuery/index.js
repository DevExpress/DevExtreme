$(() => {
  DevExpress.setTemplateEngine({
    compile: (element) => $(element).html(),
    render: (template, data) => Mustache.render(template, data),
  });

  $('#gridContainer').dxDataGrid({
    dataSource: employees,
    showBorders: true,
    columns: [{
      dataField: 'Picture',
      width: 100,
      allowFiltering: false,
      allowSorting: false,
      cellTemplate: $('#gridPhoto'),
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
