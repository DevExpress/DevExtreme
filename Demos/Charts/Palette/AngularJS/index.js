const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.palette = paletteCollection[0];
  $scope.paletteExtensionMode = 'Blend';
  $scope.baseColors = [];

  $scope.chartOptions = {
    dataSource,
    series: {},
    legend: {
      visible: false,
    },
    bindingOptions: {
      palette: 'palette',
      paletteExtensionMode: 'paletteExtensionMode',
    },
    onDrawn(e) {
      const paletteName = e.component.option('palette');
      const palette = DevExpress.viz.getPalette(paletteName).simpleSet;

      $scope.baseColors = palette;
    },
  };

  $scope.paletteSelectBoxOptions = {
    items: paletteCollection,
    bindingOptions: {
      value: 'palette',
    },
  };

  $scope.extensionModeSelectBoxOptions = {
    items: paletteExtensionModes,
    bindingOptions: {
      value: 'paletteExtensionMode',
    },
  };
});
