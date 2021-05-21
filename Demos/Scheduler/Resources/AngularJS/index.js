var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.selectedResource = resourcesList[0];
    $scope.resources = [{
        fieldExpr: "roomId",
        allowMultiple: true,
        dataSource: rooms,
        label: "Room"
    }, {
        fieldExpr: "priorityId",
        allowMultiple: true,
        dataSource: priorities,
        label: "Priority"
    }, {
        fieldExpr: "ownerId",
        allowMultiple: true,
        dataSource: owners,
        label: "Owner"
    }];

    $scope.schedulerOptions = {
        timeZone: "America/Los_Angeles",
        bindingOptions: {
            resources: {
                deep: true,
                dataPath: 'resources'
            },
            "resources[0].useColorAsDefault": "selectedResource === 'Room'",
            "resources[1].useColorAsDefault": "selectedResource === 'Priority'",
            "resources[2].useColorAsDefault": "selectedResource === 'Owner'"
        },
        dataSource: data,
        views: ["workWeek"],
        currentView: "workWeek",
        currentDate: new Date(2021, 3, 27),
        startDayHour: 9,
        endDayHour: 19,
        height: 600
    };

    $scope.resourcesSelectorOptions = {
        bindingOptions: {
            value: "selectedResource"
        },
        items: resourcesList,
        layout: "horizontal"
    };
});