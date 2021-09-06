const DemoApp = angular.module('DemoApp', ['dx']);

const products = new DevExpress.data.DataSource({
  store: productsData,
  key: 'id',
  group: 'Category',
});

DemoApp.controller('DemoController', ($scope) => {
  $scope.TagBoxOptions = {
    dataSource: products,
    valueExpr: 'ID',
    value: [productsData[16].ID, productsData[18].ID],
    grouped: true,
    displayExpr: 'Name',
  };

  $scope.searchTagBoxOptions = {
    dataSource: products,
    valueExpr: 'ID',
    value: [productsData[16].ID, productsData[18].ID],
    searchEnabled: true,
    grouped: true,
    displayExpr: 'Name',
  };

  $scope.templateTagBoxOptions = {
    dataSource: products,
    valueExpr: 'ID',
    value: [productsData[17].ID],
    grouped: true,
    groupTemplate: 'group',
    displayExpr: 'Name',
  };
});
