const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.checkBoxValue = null;
  $scope.checkBox = {
    checked: {
      value: true,
    },
    unchecked: {
      value: false,
    },
    indeterminate: {
      value: null,
    },
    threeStateMode: {
      enableThreeStateBehavior: true,
      value: null,
    },
    handler: {
      bindingOptions: {
        value: 'checkBoxValue',
      },
    },
    disabled: {
      disabled: true,
      bindingOptions: {
        value: 'checkBoxValue',
      },
    },
    customSize: {
      value: null,
      iconSize: 30,
    },
    withText: {
      value: true,
      text: 'Label',
    },
  };
});
