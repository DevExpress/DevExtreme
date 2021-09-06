const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  const resizingModes = ['nextColumn', 'widget'];

  $scope.columnResizingMode = resizingModes[0];

  $scope.dataGridOptions = {
    dataSource: customers,
    keyExpr: 'ID',
    allowColumnResizing: true,
    showBorders: true,
    columnMinWidth: 50,
    columnAutoWidth: true,
    columns: ['CompanyName', 'City', 'State', 'Phone', 'Fax'],
    bindingOptions: {
      columnResizingMode: 'columnResizingMode',
    },
  };

  $scope.resizingOptions = {
    items: resizingModes,
    width: 250,
    onValueChanged(data) {
      $scope.columnResizingMode = data.value;
    },
    bindingOptions: {
      value: 'columnResizingMode',
    },
  };
});
