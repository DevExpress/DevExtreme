window.onload = function () {
  const autoExpandAll = ko.observable(true);

  const viewModel = {
    dataGridOptions: {
      dataSource: customers,
      allowColumnReordering: true,
      showBorders: true,
      grouping: {
        autoExpandAll,
      },
      searchPanel: {
        visible: true,
      },
      paging: {
        pageSize: 10,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        'CompanyName',
        'Phone',
        'Fax',
        'City',
        {
          dataField: 'State',
          groupIndex: 0,
        },
      ],
    },
    checkBoxOptions: {
      text: 'Expand All Groups',
      value: autoExpandAll,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('data-grid-demo'));
};
