var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.schedulerOptions = {
        timeZone: "America/Los_Angeles",
        dataSource: data,
        views: ["week", "month"],
        currentView: "week",
        startDayHour: 9,
        currentDate: new Date(2021, 2, 28),
        height: 600
    };
});