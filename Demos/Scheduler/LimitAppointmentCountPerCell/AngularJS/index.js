var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.schedulerOptions = {
        timeZone: "America/Los_Angeles",
        dataSource: data,
        views: [{
            type: "month",
            name: "Auto Mode",
            maxAppointmentsPerCell: "auto"
        }, {
            type: "month",
            name: "Unlimited Mode",
            maxAppointmentsPerCell: "unlimited"
        }, {
            type: "month",
            name: "Numeric Mode",
            maxAppointmentsPerCell: 2
        }],
        currentView: "Auto Mode",
        currentDate: new Date(2021, 4, 25),
        resources: [{
            fieldExpr: "roomId",
            dataSource: resourcesData,
            label: "Room"
        }],
        height: 650
    };
});