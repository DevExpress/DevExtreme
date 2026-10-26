$(() => {
  const routeCache = new Map();

  async function calculateRoute({ locations, mode }) {
    const body = JSON.stringify({
      locations: locations.map(({ lat, lng }) => ({ lat, lon: lng })), // eslint-disable-line spellcheck/spell-checker
      costing: mode === 'walking' ? 'pedestrian' : 'auto',
      directions_type: 'none',
    });

    if (routeCache.has(body)) {
      return routeCache.get(body);
    }

    const response = await fetch('https://api-eu.stadiamaps.com/route/v1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    if (!response.ok) {
      throw new Error(`Stadia Maps routing failed: HTTP ${response.status}`);
    }

    const { trip } = await response.json();
    if (!trip?.legs?.length) {
      throw new Error('Stadia Maps returned no route.');
    }
    const format = new ol.format.Polyline({ factor: 1e6 });
    const route = {
      type: 'LineString',
      coordinates: trip.legs.flatMap((leg) => format.readGeometry(leg.shape).getCoordinates()),
    };
    routeCache.set(body, route);
    return route;
  }

  const map = $('#map').dxMap({
    provider: 'osm',
    providerConfig: {
      // Demo only: tiles are served under Developer Express Inc's Stadia Maps subscription via domain-based authentication.
      // This configuration will not work on your domain. Configure your own tile provider here.
      tileServer: {
        url: 'https://tiles-eu.stadiamaps.com/tiles/alidade_bright/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://stadiamaps.com/attribution/">Stadia Maps</a> '
          + '&copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> '
          + '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        maxZoom: 20,
      },
      calculateRoute,
    },
    zoom: 14,
    height: 440,
    width: '100%',
    controls: true,
    onReady({ originalMap }) {
      const attribution = originalMap.getControls().getArray()
        .find((control) => control instanceof ol.control.Attribution);
      originalMap.removeControl(attribution);
      originalMap.addControl(new ol.control.Attribution({ collapsible: false }));
    },
    markers: [{
      location: '40.7825, -73.966111',
      tooltip: { text: 'Central Park' },
    }, {
      location: [40.755833, -73.986389],
      iconSrc: '../../../../images/Maps/map-marker.png',
      tooltip: { text: 'Times Square' },
      onClick({ tooltip }) {
        tooltip.option({
          showTitle: true,
          showCloseButton: true,
          wrapperAttr: {
            class: 'dx-map-marker-popover compact-marker-tooltip',
          },
        });
      },
    }, {
      location: { lat: 40.753889, lng: -73.981389 },
      tooltip: { text: 'Fifth Avenue' },
    }, {
      location: [40.713474, -74.005536],
      tooltip: { text: 'City Hall Park' },
    }],
    routes: [{
      weight: 6,
      color: 'blue',
      opacity: 0.5,
      mode: 'walking',
      locations: [
        [40.7825, -73.966111],
        [40.755833, -73.986389],
        [40.753889, -73.981389],
        [40.713474, -74.005536],
      ],
    }],
  }).dxMap('instance');

  $('#choose-mode').dxSelectBox({
    dataSource: ['driving', 'walking'],
    inputAttr: { 'aria-label': 'Mode' },
    value: 'walking',
    onValueChanged({ value }) {
      map.option('routes', [{ ...map.option('routes')[0], mode: value }]);
    },
  });

  $('#choose-color').dxSelectBox({
    dataSource: ['blue', 'green', 'red'],
    inputAttr: { 'aria-label': 'Route color' },
    value: 'blue',
    onValueChanged({ value }) {
      map.option('routes', [{ ...map.option('routes')[0], color: value }]);
    },
  });
});
