window.onload = function () {
  const viewModel = {
    vectorMapOptions: {
      layers: [{
        name: 'areas',
        dataSource: DevExpress.viz.map.sources.world,
        palette: 'Violet',
        colorGroups: [0, 0.5, 0.8, 1, 2, 3, 100],
        colorGroupingField: 'population',
        label: {
          enabled: true,
          dataField: 'name',
        },
        customize(elements) {
          elements.forEach((element) => {
            const name = element.attribute('name');
            const population = populations[name];
            if (population) {
              element.attribute('population', population);
            }
          });
        },
      }, {
        name: 'markers',
        dataSource: markers,
        elementType: 'bubble',
        dataField: 'value',
        sizeGroups: [0, 8000, 10000, 50000],
        opacity: 0.8,
        label: {
          enabled: false,
        },
      }],
      tooltip: {
        enabled: true,
        customizeTooltip(arg) {
          return { text: arg.attribute('text') };
        },
      },
      legends: [{
        title: 'World Population\nPercentages',
        source: { layer: 'areas', grouping: 'color' },
        horizontalAlignment: 'left',
        verticalAlignment: 'bottom',
        customizeText(arg) {
          if (arg.index === 0) {
            return '< 0.5%';
          }
          if (arg.index === 5) {
            return '> 3%';
          }

          return `${arg.start}% to ${arg.end}%`;
        },
        customizeItems(items) {
          return items.reverse();
        },
      }, {
        title: 'City Population',
        source: { layer: 'markers', grouping: 'size' },
        markerShape: 'circle',
        horizontalAlignment: 'right',
        verticalAlignment: 'bottom',
        customizeText(arg) {
          return ['< 8000K', '8000K to 10000K', '> 10000K'][arg.index];
        },
        customizeItems(items) {
          return items.reverse();
        },
      }],
      bounds: [-180, 85, 180, -75],
    },
  };

  ko.applyBindings(viewModel, $('#vector-map-demo').get(0));
};
