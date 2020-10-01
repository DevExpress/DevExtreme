var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.schedulerOptions = {
        dataSource: data,
        views: ["agenda"],
        currentView: "agenda",
        startDayHour: 9,
        currentDate: new Date(2021, 4, 11),
        height: 600
    };
});