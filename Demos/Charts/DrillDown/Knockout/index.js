window.onload = function () {
  const markup = ko.observableArray([]);

  const viewModel = {
    markup,
    treeMapOptions: {
      dataSource: citiesPopulation,
      size: {
        height: 440,
      },
      title: {
        text: 'The Most Populated Cities by Continents',
        placeholderSize: 80,
      },
      colorizer: {
        palette: 'soft',
      },
      interactWithGroup: true,
      maxDepth: 2,
      onClick(e) {
        e.node.drillDown();
      },
      onDrill(e) {
        let node;
        viewModel.markup([]);
        for (node = e.node.getParent(); node; node = node.getParent()) {
          viewModel.markup.unshift({
            html: `<span class='link'>${node.label() || 'All Continents'}</span> <span> > </span>`,
            node,
          });
        }
        if (viewModel.markup().length) {
          viewModel.markup.push({
            html: e.node.label(),
            node: e.node,
          });
        }
      },
    },
    onLinkClick(e) {
      e.node.drillDown();
    },
  };

  ko.applyBindings(viewModel, document.getElementById('treemap-demo'));
};
