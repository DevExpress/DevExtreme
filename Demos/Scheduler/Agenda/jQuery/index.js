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
                fieldExpr: "assigneeId",
                allowMultiple: true,
                dataSource: assignees,
                label: "Assignee",
                useColorAsDefault: true
            }, {
                fieldExpr: "priorityId",
                dataSource: priorities,
                label: "Priority"
            }],
        height: 600
    });
});