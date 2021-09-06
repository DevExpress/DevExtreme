window.onload = function () {
  const colorizationOptions = [{
    name: 'Discrete',
    options: {
      type: 'discrete',
      palette: 'harmony light',
      colorizeGroups: false,
    },
  }, {
    name: 'Grouped',
    options: {
      type: 'discrete',
      palette: 'harmony light',
      colorizeGroups: true,
    },
  }, {
    name: 'Range',
    options: {
      type: 'range',
      palette: ['#fbd600', '#78299a'],
      range: [0, 50000, 100000, 150000, 200000, 250000],
      colorCodeField: 'salesAmount',
      colorizeGroups: false,
    },
  }, {
    name: 'Gradient',
    options: {
      type: 'gradient',
      palette: ['#fbd600', '#78299a'],
      range: [10000, 250000],
      colorCodeField: 'salesAmount',
      colorizeGroups: false,
    },
  }];
  const startColorization = ko.observable(colorizationOptions[2].options);

  const viewModel = {
    treeMapOptions: {
      dataSource: salesAmount,
      colorizer: startColorization,
      title: 'Sales Amount by Product',
      valueField: 'salesAmount',
      tooltip: {
        enabled: true,
        format: 'currency',
        customizeTooltip(arg) {
          const { data } = arg.node;

          return {
            text: arg.node.isLeaf() ? (`<span class='product'>${data.name
            }</span><br/>Sales Amount: ${arg.valueText}`) : null,
          };
        },
      },
    },
    selectBoxOptions: {
      displayExpr: 'name',
      items: colorizationOptions,
      value: colorizationOptions[2],
      onValueChanged(e) {
        startColorization(e.value.options);
      },
      width: 200,
    },
  };

  ko.applyBindings(viewModel, document.getElementById('treemap-demo'));
};
