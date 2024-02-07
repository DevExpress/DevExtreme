const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  let filterBuilderInstance;

  $scope.listFilter = null;

  $scope.filterBuilderOptions = {
    fields,
    value: filter,
    onInitialized(e) {
      filterBuilderInstance = e.component;
      $scope.listFilter = filterBuilderInstance.getFilterExpression();
    },
  };

  $scope.buttonOptions = {
    text: 'Apply Filter',
    type: 'default',
    onClick() {
      $scope.listFilter = filterBuilderInstance.getFilterExpression();
    },
  };

  $scope.listOptions = {
    dataSource: {
      store: products,
    },
    height: '100%',
    bindingOptions: {
      'dataSource.filter': 'listFilter',
    },
  };
});
