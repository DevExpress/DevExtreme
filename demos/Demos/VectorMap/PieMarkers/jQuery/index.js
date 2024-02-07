$(() => {
  $('#vector-map').dxVectorMap({
    layers: [{
      dataSource: DevExpress.viz.map.sources.world,
      hoverEnabled: false,
    }, {
      name: 'pies',
      dataSource: markers,
      elementType: 'pie',
      dataField: 'values',
    }],
    tooltip: {
      enabled: true,
      customizeTooltip(arg) {
        if (arg.layer.type === 'marker') {
          return { text: arg.attribute('tooltip') };
        }
        return null;
      },
    },
    legends: [{
      source: { layer: 'pies', grouping: 'color' },
      customizeText(arg) {
        return names[arg.index];
      },
    }],
    bounds: [-180, 85, 180, -60],
  });
});
