const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.vectorMapOptions = {
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
  };
});
