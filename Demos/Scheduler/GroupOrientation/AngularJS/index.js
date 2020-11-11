var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.options = {
        timeZone: "America/Los_Angeles",
        dataSource: data,
        views: [{
            type: "workWeek",
            name: "Vertical Grouping",
            groupOrientation: "vertical",
            cellDuration: 60,
            intervalCount: 2
        }, {
            type: "workWeek",
            name: "Horizontal Grouping",
            groupOrientation: "horizontal",
            cellDuration: 30,
            intervalCount: 2
        }],
        currentView: "Vertical Grouping",
        crossScrollingEnabled: true,
        currentDate: new Date(2021, 4, 21),
        startDayHour: 9,
        endDayHour: 16,
        groups: ["priorityId"],
        resources: [
            {
                fieldExpr: "priorityId",
                allowMultiple: false,
                dataSource: priorityData,
                label: "Priority"
            }
        ],
        showCurrentTimeIndicator: false,
        showAllDayPanel: false
    };
});