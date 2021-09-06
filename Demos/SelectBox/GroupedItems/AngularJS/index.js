const DemoApp = angular.module('DemoApp', ['dx']);

const fromUngroupedData = new DevExpress.data.DataSource({
  store: ungroupedData,
  key: 'id',
  group: 'Category',
});

const fromPregroupedData = new DevExpress.data.DataSource({
  store: pregroupedData,
  key: 'id',
  map(item) {
    item.key = item.Category;
    item.items = item.Products;
    return item;
  },
});

DemoApp.controller('DemoController', ($scope) => {
  $scope.fromUngroupedDataOptions = {
    dataSource: fromUngroupedData,
    valueExpr: 'ID',
    grouped: true,
    displayExpr: 'Name',
  };

  $scope.fromPregroupedDataOptions = {
    dataSource: fromPregroupedData,
    valueExpr: 'ID',
    grouped: true,
    displayExpr: 'Name',
  };

  $scope.customGroupTemplateOptions = {
    dataSource: fromUngroupedData,
    valueExpr: 'ID',
    grouped: true,
    groupTemplate: 'group',
    displayExpr: 'Name',
  };
});
