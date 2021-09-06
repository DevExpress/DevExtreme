window.onload = function () {
  const showColumnLines = ko.observable(false);
  const showRowLines = ko.observable(true);
  const showBorders = ko.observable(true);
  const rowAlternationEnabled = ko.observable(true);

  const viewModel = {
    dataGridOptions: {
      dataSource: employees,
      showColumnLines,
      showRowLines,
      showBorders,
      rowAlternationEnabled,
      columns: [
        {
          dataField: 'Prefix',
          caption: 'Title',
          width: 80,
        },
        'FirstName',
        'LastName',
        {
          dataField: 'City',
        }, {
          dataField: 'State',
        }, {
          dataField: 'Position',
          width: 130,
        }, {
          dataField: 'BirthDate',
          dataType: 'date',
          width: 100,
        }, {
          dataField: 'HireDate',
          dataType: 'date',
          width: 100,
        },
      ],
    },
    columnLinesOptions: {
      text: 'Show Column Lines',
      value: showColumnLines,
    },
    rowLinesOptions: {
      text: 'Show Row Lines',
      value: showRowLines,
    },
    showBordersOptions: {
      text: 'Show Borders',
      value: showBorders,
    },
    rowAlternationOptions: {
      text: 'Alternating Row Color',
      value: rowAlternationEnabled,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('data-grid-demo'));
};
