$(function(){
    $("#scheduler").dxScheduler({
        timeZone: "America/Los_Angeles",
        dataSource: data,
        views: ["week", "month"],
        currentView: "week",
        currentDate: new Date(2021, 4, 27),
        startDayHour: 9,
        height: 600
    }).dxScheduler("instance");
});