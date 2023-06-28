const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.selectedEmployee = 'none';

  $scope.lookupOptions = {
    items: employees,
    displayExpr(item) {
      if (!item) {
        return '';
      }

      return `${item.FirstName} ${item.LastName}`;
    },
    dropDownOptions: {
      showTitle: false,
    },
    placeholder: 'Select employee',
    inputAttr: {
      'aria-label': 'Lookup',
    },
    onValueChanged(data) {
      $scope.selectedEmployee = data.value;
    },
  };
});
