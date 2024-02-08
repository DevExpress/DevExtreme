const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  const totalProductQuantity = 30;

  $scope.salesValue = 16;
  $scope.stockValue = 14;

  $scope.withButtons = {
    value: 20.5,
    showSpinButtons: true,
    showClearButton: true,
  };

  $scope.disabled = {
    value: 20.5,
    showSpinButtons: true,
    showClearButton: true,
    disabled: true,
  };

  $scope.minAndMaxOptions = {
    value: 15,
    min: 10,
    max: 20,
    showSpinButtons: true,
  };

  $scope.salesOptions = {
    max: totalProductQuantity,
    min: 0,
    showSpinButtons: true,
    bindingOptions: {
      value: 'salesValue',
    },
    onKeyDown(e) {
      const { event } = e;
      const str = event.key;
      if (/^[.,e]$/.test(str)) {
        event.preventDefault();
      }
    },
  };

  $scope.stockOptions = {
    min: 0,
    showSpinButtons: false,
    readOnly: true,
    bindingOptions: {
      value: 'stockValue',
    },
  };

  $scope.$watch('salesValue', () => {
    $scope.stockValue = totalProductQuantity - $scope.salesValue;
  });
});
