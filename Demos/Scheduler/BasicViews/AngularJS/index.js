var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.schedulerOptions = {
        timeZone: "America/Los_Angeles",
        dataSource: data,
        views: ["day", "week", "workWeek", "month"],
        currentView: "day",
        startDayHour: 9,
        currentDate: new Date(2021, 3, 29),
        height: 600
    };
});