$(function () {
    var appointments = generateAppointments();

    $('#scheduler').dxScheduler({
        height: 600,
        width: 800,
        currentDate: new Date(2021, 1, 2),
        dataSource: appointments,
        views: ['workWeek', 'timelineWorkWeek'],
        currentView: "timelineWorkWeek",
        firstDayOfWeek: 0,
        startDayHour: 8,
        endDayHour: 20,
        cellDuration: 60,
        scrolling: {
            mode: 'virtual',
            orientation: 'both'
        },
        showAllDayPanel: false,
        groups: ["humanId"],
        resources: [{
            fieldExpr: "humanId",
            allowMultiple: false,
            dataSource: resources
        }]
    });
});
