const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.lookupOptions = {
    dropDownOptions: {
      showTitle: false,
    },
    items: employeesList,
    value: employeesList[0],
    inputAttr: {
      'aria-label': 'Simple lookup',
    },
  };

  $scope.lookupGroupedOptions = {
    dataSource: new DevExpress.data.DataSource({
      store: employeesTasks,
      key: 'ID',
      group: 'Assigned',
    }),
    dropDownOptions: {
      hideOnOutsideClick: true,
      showTitle: false,
    },
    grouped: true,
    displayExpr: 'Subject',
    inputAttr: {
      'aria-label': 'Grouped lookup',
    },
  };
});
