$(function () {
    var scheduler = $("#scheduler").dxScheduler({
        timeZone: "America/Los_Angeles",
        dataSource: data,
        views: ["week", "month"],
        adaptivityEnabled: true,
        currentView: "month",
        height: 590,
        currentDate: new Date(2021, 2, 25),
        startDayHour: 9,
        resources: [{
            fieldExpr: "priorityId",
            dataSource: priorities,
            label: "Priority"
        }]
    }).dxScheduler("instance");
    
    $("#speedDialAction").dxSpeedDialAction({
        icon: "plus",
        onClick: function () {
            scheduler.showAppointmentPopup();
        }
    })
});