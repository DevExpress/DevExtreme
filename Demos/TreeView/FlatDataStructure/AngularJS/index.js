var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.productName = "",
    $scope.productPrice = "",
    $scope.productImage = "";

    $scope.treeViewOptions = {
        items: products,
        dataStructure: "plain",
        parentIdExpr: "categoryId",
        keyExpr: "ID",
        displayExpr: "name",
        width: 300,
        onItemClick: function(e) {
            var item = e.itemData;
            if(item.price) {
                $scope.productName = item.name;
                $scope.productPrice = "$" + item.price;
                $scope.productImage = item.icon;
            } else {
                $scope.productPrice = "";
            }
        }
    }; 
});