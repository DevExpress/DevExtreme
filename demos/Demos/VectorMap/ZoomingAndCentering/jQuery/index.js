$(() => {
  const map = $('#vector-map').dxVectorMap({
    tooltip: {
      enabled: true,
      customizeTooltip(arg) {
        if (arg.layer.type === 'marker') {
          return { text: arg.attribute('name') };
        }
        return null;
      },
    },
    onClick(e) {
      if (e.target && e.target.layer.type === 'marker') {
        e.component.center(e.target.coordinates()).zoomFactor(10);
      }
    },
    bounds: [-180, 85, 180, -60],
    layers: [{
      dataSource: DevExpress.viz.map.sources.world,
      hoverEnabled: false,
    }, {
      dataSource: markers,
    }],
  }).dxVectorMap('instance');

  $('#reset').dxButton({
    text: 'Reset',
    onClick() {
      map.center(null).zoomFactor(null);
    },
  });
});
