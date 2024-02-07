const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.dataGridOptions = {
    dataSource: generateData(100000),
    keyExpr: 'id',
    showBorders: true,
    customizeColumns(columns) {
      columns[0].width = 70;
    },
    loadPanel: {
      enabled: true,
    },
    scrolling: {
      mode: 'virtual',
    },
    sorting: {
      mode: 'none',
    },
    onContentReady(e) {
      e.component.option('loadPanel.enabled', false);
    },
  };
});
