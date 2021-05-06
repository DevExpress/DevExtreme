$(function () {
    var startDay = new Date(2021, 1, 1);
    var endDay = new Date(2021, 1, 28);
  
    var startDayHour = 8
    var endDayHour = 20

    var appointments = generateAppointments(startDay, endDay, startDayHour, endDayHour);

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
        startDayHour: startDayHour,
        endDayHour: endDayHour,
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
