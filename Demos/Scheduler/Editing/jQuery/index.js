$(function () {
    function showToast(event, value, type) {
        DevExpress.ui.notify(event + " \"" + value + "\"" + " task", type, 800);
    }

    var scheduler = $("#scheduler").dxScheduler({
        dataSource: data,
        views: ["day", "week"],
        currentView: "week",
        currentDate: new Date(2021, 4, 27),
        startDayHour: 9,
        endDayHour: 19,
        editing: {
            allowAdding: true,
            allowDeleting: true,
            allowUpdating: true,
            allowResizing: true,
            allowDragging: true
        },
        onAppointmentAdded: function(e) {
            showToast("Added",e.appointmentData.text, "success");
        },
        onAppointmentUpdated: function(e) {
            showToast("Updated",e.appointmentData.text, "info");
        },
        onAppointmentDeleted: function(e) {
            showToast("Deleted",e.appointmentData.text, "warning");
        },
        height: 600
    }).dxScheduler("instance");

    $("#allow-adding").dxCheckBox({
        text: "Allow adding",
        value: true,
        onValueChanged: function(e) {
            scheduler.option("editing.allowAdding", e.value);
        }
    });

    $("#allow-deleting").dxCheckBox({
        text: "Allow deleting",
        value: true,
        onValueChanged: function(e) {
            scheduler.option("editing.allowDeleting", e.value);
        }
    });

    $("#allow-updating").dxCheckBox({
        text: "Allow updating",
        value: true,
        onValueChanged: function(e) {
            scheduler.option("editing.allowUpdating", e.value);
            dragging.option("disabled", !e.value);
            resizing.option("disabled", !e.value);
        }
    });

    var resizing = $("#allow-resizing").dxCheckBox({
        text: "Allow resizing",
        value: true,
        onValueChanged: function (e) {
            scheduler.option("editing.allowResizing", e.value);
        }
    }).dxCheckBox("instance");

    var dragging = $("#allow-dragging").dxCheckBox({
        text: "Allow dragging",
        value: true,
        onValueChanged: function(e) {
            scheduler.option("editing.allowDragging", e.value);
        }
    }).dxCheckBox("instance");

});
