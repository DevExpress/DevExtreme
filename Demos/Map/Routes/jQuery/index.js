$(() => {
  const map = $('#map').dxMap({
    provider: 'bing',
    apiKey: {
      bing: 'Aq3LKP2BOmzWY47TZoT1YdieypN_rB6RY9FqBfx-MDCKjvvWBbT68R51xwbL-AqC',
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
      location: 'Brooklyn Bridge,New York,NY',
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
          'Brooklyn Bridge,New York,NY',
        ],

      },
    ],
  }).dxMap('instance');

  $('#choose-mode').dxSelectBox({
    dataSource: ['driving', 'walking'],
    value: 'driving',
    onValueChanged(data) {
      map.option('routes', [$.extend({}, map.option('routes')[0], {
        mode: data.value,
      })]);
    },
  });

  $('#choose-color').dxSelectBox({
    dataSource: ['blue', 'green', 'red'],
    value: 'blue',
    onValueChanged(data) {
      map.option('routes', [$.extend({}, map.option('routes')[0], {
        color: data.value,
      })]);
    },
  });
});
