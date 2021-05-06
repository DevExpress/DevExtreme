$(function(){
    $("#scheduler").dxScheduler({
        timeZone: "America/Los_Angeles",
        dataSource: data,
        views: ["week", "month"],
        currentView: "week",
        currentDate: new Date(2021, 2, 28),
        startDayHour: 9,
        height: 600
    }).dxScheduler("instance");
});