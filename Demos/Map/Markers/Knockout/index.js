window.onload = function () {
  const markerUrl = 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/maps/map-marker.png';
  const markerUrlValue = ko.observable(markerUrl);
  const markersData = [{
    location: [40.755833, -73.986389],
    tooltip: {
      text: 'Times Square',
      isShown: false,
    },
  }, {
    location: '40.7825, -73.966111',
    tooltip: {
      text: 'Central Park',
      isShown: false,
    },
  }, {
    location: { lat: 40.753889, lng: -73.981389 },
    tooltip: {
      text: 'Fifth Avenue',
      isShown: false,
    },
  }, {
    location: 'Brooklyn Bridge,New York,NY',
    tooltip: {
      text: 'Brooklyn Bridge',
      isShown: false,
    },
  },
  ];
  const markers = ko.observableArray(markersData);

  const viewModel = {
    mapOptions: {
      provider: 'bing',
      zoom: 11,
      height: 440,
      width: '100%',
      controls: true,
      markerIconSrc: markerUrlValue,
      markers,
    },
    useCustomMarkersOptions: {
      value: true,
      text: 'Use custom marker icons',
      onValueChanged(data) {
        markers(markersData);
        markerUrlValue(data.value ? markerUrl : null);
      },
    },
    showTooltipsOptions: {
      text: 'Show all tooltips',
      onClick() {
        markers(markersData.map((item) => $.extend(
          true,
          {},
          item,
          { tooltip: { isShown: true } },
        )));
      },
    },
  };

  ko.applyBindings(viewModel, document.getElementById('map-demo'));
};
