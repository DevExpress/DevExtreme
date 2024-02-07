const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.doneButton = {
    icon: 'check',
    type: 'success',
    text: 'Done',
    onClick() {
      DevExpress.ui.notify('The Done button was clicked');
    },
  };

  $scope.weatherButton = {
    icon: '../../../../images/icons/weather.png',
    text: 'Weather',
    onClick() {
      DevExpress.ui.notify('The Weather button was clicked');
    },
  };

  $scope.sendButton = {
    icon: 'fa fa-envelope-o',
    text: 'Send',
    onClick() {
      DevExpress.ui.notify('The Send button was clicked');
    },
  };

  $scope.plusButton = {
    icon: 'plus',
    onClick() {
      DevExpress.ui.notify('The button was clicked');
    },
  };

  $scope.backButton = {
    icon: 'back',
    onClick() {
      DevExpress.ui.notify('The button was clicked');
    },
  };

  $scope.doneDisabledButton = {
    icon: 'check',
    type: 'success',
    text: 'Done',
    disabled: true,
  };

  $scope.weatherDisabledButton = {
    icon: '../../../../images/icons/weather.png',
    text: 'Weather',
    disabled: true,
  };

  $scope.sendDisabledButton = {
    icon: 'fa fa-envelope-o',
    text: 'Send',
    disabled: true,
  };

  $scope.plusDisabledButton = {
    icon: 'plus',
    disabled: true,
  };

  $scope.backDisabledButton = {
    icon: 'back',
    disabled: true,
  };
});
