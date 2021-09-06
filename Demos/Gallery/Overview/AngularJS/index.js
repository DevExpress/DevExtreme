const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.loop = true;
  $scope.slideShow = true;
  $scope.showNavButtons = true;
  $scope.showIndicator = true;
  $scope.slideshowDelay = 2000;

  $scope.galleryOptions = {
    dataSource: gallery,
    height: 300,
    bindingOptions: {
      slideshowDelay: 'slideshowDelay',
      loop: 'loop',
      showNavButtons: 'showNavButtons',
      showIndicator: 'showIndicator',
    },
  };

  $scope.$watch('slideShow', (newValue) => {
    $scope.slideshowDelay = newValue ? 2000 : 0;
  });
});
