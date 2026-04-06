$(() => {
  $('#map-container').dxVectorMap({
    title: {
      text: 'Map of Pangaea',
      subtitle: 'with modern continental outlines',
    },
    maxZoomFactor: 2,
    projection: {
      to(coordinates) {
        return [coordinates[0] / 100, coordinates[1] / 100];
      },
      from(coordinates) {
        return [coordinates[0] * 100, coordinates[1] * 100];
      },
    },
    export: {
      enabled: true,
    },
    layers: [{
      dataSource: pangaeaBorders,
      hoverEnabled: false,
      name: 'pangaea',
      color: '#bb7862',
    }, {
      dataSource: pangaeaContinents,
      customize(elements) {
        $.each(elements, (_, element) => {
          element.applySettings({
            color: element.attribute('color'),
          });
        });
      },
      label: {
        enabled: true,
        dataField: 'name',
      },
      name: 'continents',
    }],
  });
});
