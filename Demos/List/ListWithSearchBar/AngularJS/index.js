const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.searchMode = 'contains';

  $scope.listOptions = {
    bindingOptions: {
      searchMode: 'searchMode',
    },
    dataSource: products,
    height: 400,
    searchEnabled: true,
    searchExpr: 'Name',
    itemTemplate(data) {
      return $('<div>').text(data.Name);
    },
  };

  $scope.searchModeOptions = {
    bindingOptions: {
      value: 'searchMode',
    },
    dataSource: ['contains', 'startsWith', 'equals'],
  };
});
