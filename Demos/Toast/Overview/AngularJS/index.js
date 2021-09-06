const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.products = products;
  $scope.checkAvailable = function (data) {
    const type = data.value ? 'success' : 'error';
    const productName = data.element.parent().find('#name').text();
    const text = productName
                + (data.value ? ' is available' : ' is not available');

    DevExpress.ui.notify(text, type, 600);
  };
});
