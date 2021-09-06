window.onload = function () {
  const viewModel = {
    treeMapOptions: {
      dataSource: citiesPopulation,
      title: 'The Most Populated Cities by Continents',
      tooltip: {
        enabled: true,
        format: 'thousands',
        customizeTooltip(arg) {
          const { data } = arg.node;
          let result = null;

          if (arg.node.isLeaf()) {
            result = `<span class='city'>${data.name}</span> (${
              data.country})<br/>Population: ${arg.valueText}`;
          }

          return {
            text: result,
          };
        },
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('treemap-demo'));
};
