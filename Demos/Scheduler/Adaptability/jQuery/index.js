$(function () {
    var scheduler = $("#scheduler").dxScheduler({
        dataSource: data,
        views: ["week", "month"],
        adaptivityEnabled: true,
        currentView: "month",
        height: 590,
        currentDate: new Date(2017, 4, 25),
        startDayHour: 9,
        resources: [{
            fieldExpr: "priorityId",
            dataSource: priorities,
            label: "Priority"
        }]
    }).dxScheduler("instance");
    
    var createAppointmentPopupData = function() {
        var currentDate = scheduler.option('currentDate');
        var cellDuration = scheduler.option('cellDuration');
        return {
            startDate: new Date(currentDate),
            endDate: new Date(currentDate.setMinutes(cellDuration))
        };
    }
    
    $("#speedDialAction").dxSpeedDialAction({
        icon: "plus",
        onClick: function () {
            scheduler.showAppointmentPopup(createAppointmentPopupData());
        }
    })
});