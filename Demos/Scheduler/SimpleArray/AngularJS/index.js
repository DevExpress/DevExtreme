var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.schedulerOptions = {
        dataSource: data,
        views: ["week", "month"],
        currentView: "week",
        startDayHour: 9,
        currentDate: new Date(2021, 4, 25),
        height: 600
    };
});