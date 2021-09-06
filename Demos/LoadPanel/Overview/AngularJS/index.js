const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.employeeInfo = {};
  $scope.loadingVisible = false;
  $scope.closeOnOutsideClick = false;
  $scope.showIndicator = true;
  $scope.showPane = true;
  $scope.shading = true;

  $scope.loadOptions = {
    shadingColor: 'rgba(0,0,0,0.4)',
    position: { of: '#employee' },
    bindingOptions: {
      visible: 'loadingVisible',
      showIndicator: 'showIndicator',
      showPane: 'showPane',
      shading: 'shading',
      closeOnOutsideClick: 'closeOnOutsideClick',
    },
    onShown() {
      setTimeout(() => {
        $scope.$apply(() => {
          $scope.loadingVisible = false;
        });
      }, 3000);
    },
    onHidden() {
      $scope.employeeInfo = employee;
    },
  };

  $scope.showLoadPanel = function () {
    $scope.employeeInfo = {};
    $scope.loadingVisible = true;
  };
});
