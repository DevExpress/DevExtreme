const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.searchValue = '';
  $scope.productName = '';
  $scope.productPrice = '';
  $scope.productImage = '';

  $scope.treeViewOptions = {
    items: products,
    width: 300,
    onItemClick(e) {
      const item = e.itemData;
      $scope.productName = item.text;
      $scope.productImage = item.image;
      $scope.productPrice = item.price ? `$${item.price}` : '';
    },
  };
});
