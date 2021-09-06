const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.date = new Date(2020, 4, 3);

  $scope.validateClick = function (e) {
    const result = e.validationGroup.validate();
    if (result.isValid) {
      DevExpress.ui.notify('The task was saved successfully.', 'success');
    } else {
      DevExpress.ui.notify('The task was not saved. Please check if all fields are valid.', 'error');
    }
  };

  $scope.stylingMode = 'filled';

  setTimeout(() => {
    DevExpress.validationEngine.validateGroup($scope);
  });
});
