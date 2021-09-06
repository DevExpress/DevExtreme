const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.currentColor = '#f05b41';
  $scope.colorBox = {
    simple: {
      value: '#f05b41',
    },
    editAlphaChannel: {
      value: '#f05b41',
      editAlphaChannel: true,
    },
    editButtonText: {
      value: '#f05b41',
      applyButtonText: 'Apply',
      cancelButtonText: 'Decline',
    },
    readOnly: {
      value: '#f05b41',
      readOnly: true,
    },
    disabled: {
      value: '#f05b41',
      disabled: true,
    },
    withChangeValue: {
      applyValueMode: 'instantly',
      bindingOptions: {
        value: 'currentColor',
      },
    },
  };
});
