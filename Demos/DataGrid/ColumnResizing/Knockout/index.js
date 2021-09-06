window.onload = function () {
  const resizingModes = ['nextColumn', 'widget'];
  const columnResizingMode = ko.observable(resizingModes[0]);

  const viewModel = {
    dataGridOptions: {
      dataSource: customers,
      allowColumnResizing: true,
      showBorders: true,
      columnResizingMode,
      columnMinWidth: 50,
      columnAutoWidth: true,
      columns: ['CompanyName', 'City', 'State', 'Phone', 'Fax'],
    },
    resizingOptions: {
      items: resizingModes,
      value: columnResizingMode,
      width: 250,
      onValueChanged(data) {
        columnResizingMode(data.value);
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('dataGrid'));
};
