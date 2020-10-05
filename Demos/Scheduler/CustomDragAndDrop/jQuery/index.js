$(function () {
    var draggingGroupName = "appointmentsGroup";

    var createItemElement = function(data) {
        $("<div>")
            .text(data.text)
            .addClass("item dx-card dx-theme-background-color dx-theme-text-color")
            .appendTo("#list")
            .dxDraggable({
                group: draggingGroupName,
                data: data,
                clone: true,
                onDragEnd: function(e) {
                    if (e.toData) {
                        e.cancel = true;
                    }
                },
                onDragStart: function(e) {
                    e.itemData = e.fromData;
                }
            });
    }

    $("#scroll").dxScrollView({});

    $("#list").dxDraggable({
        data: "dropArea",
        group: draggingGroupName,
        onDragStart: function(e) {
            e.cancel = true;
        }
    });

    tasks.forEach(function(task) {
        createItemElement(task);
    });

    $("#scheduler").dxScheduler({
        dataSource: appointments,
        views: [{
            type: "day",
            intervalCount: 3
        }],
        currentDate: new Date(2021, 4, 24),
        startDayHour: 9,
        height: 600,
        editing: true,
        appointmentDragging: {
            group: draggingGroupName,
            onRemove: function(e) {
                e.component.deleteAppointment(e.itemData);
                createItemElement(e.itemData);
            },
            onAdd: function(e) {
                e.component.addAppointment(e.itemData);
                e.itemElement.remove();
            }
        }
    });
});
