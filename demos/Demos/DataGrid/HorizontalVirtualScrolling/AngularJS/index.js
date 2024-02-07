const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  const columnCount = 500;
  const rowCount = 50;

  $scope.gridOptions = {
    dataSource: generateData(rowCount, columnCount),
    keyExpr: 'field1',
    columnWidth: 100,
    showBorders: true,
    scrolling: {
      columnRenderingMode: 'virtual',
    },
    paging: {
      enabled: false,
    },
  };
});
