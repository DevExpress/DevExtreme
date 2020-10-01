var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.scheduler = null;
    $scope.schedulerOptions = {
        dataSource: data,
        views: ["week", "month"],
        adaptivityEnabled: true,
        currentView: "month",
        startDayHour: 9,
        currentDate: new Date(2021, 4, 25),
        height: 590,
        resources: [{
            fieldExpr: "priorityId",
            dataSource: priorities,
            label: "Priority"
        }],
    };

    $scope.speedDialActionOptions = {
        icon: "plus",
        onClick: showAppointmentPopup
    }

    function showAppointmentPopup() {
        var scheduler = $('#scheduler').dxScheduler('instance');
        scheduler.showAppointmentPopup();
    }
});
