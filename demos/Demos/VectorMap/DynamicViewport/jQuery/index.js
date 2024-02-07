$(() => {
  const map = $('#vector-map').dxVectorMap({
    layers: {
      dataSource: DevExpress.viz.map.sources.world,
    },
    bounds: [-180, 85, 180, -60],
    onZoomFactorChanged(e) {
      zoomFactor.option('value', e.zoomFactor.toFixed(2));
    },
    onCenterChanged(e) {
      center.option('value', `${e.center[0].toFixed(3)
      }, ${e.center[1].toFixed(3)}`);
    },
  }).dxVectorMap('instance');

  $('#switchPan').dxSwitch({
    value: true,
    onValueChanged: (e) => map.option('controlBar.panVisible', e.value),
  });

  $('#switchZoom').dxSwitch({
    value: true,
    onValueChanged: (e) => map.option('controlBar.zoomVisible', e.value),
  });

  $('#choose-continent').dxSelectBox({
    dataSource: viewportCoordinates,
    width: 210,
    displayExpr: 'continent',
    valueExpr: 'coordinates',
    value: viewportCoordinates[0].coordinates,
    inputAttr: { 'aria-label': 'Continent' },
    onValueChanged(data) {
      map.viewport(data.value);
    },
  });

  const zoomFactor = $('#zoom-factor').dxTextBox({
    width: 210,
    readOnly: true,
    inputAttr: { 'aria-label': 'Zoom' },
    value: '1.00',
  }).dxTextBox('instance');

  const center = $('#center').dxTextBox({
    width: 210,
    readOnly: true,
    inputAttr: { 'aria-label': 'Center' },
    value: '0.000, 46.036',
  }).dxTextBox('instance');
});
