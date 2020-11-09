var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.schedulerOptions = {
        timeZone: "America/Los_Angeles",
        dataSource: data,
        views: [
            { name: "3 Days", type: "day", intervalCount: 3, startDate: new Date(2021, 3, 4) },
            { name: "2 Work Weeks", type: "workWeek", intervalCount: 2, startDate: new Date(2021, 2, 4) },
            { name: "2 Months", type: "month", intervalCount: 2 }
        ],
        currentView: "day",
        currentDate: new Date(2021, 3, 5),
        startDayHour: 8,
        endDayHour: 20,
        height: 580
    };
});