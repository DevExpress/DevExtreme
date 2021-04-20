$(function () {
    var appointments = generateAppointments();

    $('#scheduler').dxScheduler({
        height: 600,
        currentDate: new Date(2021, 1, 2),
        dataSource: appointments,
        views: [
            {
                type: "timelineWorkWeek",
                name: "Timeline",
                groupOrientation: "vertical"
            },
            {
                type: "workWeek",
                groupOrientation: "vertical"
            },
            {
                type: "month",
                groupOrientation: "horizontal"
            }
        ],
        currentView: "Timeline",
        firstDayOfWeek: 0,
        startDayHour: 8,
        endDayHour: 20,
        cellDuration: 60,
        scrolling: {
            mode: "virtual"
        },
        showAllDayPanel: false,
        groups: ["humanId"],
        resources: [{
            fieldExpr: "humanId",
            dataSource: resources,
            label: "Employee"
        }]
    });
});
