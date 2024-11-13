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

  const mapProviders = ['Azure', 'Bing', 'Google'];

  const map = $('#map').dxMap({
    center: '40.7061, -73.9969',
    zoom: 14,
    height: 400,
    width: '100%',
    provider: 'azure',
    apiKey: {
      azure: '6N8zuPkBsnfwniNAJkldM3cUgm3lXg3y9gkIKy59benICnnepK4DJQQJ99AIACYeBjFllM6LAAAgAZMPGFXE',
      bing: 'Aq3LKP2BOmzWY47TZoT1YdieypN_rB6RY9FqBfx-MDCKjvvWBbT68R51xwbL-AqC',
      google: 'AIzaSyBIw1-l1otL9v1bY-OR4p9w21l1VLu9L2k',
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

  $('#choose-provider').dxSelectBox({
    dataSource: mapProviders,
    inputAttr: { 'aria-label': 'Map Provider' },
    value: mapProviders[0],
    onValueChanged({ value }) {
      map.option('provider', value.toLowerCase());
    },
  });
});
