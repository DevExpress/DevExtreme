$(() => {
  const map = $('#map').dxMap({
    provider: 'azure',
    apiKey: {
      azure: '6N8zuPkBsnfwniNAJkldM3cUgm3lXg3y9gkIKy59benICnnepK4DJQQJ99AIACYeBjFllM6LAAAgAZMPGFXE',
    },
    zoom: 14,
    height: 440,
    width: '100%',
    controls: true,
    markers: [{
      location: '40.7825, -73.966111',
    }, {
      location: [40.755833, -73.986389],
    }, {
      location: { lat: 40.753889, lng: -73.981389 },
    }, {
      location: 'City Hall Park,New York,NY',
    },
    ],
    routes: [
      {
        weight: 6,
        color: 'blue',
        opacity: 0.5,
        mode: '',
        locations: [
          [40.782500, -73.966111],
          [40.755833, -73.986389],
          [40.753889, -73.981389],
          'City Hall Park,New York,NY',
        ],

      },
    ],
  }).dxMap('instance');

  $('#choose-mode').dxSelectBox({
    dataSource: ['driving', 'walking'],
    inputAttr: { 'aria-label': 'Mode' },
    value: 'driving',
    onValueChanged(data) {
      map.option('routes', [$.extend({}, map.option('routes')[0], {
        mode: data.value,
      })]);
    },
  });

  $('#choose-color').dxSelectBox({
    dataSource: ['blue', 'green', 'red'],
    inputAttr: { 'aria-label': 'Color' },
    value: 'blue',
    onValueChanged(data) {
      map.option('routes', [$.extend({}, map.option('routes')[0], {
        color: data.value,
      })]);
    },
  });
});
