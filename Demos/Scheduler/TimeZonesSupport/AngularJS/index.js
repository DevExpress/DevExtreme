var DemoApp = angular.module('DemoApp', ['dx']);

getLocations = function(date) {
    const timeZones = DevExpress.utils.getTimeZones(date);
    return timeZones.filter(function(timeZone) {
        return this.locations.indexOf(timeZone.id) !== -1;
    });
};

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.currentDate = new Date(2021, 3, 27);
    $scope.demoLocations = getLocations(new Date(2021, 3, 27));
    $scope.currentLocation = $scope.demoLocations[0].id;

    $scope.schedulerOptions = {
        bindingOptions: {
            timeZone: "currentLocation"
        },
        dataSource: data,
        views: ["workWeek"],
        currentView: "workWeek",
        currentDate: new Date(2021, 3, 27),
        height: 600,
        startDayHour: 8,
        onOptionChanged: function(e) {
            if(e.name === 'currentDate') {   
                $scope.demoLocations = getLocations(e.value);
            }
        },
        onAppointmentFormOpening: function(e) {
            const form = e.form;

            const startDateTimezoneEditor = form.getEditor('startDateTimeZone');
            const endDateTimezoneEditor = form.getEditor('endDateTimeZone');
            const startDateDataSource = startDateTimezoneEditor.option('dataSource');
            const endDateDataSource = endDateTimezoneEditor.option('dataSource');

            startDateDataSource.filter(['id', 'contains', 'Europe']);
            endDateDataSource.filter(['id', 'contains', 'Europe']);

            startDateDataSource.load();
            endDateDataSource.load();
        },
        editing: {
            allowTimeZoneEditing: true
        }
    };

    $scope.locationSwitcherOptions = {
        bindingOptions: {
            value: "currentLocation",
            items: 'demoLocations'
        },
        displayExpr: "title",
        valueExpr: "id",
        width: 240
    };
});
