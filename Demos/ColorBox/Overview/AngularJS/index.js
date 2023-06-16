const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.currentColor = '#f05b41';
  $scope.colorBox = {
    simple: {
      value: '#f05b41',
      inputAttr: {
        'aria-label': 'Default mode',
      },
    },
    editAlphaChannel: {
      value: '#f05b41',
      editAlphaChannel: true,
      inputAttr: {
        'aria-label': 'With alpha channel editing',
      },
    },
    editButtonText: {
      value: '#f05b41',
      applyButtonText: 'Apply',
      cancelButtonText: 'Decline',
      inputAttr: {
        'aria-label': 'Custom button captions',
      },
    },
    readOnly: {
      value: '#f05b41',
      readOnly: true,
      inputAttr: {
        'aria-label': 'Read only',
      },
    },
    disabled: {
      value: '#f05b41',
      disabled: true,
      inputAttr: {
        'aria-label': 'Disabled',
      },
    },
    withChangeValue: {
      applyValueMode: 'instantly',
      inputAttr: {
        'aria-label': 'Event Handling',
      },
      bindingOptions: {
        value: 'currentColor',
      },
    },
  };
});
