var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.passwordMode = "password";

    $scope.changePasswordMode = function() {
        if($scope.passwordMode === "text") {
            $scope.passwordMode = "password";
        } else {
            $scope.passwordMode = "text";
        }
    };

    $scope.format = "$ #.##";
    $scope.priceValue = 14500.55;

    $scope.currencyOnInitialized = function(e) {
        $scope.currencyInstance = e.component;
    };

    $scope.changeCurrency = function() {
        if($scope.currencyInstance.option("text") === "$") {
            $scope.currencyInstance.option("text", "€");
            $scope.format = "$ #.##";
            $scope.priceValue /= 0.891;
        } else {
            $scope.currencyInstance.option("text", "$");
            $scope.format = "€ #.##";
            $scope.priceValue *= 0.891;
        }
    };

    var millisecondsInDay = 24 * 60 * 60 * 1000;
    $scope.currentDate = new Date().getTime();

    $scope.today = function() {
        $scope.currentDate = new Date().getTime();
    };

    $scope.nextDate = function() {
        $scope.currentDate += millisecondsInDay;
    };

    $scope.prevDate = function() {
        $scope.currentDate -= millisecondsInDay;
    };

});
