$(function(){
    $("#scheduler").dxScheduler({
        timeZone: "America/Los_Angeles",
        dataSource: data,
        views: ["day", "week", "month"],
        currentView: "month",
        currentDate: new Date(2021, 2, 25),
        firstDayOfWeek: 1,
        startDayHour: 9,
        resources: [{
            fieldExpr: "roomId",
            dataSource: resourcesData,
            label: "Room"
        }],
        height: 600
    });
});