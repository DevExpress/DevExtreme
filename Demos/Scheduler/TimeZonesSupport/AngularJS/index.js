var DemoApp = angular.module('DemoApp', ['dx']);

getLocations = (date) => {
    const timeZones = DevExpress.utils.getTimeZones(date);
    return timeZones.filter((timeZone) => {
        return this.locations.indexOf(timeZone.id) !== -1;
    });
};

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.currentDate = new Date(2021, 4, 25);
    $scope.demoLocations = getLocations(new Date(2021, 4, 25));
    $scope.currentLocation = $scope.demoLocations[0].id;

    $scope.schedulerOptions = {
        bindingOptions: {
            timeZone: "currentLocation"
        },
        dataSource: data,
        views: ["workWeek"],
        currentView: "workWeek",
        currentDate: new Date(2021, 4, 25),
        height: 600,
        startDayHour: 8,
        onOptionChanged: (e) => {
            if(e.name === 'currentDate') {   
                $scope.demoLocations = getLocations(e.value);
            }
        },
        onAppointmentFormOpening: (e) => {
            const form = e.form;

            const startDateTimezoneEditor = form.getEditor('startDateTimeZone');
            const endDateTimezoneEditor = form.getEditor('endDateTimeZone');
            const startDatedataSource = startDateTimezoneEditor.option('dataSource');
            const endDateDataSource = endDateTimezoneEditor.option('dataSource');

            startDatedataSource.filter(['id', 'contains', 'Europe']);
            endDateDataSource.filter(['id', 'contains', 'Europe']);

            startDatedataSource.load();
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
