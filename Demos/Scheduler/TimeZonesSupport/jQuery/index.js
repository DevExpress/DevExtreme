$(function () {
    const currentDate = new Date(2021, 4, 25);

    const getLocations = (date) => {
        const timeZones = DevExpress.utils.getTimeZones(date);
        return timeZones.filter((timeZone) => {
            return locations.indexOf(timeZone.id) !== -1;
        });
    };

    const demoLocations = getLocations(currentDate);

    var scheduler = $("#scheduler").dxScheduler({
        dataSource: data,
        views: ["workWeek"],
        timeZone: demoLocations[0].id,
        currentView: "workWeek",
        currentDate: currentDate,
        startDayHour: 8,
        height: 600,
        editing: {
            allowTimeZoneEditing: true
        },
        onOptionChanged: (e) => {
            if(e.name === 'currentDate') {                        
                locationSwitcher.option('items', getLocations(e.value));
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
        }
    }).dxScheduler("instance");

    const locationSwitcher = $("#location-switcher").dxSelectBox({
        items: demoLocations,
        displayExpr: "title",
        valueExpr: "id",
        width: 240,
        value: demoLocations[0].id,
        onValueChanged: function(data) {
            scheduler.option("timeZone", data.value);
        }
    }).dxSelectBox('instance');
});
