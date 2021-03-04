var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.schedulerOptions = {
        timeZone: "America/Los_Angeles",
        dataSource: data,
        views: ["day", "week", "month"],
        currentView: "month",
        startDayHour: 9,
        currentDate: new Date(2020, 10, 25),
        resources: [{
            fieldExpr: "roomId",
            dataSource: resourcesData,
            label: "Room"
        }],
        height: 600
    };
});