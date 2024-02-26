$(() => {
  $('#vector-map').dxVectorMap({
    layers: [{
      dataSource: DevExpress.viz.map.sources.world,
      hoverEnabled: false,
    }, {
      name: 'bubbles',
      dataSource: markers,
      elementType: 'bubble',
      dataField: 'value',
      minSize: 20,
      maxSize: 40,
      sizeGroups: [0, 8000, 10000, 50000],
      opacity: 0.8,
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
      source: { layer: 'bubbles', grouping: 'size' },
      markerShape: 'circle',
      customizeText(arg) {
        return ['< 8000K', '8000K to 10000K', '> 10000K'][arg.index];
      },
      customizeItems(items) {
        return items.reverse();
      },
    }],
    bounds: [-180, 85, 180, -60],
  });
});
