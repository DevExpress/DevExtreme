const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.checkBoxValue = null;
  $scope.checkBox = {
    checked: {
      value: true,
      elementAttr: {
        'aria-label': 'Checked',
      },
    },
    unchecked: {
      value: false,
      elementAttr: {
        'aria-label': 'Unchecked',
      },
    },
    indeterminate: {
      value: null,
      elementAttr: {
        'aria-label': 'Indeterminate',
      },
    },
    threeStateMode: {
      enableThreeStateBehavior: true,
      value: null,
      elementAttr: {
        'aria-label': 'Three state mode',
      },
    },
    handler: {
      bindingOptions: {
        value: 'checkBoxValue',
      },
      elementAttr: {
        'aria-label': 'Handle value change',
      },
    },
    disabled: {
      disabled: true,
      bindingOptions: {
        value: 'checkBoxValue',
      },
      elementAttr: {
        'aria-label': 'Disabled',
      },
    },
    customSize: {
      value: null,
      iconSize: 30,
      elementAttr: {
        'aria-label': 'Custom size',
      },
    },
    withText: {
      value: true,
      text: 'Label',
    },
  };
});
