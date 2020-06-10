var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.scheduler = null;
    $scope.schedulerOptions = {
        dataSource: data,
        views: ["week", "month"],
        adaptivityEnabled: true,
        currentView: "month",
        startDayHour: 9,
        currentDate: new Date(2017, 4, 25),
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
        scheduler.showAppointmentPopup(createAppointmentPopupData());
    }
    
    function createAppointmentPopupData() {
        var scheduler = $('#scheduler').dxScheduler('instance');
        var currentDate = scheduler.option('currentDate');
        var cellDuration = scheduler.option('cellDuration');
        
        return {
            startDate: new Date(currentDate),
            endDate: new Date(currentDate.setMinutes(cellDuration))
        };
    }
});
