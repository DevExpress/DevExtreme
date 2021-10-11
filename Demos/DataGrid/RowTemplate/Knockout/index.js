window.onload = function () {
  const viewModel = {
    dataGridOptions: {
      dataSource: employees,
      dataRowTemplate: $('#gridRow'),
      rowAlternationEnabled: true,
      hoverStateEnabled: true,
      columnAutoWidth: true,
      showBorders: true,
      columns: [{
        caption: 'Photo',
        width: 100,
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
    },
  };

  ko.applyBindings(viewModel, document.getElementById('data-grid-demo'));
};
