var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.currentLocation = locations[0].timeZoneId;

    $scope.schedulerOptions = {
        bindingOptions: {
            timeZone: "currentLocation"
        },
        dataSource: data,
        views: ["workWeek"],
        currentView: "workWeek",
        currentDate: new Date(2017, 4, 25),
        height: 600,
        editing: {
            allowTimeZoneEditing: true
        }
    };

    $scope.locationSwitcherOptions = {
        bindingOptions: {
            value: "currentLocation"
        },
        items: locations,
        displayExpr: "text",
        valueExpr: "timeZoneId",
        width: 240
    };
});
