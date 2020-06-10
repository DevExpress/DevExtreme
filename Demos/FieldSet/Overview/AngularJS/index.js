var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.addressTextBoxOptions = {
        value: '424 N Main St.'
    };

    $scope.cityTextBoxOptions = {
        value: 'San Diego'
    };

    $scope.notesTextAreaOptions = {
        height: 80,
        value: 'Kevin is our hard-working shipping manager and has been helping that department work like clockwork for 18 months. When not in the office, he is usually on the basketball court playing pick-up games.'
    }
});