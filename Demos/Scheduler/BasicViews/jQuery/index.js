$(function(){
    $("#scheduler").dxScheduler({
        dataSource: data,
        views: ["day", "week", "workWeek", "month"],
        currentView: "day",
        currentDate: new Date(2017, 4, 25),
        startDayHour: 9,
        height: 600
    });
});