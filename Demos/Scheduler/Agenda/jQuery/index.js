$(function(){
    $("#scheduler").dxScheduler({
        timeZone: "America/Los_Angeles",
        dataSource: data,
        views: ["agenda"],
        currentView: "agenda",
        currentDate: new Date(2021, 4, 11),
        startDayHour: 9,
        resources: [
            {
                fieldExpr: "ownerId",
                allowMultiple: true,
                dataSource: owners,
                label: "Owner",
                useColorAsDefault: true
            }, {
                fieldExpr: "priorityId",
                allowMultiple: true,
                dataSource: priorities,
                label: "Priority"
            }],
        height: 600
    });
});