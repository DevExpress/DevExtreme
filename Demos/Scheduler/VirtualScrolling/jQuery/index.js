$(function () {
    var resources = generateResources();
    var appointments = generateAppointments();

    $("#scheduler").dxScheduler({
        height: 600,
        dataSource: appointments,
        views: [{
            type: 'day',
            groupOrientation: 'vertical',
            name: '2 Days',
            intervalCount: 2
        }, {
            type: 'day',
            groupOrientation: 'vertical',
            name: '3 Days',
            intervalCount: 3
        }, {
            type: "workWeek",
            name: 'Work Week',
            groupOrientation: "vertical"
        }],
        startDayHour: 9,
        endDayHour: 18,
        currentView: "3 Days",
        scrolling: {
            mode: 'virtual'
        },
        showAllDayPanel: false,
        currentDate: new Date(2021, 8, 6),
        groups: ["resourceId"],
        resources: [{
            fieldExpr: "resourceId",
            dataSource: resources
        }]
    });
});
