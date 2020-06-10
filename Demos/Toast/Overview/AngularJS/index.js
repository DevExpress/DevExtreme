var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.products = products;
    $scope.checkAvailable = function(data) {
        var type = data.value ? "success" : "error",
            productName = data.element.parent().find("#name").text(),
            text = productName + 
                (data.value ? " is available" : " is not available");
    
        DevExpress.ui.notify(text, type, 600);
    };
});