var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.currentHotel = data[0];
    $scope.dataSource = dataSource;

    $scope.listSelectionChanged = function(e) {
        $scope.currentHotel = e.addedItems[0];
    };
});
