window.onload = function () {
  const RADIANS = Math.PI / 180;
  const WAGNER_6_P_LAT = Math.PI / Math.sqrt(3);
  const WAGNER_6_U_LAT = 2 / Math.sqrt(3) - 0.1;

  const customProjection = {
    aspectRatio: 2,

    to(coordinates) {
      const x = coordinates[0] * RADIANS;
      const y = Math.min(Math.max(coordinates[1] * RADIANS, -WAGNER_6_P_LAT), +WAGNER_6_P_LAT);
      const t = y / Math.PI;
      return [
        (x / Math.PI) * Math.sqrt(1 - 3 * t * t),
        (y * 2) / Math.PI,
      ];
    },

    from(coordinates) {
      const x = coordinates[0];
      const y = Math.min(Math.max(coordinates[1], -WAGNER_6_U_LAT), +WAGNER_6_U_LAT);
      const t = y / 2;
      return [
        (x * Math.PI) / Math.sqrt(1 - 3 * t * t) / RADIANS,
        (y * Math.PI) / 2 / RADIANS,
      ];
    },
  };

  const viewModel = {
    vectorMapOptions: {
      projection: customProjection,
      title: 'Wagner VI projection',
      export: {
        enabled: true,
      },
      layers: [{
        dataSource: DevExpress.viz.map.sources.world,
      }, {
        color: '#aaa',
        borderWidth: 1,
        hoverEnabled: false,
        dataSource: coordLinesData,
      }],
    },
  };

  ko.applyBindings(viewModel, $('#vector-map-demo').get(0));
};
