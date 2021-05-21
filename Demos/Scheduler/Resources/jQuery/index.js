$(function(){
    var scheduler = $("#scheduler").dxScheduler({
        timeZone: "America/Los_Angeles",
        dataSource: data,
        views: ["workWeek"],
        currentView: "workWeek",
        currentDate: new Date(2021, 3, 27),
        startDayHour: 9,
        endDayHour: 19,
        resources: [
        {
            fieldExpr: "roomId",
            allowMultiple: true,
            dataSource: rooms,
            label: "Room"
        }, {
            fieldExpr: "priorityId",
            allowMultiple: true,
            dataSource: priorities,
            label: "Priority"
        }, {
            fieldExpr: "ownerId",
            allowMultiple: true,
            dataSource: owners,
            label: "Owner"
        }],
        height: 600
    }).dxScheduler("instance");
    
    $("#resources-selector").dxRadioGroup({
        items: resourcesList,
        value: resourcesList[0],
        layout: "horizontal",
        onValueChanged: function(e) {
            var resources = scheduler.option("resources");

            for(var i = 0; i < resources.length; i++) {
                resources[i].useColorAsDefault = resources[i].label == e.value;
            }

            scheduler.repaint();
        }
    });
});