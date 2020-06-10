$(function(){
    $("#scheduler").dxScheduler({
        dataSource: data,
        views: ["day", "week", "month"],
        currentView: "month",
        currentDate: new Date(2017, 4, 25),
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