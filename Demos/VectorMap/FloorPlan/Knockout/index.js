window.onload = function () {
  const viewModel = {
    vectorMapOptions: {
      maxZoomFactor: 4,
      projection: {
        to(coordinates) {
          return [coordinates[0] / 100, coordinates[1] / 100];
        },

        from(coordinates) {
          return [coordinates[0] * 100, coordinates[1] * 100];
        },
      },
      layers: [{
        hoverEnabled: false,
        dataSource: buildingData,
        name: 'building',
      }, {
        color: 'transparent',
        borderWidth: 1,
        label: {
          enabled: true,
          dataField: 'name',
        },
        dataSource: roomsData,
        name: 'rooms',
      }],
      tooltip: {
        enabled: true,
        customizeTooltip(arg) {
          if (arg.layer.name === 'rooms') {
            return { text: `Square: ${arg.attribute('square')} ft&#178` };
          }
          return null;
        },
      },
    },
  };

  ko.applyBindings(viewModel, $('#vector-map-demo').get(0));
};
