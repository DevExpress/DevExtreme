const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.colCountByScreen = {
    md: 4,
    sm: 2,
  };

  $scope.formOptions = {
    formData: employee,
    labelLocation: 'top',
    minColWidth: 233,
    colCount: 'auto',
    screenByWidth(width) {
      return width < 720 ? 'sm' : 'md';
    },
    bindingOptions: {
      colCountByScreen: 'colCountByScreen',
    },
  };

  $scope.useColCountByScreen = {
    onValueChanged(e) {
      if (e.value) {
        $scope.colCountByScreen.sm = null;
        $scope.colCountByScreen.md = null;
      } else {
        $scope.colCountByScreen.sm = 2;
        $scope.colCountByScreen.md = 4;
      }
    },
    text: 'Calculate the number of columns automatically',
    value: false,
  };
});
