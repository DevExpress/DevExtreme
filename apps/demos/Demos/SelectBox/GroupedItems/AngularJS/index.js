const DemoApp = angular.module('DemoApp', ['dx']);

const fromUngroupedData = new DevExpress.data.DataSource({
  store: {
    type: 'array',
    data: ungroupedData,
    key: 'ID',
  },
  group: 'Category',
});

const fromPregroupedData = new DevExpress.data.DataSource({
  store: {
    type: 'array',
    data: pregroupedData,
    key: 'ID',
  },
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
