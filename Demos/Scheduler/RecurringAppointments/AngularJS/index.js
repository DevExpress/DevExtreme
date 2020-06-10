var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.schedulerOptions = {
        dataSource: data,
        views: ["day", "week", "month"],
        currentView: "month",
        startDayHour: 9,
        currentDate: new Date(2017, 4, 25),
        firstDayOfWeek: 1,
        resources: [{
            fieldExpr: "roomId",
            dataSource: resourcesData,
            label: "Room"
        }],
        height: 600
    };
});