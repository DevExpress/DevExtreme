const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.listOptions = {
    dataSource: employees,
    height: '100%',
    grouped: true,
    collapsibleGroups: true,
    groupTemplate(data) {
      return $(`<div>Assigned: ${data.key}</div>`);
    },
  };
});
