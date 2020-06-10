var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.searchValue = "";
    $scope.productName = "",
    $scope.productPrice = "",
    $scope.productImage = "";
    
    $scope.treeViewOptions = {
        items: products,
        width: 300,
        onItemClick: function(e) {
            var item = e.itemData;
            $scope.productName = item.text;
            $scope.productImage = item.image;
            $scope.productPrice = item.price ? "$" + item.price : "";
        }
    };
});