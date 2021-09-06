window.onload = function () {
  const viewModel = {
    dataGridOptions: {
      dataSource: generateData(100000),
      showBorders: true,
      customizeColumns(columns) {
        columns[0].width = 70;
      },
      loadPanel: {
        enabled: false,
      },
      scrolling: {
        mode: 'infinite',
      },
      sorting: {
        mode: 'none',
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('data-grid-demo'));
};
