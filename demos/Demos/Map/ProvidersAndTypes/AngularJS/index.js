const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
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
  $scope.type = mapTypes[0].key;
  $scope.mapOptions = {
    apiKey: {
      bing: 'Aq3LKP2BOmzWY47TZoT1YdieypN_rB6RY9FqBfx-MDCKjvvWBbT68R51xwbL-AqC',
    },
    center: '40.7061, -73.9969',
    zoom: 14,
    height: 400,
    width: '100%',
    provider: 'bing',
    bindingOptions: {
      type: 'type',
    },
  };
  $scope.chooseTypeOptions = {
    dataSource: mapTypes,
    displayExpr: 'name',
    valueExpr: 'key',
    bindingOptions: {
      value: 'type',
    },
  };
});
