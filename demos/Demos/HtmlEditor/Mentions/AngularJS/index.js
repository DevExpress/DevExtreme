const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.htmlEditorOptions = {
    mentions: [{
      dataSource: employees,
      searchExpr: 'text',
      displayExpr: 'text',
      valueExpr: 'text',
    }],
  };
});
