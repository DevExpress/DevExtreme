const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  const scale = {
    startValue: 0,
    endValue: 100,
    tickInterval: 50,
    label: {
      customizeText(arg) {
        return `${arg.valueText} %`;
      },
    },
  };

  $scope.rectangleIndicator = {
    scale,
    value: 75,
    valueIndicator: {
      type: 'rectangle',
      color: '#9B870C',
    },
  };

  $scope.rhombusIndicator = {
    scale,
    value: 80,
    valueIndicator: {
      type: 'rhombus',
      color: '#779ECB',
    },
  };

  $scope.circleIndicator = {
    scale,
    value: 65,
    valueIndicator: {
      type: 'circle',
      color: '#8FBC8F',
    },
  };

  $scope.rangebarIndicator = {
    scale,
    value: 90,
    valueIndicator: {
      type: 'rangebar',
      color: '#483D8B',
    },
  };

  $scope.textCloudIndicator = {
    scale,
    value: 70,
    valueIndicator: {
      type: 'textCloud',
      color: '#734F96',
    },
  };

  $scope.triangleMarkerIndicator = {
    scale,
    value: 85,
    valueIndicator: {
      type: 'triangleMarker',
      color: '#f05b41',
    },
  };
});
