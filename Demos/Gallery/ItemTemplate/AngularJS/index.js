var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.galleryOptions = {
        dataSource: gallery,
        height: 440,
        width: "100%",
        loop: true,
        showIndicator: false
    };
});