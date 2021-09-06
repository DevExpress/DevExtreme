window.onload = function () {
  const viewModel = {
    dataGridOptions: {
      dataSource: generateData(100000),
      showBorders: true,
      customizeColumns(columns) {
        columns[0].width = 70;
      },
      loadPanel: {
        enabled: true,
      },
      scrolling: {
        mode: 'virtual',
      },
      sorting: {
        mode: 'none',
      },
      onContentReady(e) {
        e.component.option('loadPanel.enabled', false);
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('data-grid-demo'));
};
