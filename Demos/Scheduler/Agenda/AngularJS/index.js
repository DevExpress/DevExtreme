var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.resources = [{
        fieldExpr: "ownerId",
        allowMultiple: true,
        dataSource: owners,
        label: "Owner",
        useColorAsDefault: true
    }, {
        fieldExpr: "priorityId",
        allowMultiple: true,
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