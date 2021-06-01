var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.resources = [{
        fieldExpr: "assigneeId",
        allowMultiple: true,
        dataSource: assignees,
        label: "Assignee",
        useColorAsDefault: true
    }, {
        fieldExpr: "priorityId",
        dataSource: priorities,
        label: "Priority"
    }];

    $scope.schedulerOptions = {
        timeZone: "America/Los_Angeles",
        bindingOptions: {
            resources: {
                deep: true,
                dataPath: 'resources'
            }
        },
        dataSource: data,
        views: ["agenda"],
        currentView: "agenda",
        startDayHour: 9,
        currentDate: new Date(2021, 4, 11),
        height: 600
    };
});