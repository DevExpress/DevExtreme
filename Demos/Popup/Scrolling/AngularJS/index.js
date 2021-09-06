const DemoApp = angular.module('DemoApp', ['dx', 'ngSanitize']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.content = longText;

  $scope.popupOptions = {
    width: 550,
    height: 350,
    visible: true,
    showTitle: false,
    closeOnOutsideClick: false,
  };

  $scope.scrollViewOptions = {
    width: '100%',
    height: '100%',
  };
});
