window.onload = function () {
  const selectedEmployee = ko.observable({});

  const viewModel = {
    selectedEmployee,
    gridOptions: {
      dataSource: employees,
      keyExpr: 'ID',
      selection: {
        mode: 'single',
      },
      hoverStateEnabled: true,
      showBorders: true,
      columns: [{
        dataField: 'Prefix',
        caption: 'Title',
        width: 70,
      },
      'FirstName',
      'LastName', {
        dataField: 'Position',
        width: 180,
      }, {
        dataField: 'BirthDate',
        dataType: 'date',
      }, {
        dataField: 'HireDate',
        dataType: 'date',
      }],
      onSelectionChanged(selectedItems) {
        selectedEmployee(selectedItems.selectedRowsData[0]);
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('grid'));
};
