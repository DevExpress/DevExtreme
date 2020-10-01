var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.schedulerOptions = {
        dataSource: data,
        views: ["day", "week", "workWeek", "month"],
        currentView: "day",
        startDayHour: 9,
        currentDate: new Date(2021, 4, 27),
        height: 600
    };
});