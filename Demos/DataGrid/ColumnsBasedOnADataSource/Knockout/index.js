window.onload = function () {
  const viewModel = {
    gridOptions: {
      dataSource: orders,
      keyExpr: 'OrderNumber',
      showBorders: true,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('grid'));
};
