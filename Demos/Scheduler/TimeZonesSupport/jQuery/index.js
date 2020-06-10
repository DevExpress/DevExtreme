$(function () {
    var scheduler = $("#scheduler").dxScheduler({
        dataSource: data,
        views: ["workWeek"],
        timeZone: locations[0].timeZoneId,
        currentView: "workWeek",
        currentDate: new Date(2017, 4, 25),
        height: 600,
        editing: {
            allowTimeZoneEditing: true
        },
    }).dxScheduler("instance");

    $("#location-switcher").dxSelectBox({
        items: locations,
        displayExpr: "text",
        valueExpr: "timeZoneId",
        width: 240,
        value: locations[0].timeZoneId,
        onValueChanged: function(data) {
            scheduler.option("timeZone", data.value);
        }
    });
});
