const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.date = new Date(1981, 6, 3);

  $scope.validateClick = function (e) {
    const result = e.validationGroup.validate();
    if (result.isValid) {
      DevExpress.ui.notify('The task was saved successfully.', 'success');
    } else {
      DevExpress.ui.notify('The task was not saved. Please check if all fields are valid.', 'error');
    }
  };

  $scope.stylingMode = 'filled';
  $scope.labelMode = 'static';
  $scope.phoneRules = { X: /[02-9]/ };
});
