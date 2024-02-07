$(() => {
  const mapTypes = [{
    key: 'roadmap',
    name: 'Road Map',
  }, {
    key: 'satellite',
    name: 'Satellite (Photographic) Map',
  }, {
    key: 'hybrid',
    name: 'Hybrid Map',
  }];

  const map = $('#map').dxMap({
    center: '40.7061, -73.9969',
    zoom: 14,
    height: 400,
    width: '100%',
    provider: 'bing',
    apiKey: {
      bing: 'Aq3LKP2BOmzWY47TZoT1YdieypN_rB6RY9FqBfx-MDCKjvvWBbT68R51xwbL-AqC',
    },
    type: mapTypes[0].key,
  }).dxMap('instance');

  $('#choose-type').dxSelectBox({
    dataSource: mapTypes,
    inputAttr: { 'aria-label': 'Map Type' },
    displayExpr: 'name',
    valueExpr: 'key',
    value: mapTypes[0].key,
    onValueChanged(data) {
      map.option('type', data.value);
    },
  });
});
