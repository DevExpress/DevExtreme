$(function(){
    $("#scheduler").dxScheduler({
        timeZone: "America/Los_Angeles",
        dataSource: data,
        views: ["day", "week", "month"],
        currentView: "month",
        currentDate: new Date(2020, 10, 25),
        startDayHour: 9,
        resources: [{
            fieldExpr: "roomId",
            dataSource: resourcesData,
            label: "Room"
        }],
        height: 600
    });
});